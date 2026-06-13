// DSE Insight Pro - AI Screenshot Vision Engine
const VisionEngine = {
  // Analyze screenshot - supports preset images, live OpenRouter API, or simulated fallback
  async analyzeScreenshot(file, options = {}) {
    const { useRealAI = false, apiKey = "" } = options;
    const base64Data = await this.fileToBase64(file);

    // 1. Check if the file is one of our local presets (by filename matching)
    const fileName = file.name;
    const presetKey = Object.keys(DSE_DATABASE.presetAnalyses).find(
      key => key.toLowerCase().replace(/\s+/g, '') === fileName.toLowerCase().replace(/\s+/g, '')
    );

    if (presetKey) {
      console.log(`Matching preset found: ${presetKey}`);
      // Simulate scanning delay
      await this.sleep(2000);
      return {
        ...DSE_DATABASE.presetAnalyses[presetKey],
        imageSrc: base64Data,
        engine: "Local Preset Matching Engine"
      };
    }

    // 2. Attempt Live AI Vision Scan (tries Vercel serverless backend first, then client key direct fetch)
    try {
      return await this.callOpenRouterVision(base64Data, apiKey);
    } catch (err) {
      console.warn("Live AI Vision Scan failed, falling back to simulated analysis:", err);
      // Fall back to simulation
      const simulated = await this.simulateAnalysis(file, base64Data);
      
      // If the user explicitly toggled Real AI or entered a key, show them the error alert
      if (useRealAI || apiKey) {
        simulated.error = `API Error: ${err.message}. Showing simulated analysis instead.`;
      }
      return simulated;
    }
  },

  // Call OpenRouter Gemini 2.5 Flash Vision model
  async callOpenRouterVision(base64Data, apiKey) {
    // 1. Try secure Serverless Route first (ideal for Vercel production deployment)
    let serverlessActive = false;
    let serverlessError = null;
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          base64Data: base64Data
        })
      });

      if (response.ok) {
        const parsed = await response.json();
        return {
          ...parsed,
          imageSrc: base64Data,
          engine: "Live Vercel Serverless Vision Engine (Gemini Flash)"
        };
      } else {
        serverlessActive = true;
        const errorData = await response.json().catch(() => ({}));
        serverlessError = errorData.error || `HTTP ${response.status}`;
        console.warn(`Serverless API returned error status ${response.status}:`, serverlessError);
      }
    } catch (err) {
      console.warn("Serverless endpoint failed or not detected:", err);
    }

    // 2. Direct Fallback: Client-side fetch query (for local dev or when Vercel env key is not configured)
    const cleanKey = (apiKey || "").trim().split(/\s+/)[0].replace(/^["']|["']$/g, "");
    if (!cleanKey) {
      if (serverlessActive && serverlessError) {
        throw new Error(`Serverless API Error: ${serverlessError}`);
      }
      throw new Error("API Key is not configured (neither on Vercel environment variables nor in the client settings).");
    }

    console.log("Using client-side direct API query with the provided API key.");
    const isGoogleKey = cleanKey.startsWith("AIzaSy") || cleanKey.startsWith("AQ.");
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

    if (isGoogleKey) {
      const base64Image = base64Data.split(",")[1] || base64Data;
      const mimeType = base64Data.split(";")[0].split(":")[1] || "image/jpeg";

      const directResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cleanKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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

      if (!directResponse.ok) {
        const errorText = await directResponse.text();
        throw new Error(`Direct Google Gemini API Error: ${errorText}`);
      }

      const data = await directResponse.json();
      const contentText = data.candidates[0].content.parts[0].text;
      const parsed = this.extractJSON(contentText);
      return {
        ...parsed,
        imageSrc: base64Data,
        engine: "Live Client-Side Gemini Vision Engine (Direct Gemini Flash)"
      };
    } else {
      const directResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cleanKey}`,
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
                  text: promptText
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

      if (!directResponse.ok) {
        const errorText = await directResponse.text();
        throw new Error(`Direct OpenRouter API Error: ${errorText}`);
      }

      const data = await directResponse.json();
      const content = data.choices[0].message.content;
      const parsed = this.extractJSON(content);
      
      return {
        ...parsed,
        imageSrc: base64Data,
        engine: "Live Client-Side OpenRouter Vision Engine (Gemini Flash)"
      };
    }
  },

  // Simulated AI scanner that runs client-side
  async simulateAnalysis(file, base64Data) {
    await this.sleep(3000); // Realistic AI scan delay

    // Pick a random security from our list
    const security = DSE_DATABASE.securities[Math.floor(Math.random() * DSE_DATABASE.securities.length)];
    
    // Generate pseudo-random technical parameters based on the stock's base pricing
    const rsiVal = (Math.random() * 55 + 25).toFixed(1); // 25 to 80
    let trend = "Neutral Consolidation";
    let trendBn = "নিরপেক্ষ কনসোলিডেশন বা স্থিতিশীল অবস্থা";
    let rsiInterpretation = "RSI is in the neutral zone, indicating a balance between buyer and seller pressure.";
    let rsiInterpretationBn = "আরএসআই নিরপেক্ষ জোনে রয়েছে, যা ক্রেতা ও বিক্রেতার চাপের মধ্যে ভারসাম্য নির্দেশ করে।";
    
    // Determine recommendation and confidence based on RSI
    let recommendation = "NEUTRAL";
    let recommendationBn = "নিরপেক্ষ";
    let confidence = 7;
    
    if (rsiVal > 70) {
      trend = "Strong Bullish (Overextended)";
      trendBn = "দৃঢ় বুলিশ বা অতিরিক্ত ক্রয় চাপ";
      rsiInterpretation = `RSI at ${rsiVal} suggests the asset is heavily overbought. Expect a near-term correction.`;
      rsiInterpretationBn = `আরএসআই ${rsiVal} নির্দেশ করে যে সম্পদটি অতিরিক্ত কেনা হয়েছে। নিকটবর্তী সময়ে মূল্য সংশোধনের আশা করুন।`;
      recommendation = "AVOID";
      recommendationBn = "পরিহার";
      confidence = 9;
    } else if (rsiVal < 30) {
      trend = "Strong Bearish (Oversold)";
      trendBn = "দৃঢ় বেয়ারিশ বা অতিরিক্ত বিক্রি চাপ";
      rsiInterpretation = `RSI at ${rsiVal} indicates severe oversold conditions. A relief rally could occur.`;
      rsiInterpretationBn = `আরএসআই ${rsiVal} নির্দেশ করে বাজার অতিরিক্ত বিক্রি হয়েছে। একটি রিলেফ র্যালি বা মূল্য পুনরুদ্ধার ঘটতে পারে।`;
      recommendation = "BUY";
      recommendationBn = "ক্রয়";
      confidence = 8;
    } else if (rsiVal > 55) {
      trend = "Moderate Uptrend";
      trendBn = "মাঝারি ধরনের ঊর্ধ্বমুখী বা আপট্রেন্ড";
      rsiInterpretation = `RSI is at ${rsiVal}, indicating positive bullish momentum building up.`;
      rsiInterpretationBn = `আরএসআই ${rsiVal}-এ রয়েছে, যা ইতিবাচক বুলিশ মোমেন্টাম গড়ে ওঠার নির্দেশক।`;
      recommendation = "BUY";
      recommendationBn = "ক্রয়";
      confidence = 7;
    } else if (rsiVal < 45) {
      trend = "Moderate Downtrend";
      trendBn = "মাঝারি ধরনের নিম্নমুখী বা ডাউনট্রেন্ড";
      rsiInterpretation = `RSI is at ${rsiVal}, reflecting weak relative strength and seller advantage.`;
      rsiInterpretationBn = `আরএসআই ${rsiVal}-এ রয়েছে, যা দুর্বল আপেক্ষিক শক্তি এবং বিক্রেতাদের আধিপত্য নির্দেশ করে।`;
      recommendation = "SELL";
      recommendationBn = "বিক্রয়";
      confidence = 8;
    }

    const basePrice = security.price;
    const supportVal = (basePrice * 0.95).toFixed(2);
    const resistanceVal = (basePrice * 1.05).toFixed(2);
    const macdCross = Math.random() > 0.5 ? "Bullish Crossover" : "Bearish Divergence";

    const macdInterpretation = macdCross === "Bullish Crossover" 
      ? "MACD histogram is expanding positive above zero line, suggesting buyers are building short-term momentum."
      : "MACD lines are turning flat below signal thresholds, showing deceleration of the buying pressure.";
    
    const macdInterpretationBn = macdCross === "Bullish Crossover"
      ? "এমএসিডি হিস্টোগ্রাম জিরো লাইনের উপরে ইতিবাচকভাবে প্রসারিত হচ্ছে, যা নির্দেশ করে ক্রেতারা স্বল্পমেয়াদী গতি তৈরি করছে।"
      : "এমএসিডি লাইনগুলো সিগন্যাল থ্রেশহোল্ডের নিচে সমতল হচ্ছে, যা ক্রয় চাপ হ্রাসের প্রবণতা নির্দেশ করে।";

    const pattern = Math.random() > 0.5 
      ? "Bullish Engulfing pattern formed on above-average volume." 
      : "Spinning top near resistance indicating indecision and possible reversal.";
    const patternBn = Math.random() > 0.5
      ? "গড় ভলিউমের চেয়ে বেশি ভলিউমে বুলিশ এনগালফিং প্যাটার্ন তৈরি হয়েছে।"
      : "রেজিস্ট্যান্সের কাছে স্পিনিং টপ তৈরি হয়েছে, যা অনিশ্চয়তা এবং সাময়িক বিপরীতমুখী ট্রেন্ডের ইঙ্গিত দেয়।";

    const outlook = trend.includes("Bullish") 
      ? "Bullish outlook. Target tests of prior resistance zones. Recommended watch level: BDT " + resistanceVal
      : "Cautious outlook. Recommend waiting for high-volume breakout or support stabilization.";
    const outlookBn = trend.includes("Bullish")
      ? `বুলিশ আউটলুক। পূর্ববর্তী রেজিস্ট্যান্স পরীক্ষা করার লক্ষ্য। প্রস্তাবিত পর্যবেক্ষণ স্তর: BDT ${resistanceVal}`
      : "সতর্কতামূলক আউটলুক। উচ্চ-ভলিউম ব্রেকআউট বা সাপোর্ট জোনে স্থির হওয়ার জন্য অপেক্ষা করার পরামর্শ রইল।";

    return {
      ticker: security.ticker,
      name: security.name,
      platform: ["StockNow Charts", "AmarStock Portal", "DSE Advanced Charts"][Math.floor(Math.random() * 3)],
      indicators: ["RSI (14)", "MACD (12, 26, 9)", "EMA 50", "EMA 200", "Volume"],
      analysis: {
        recommendation: recommendation,
        recommendationBn: recommendationBn,
        confidence: confidence,
        trend: `${trend}. Price action displays active consolidation near BDT ${basePrice}.`,
        trendBn: `${trendBn}। প্রাইস অ্যাকশন বর্তমানে BDT ${basePrice} এর কাছাকাছি কনসোলিডেট করছে।`,
        rsi: {
          value: parseFloat(rsiVal),
          interpretation: rsiInterpretation,
          interpretationBn: rsiInterpretationBn
        },
        macd: {
          value: macdCross,
          interpretation: macdInterpretation,
          interpretationBn: macdInterpretationBn
        },
        supportResistance: {
          support: `BDT ${supportVal} (Recent dynamic baseline / low-volume accumulation node)`,
          supportBn: `BDT ${supportVal} (সাম্প্রতিক ডায়নামিক বেসলাইন / স্বল্প-ভলিউম সঞ্চয় নোড)`,
          resistance: `BDT ${resistanceVal} (Moving average overlap / key supply zone)`,
          resistanceBn: `BDT ${resistanceVal} (মুভিং অ্যাভারেজ ওভারল্যাপ / প্রধান সরবরাহ অঞ্চল)`
        },
        candlestickPattern: pattern,
        candlestickPatternBn: patternBn,
        outlook: outlook,
        outlookBn: outlookBn
      },
      imageSrc: base64Data,
      engine: "Mock AI Vision Engine (Client-Side Dynamic Parser)"
    };
  },

  // Helper: Extract valid JSON from LLM output (handles potential markdown wrappers)
  extractJSON(text) {
    try {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        return JSON.parse(text.slice(start, end + 1));
      }
      return JSON.parse(text);
    } catch (e) {
      throw new Error("Failed to parse clean JSON from AI: " + e.message);
    }
  },

  // Helper: File to Base64 String with client-side image compression & resizing
  fileToBase64(file) {
    if (!(file instanceof Blob)) {
      return file.name ? `./assets/${file.name}` : "";
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
        URL.revokeObjectURL(img.src);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(img.src);
        reject(err);
      };
      img.src = URL.createObjectURL(file);
    });
  },

  // Helper: sleep promise
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
