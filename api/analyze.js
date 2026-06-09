// Vercel Serverless Function: /api/analyze
export default async function handler(req, res) {
  // Guard method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'Missing base64Data parameter' });
    }

    // Retrieve API Key securely from Vercel Environment Variables.
    const apiKey = process.env.GEMINI_API_KEY || "";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://dseinsightpro.com",
        "X-Title": "DSE Insight Pro"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a professional financial technical analyst. Analyze this Dhaka Stock Exchange (DSE) stock chart screenshot. Identify:
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
}`
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Data
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter Vision Error: ${errorText}` });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Vercel Serverless Function Error:", err);
    return res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}
