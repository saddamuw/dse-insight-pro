const crypto = require('crypto');

// Prompt for DSE Stock Chart Screenshot analysis
const promptText = `You are a professional financial technical analyst. Analyze this Dhaka Stock Exchange (DSE) stock chart screenshot. Identify:
1. Stock Ticker or Company name (must match a DSE stock or represent a real stock on DSE).
2. Current price trend and patterns.
3. Key technical indicators visible (RSI, MACD, Moving Averages, etc.) and their values.
4. Support and Resistance levels.
5. Actionable technical outlook in plain language.

You MUST respond strictly in a valid JSON object structure like this:
{
  "ticker": "TICKER_SYMBOL",
  "name": "Full Company Name PLC",
  "platform": "Platform Source (StockNow, AmarStock, DSE Chart, or TradingView)",
  "indicators": ["RSI (14)", "MACD", "EMA 50"],
  "analysis": {
    "recommendation": "BUY | SELL | HOLD | AVOID | NEUTRAL",
    "recommendationBn": "ক্রয় | বিক্রয় | হোল্ড | পরিহার | নিরপেক্ষ",
    "confidence": 8,
    "trend": "Detailed description of the trend in English.",
    "trendBn": "Detailed description of the trend in Bengali.",
    "rsi": { 
      "value": 52.5, 
      "interpretation": "Detailed RSI interpretation in English.",
      "interpretationBn": "Detailed RSI interpretation in Bengali."
    },
    "macd": { 
      "value": "Bullish/Bearish values", 
      "interpretation": "Detailed MACD interpretation in English.",
      "interpretationBn": "Detailed MACD interpretation in Bengali."
    },
    "supportResistance": {
      "support": "BDT XX.XX (English Explanation)",
      "supportBn": "BDT XX.XX (Bengali Explanation)",
      "resistance": "BDT XX.XX (English Explanation)",
      "resistanceBn": "BDT XX.XX (Bengali Explanation)"
    },
    "candlestickPattern": "Description of pattern in English.",
    "candlestickPatternBn": "Description of pattern in Bengali.",
    "outlook": "Outlook summary in English.",
    "outlookBn": "Outlook summary in Bengali."
  }
}`;

// Helper: Extract valid JSON from LLM output (handles potential markdown wrappers)
function extractJSON(text) {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.slice(start, end + 1));
    }
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Failed to parse clean JSON from LLM: " + e.message);
  }
}

// GCP Cloud Function Handler (Http Trigger)
exports.analyze = async (req, res) => {
  // 1. CORS Validation & Headers Configuration
  const origin = req.headers.origin || req.headers.referer || "";
  const isAllowed = origin.includes("dse-insight-pro.vercel.app") || 
                    origin.includes("localhost") || 
                    origin.includes("127.0.0.1");

  if (isAllowed) {
    res.set('Access-Control-Allow-Origin', req.headers.origin || '*');
  } else {
    // Log blocked cross-origin attempt
    console.warn(`Blocked request from unauthorized origin: ${origin}`);
    return res.status(403).json({ error: "Forbidden: Cross-origin request blocked." });
  }

  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle Preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  // Ensure POST requests only
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'Missing base64Data parameter' });
    }

    // 2. Self-Configure credentials via local GCP Metadata Server
    let projectId;
    try {
      const projRes = await fetch("http://metadata.google.internal/computeMetadata/v1/project/project-id", {
        headers: { "Metadata-Flavor": "Google" }
      });
      projectId = await projRes.text();
    } catch (err) {
      // Local fallback for offline environment testing
      projectId = process.env.GCP_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || "dse-insight-pro";
    }

    let accessToken = null;
    try {
      const tokenRes = await fetch("http://metadata.google.internal/computeMetadata/v1/instance/service-account/default/token", {
        headers: { "Metadata-Flavor": "Google" }
      });
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        accessToken = tokenData.access_token;
      }
    } catch (err) {
      // Local fallback if token is passed via dev environment
      accessToken = process.env.GCP_ACCESS_TOKEN || null;
    }

    // 3. Compute SHA-256 Hash of image base64
    const imgHash = crypto.createHash('sha256').update(base64Data).digest('hex');
    const firestoreDocPath = `projects/${projectId}/databases/(default)/documents/dse_cache/${imgHash}`;
    const firestoreUrl = `https://firestore.googleapis.com/v1/${firestoreDocPath}`;

    // 4. Query Firestore Cache
    if (accessToken) {
      try {
        console.log(`Checking Firestore Cache for document: ${imgHash}`);
        const cacheRes = await fetch(firestoreUrl, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (cacheRes.ok) {
          const doc = await cacheRes.json();
          if (doc.fields && doc.fields.analysis && doc.fields.analysis.stringValue) {
            console.log(`Cache Hit for Image Hash: ${imgHash}`);
            const cachedReport = JSON.parse(doc.fields.analysis.stringValue);
            return res.status(200).json({
              ...cachedReport,
              imageSrc: base64Data,
              engine: "Cached DSE Analysis Engine (GCP Firestore)"
            });
          }
        } else if (cacheRes.status !== 404) {
          console.warn(`Firestore cache request returned non-404 status: ${cacheRes.status}`);
        }
      } catch (err) {
        console.warn("Firestore Cache fetch failed:", err);
      }
    }

    // 5. Cache Miss -> Invoke GCP Vertex AI Gemini 2.5 Flash API
    console.log(`Cache Miss. Analyzing chart using GCP Vertex AI...`);
    const base64Image = base64Data.split(",")[1] || base64Data;
    const mimeType = base64Data.split(";")[0].split(":")[1] || "image/jpeg";
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-2.5-flash:generateContent`;

    const headers = { "Content-Type": "application/json" };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const vertexRes = await fetch(vertexUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!vertexRes.ok) {
      const errText = await vertexRes.text();
      console.error(`Vertex AI API Error response: ${errText}`);
      return res.status(vertexRes.status).json({ error: `GCP Vertex AI Error: ${errText}` });
    }

    const vertexData = await vertexRes.json();
    const contentText = vertexData.candidates[0].content.parts[0].text;
    const parsedReport = extractJSON(contentText);

    // 6. Write New Scan report to Firestore Cache (Asynchronous background task)
    if (accessToken) {
      console.log(`Writing result to Firestore cache for image: ${imgHash}`);
      fetch(firestoreUrl, {
        method: "PATCH", // Using PATCH creates the document if it doesn't exist
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            analysis: { stringValue: JSON.stringify(parsedReport) },
            createdAt: { stringValue: new Date().toISOString() }
          }
        })
      }).then(writeRes => {
        if (!writeRes.ok) {
          console.warn(`Async Firestore cache write failed with status ${writeRes.status}`);
        }
      }).catch(err => {
        console.warn("Async Firestore cache write threw error:", err);
      });
    }

    // 7. Return Response
    return res.status(200).json({
      ...parsedReport,
      imageSrc: base64Data,
      engine: "Live GCP Vertex AI Engine (Gemini 2.5 Flash)"
    });

  } catch (err) {
    console.error("Cloud Function Server Error:", err);
    return res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
};
