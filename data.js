// DSE Insight Pro - Mock Database & Global Configurations
const DSE_DATABASE = {
  // Pre-configured OpenRouter key placeholder (set via .env or in-app UI)
  defaultApiKey: "",
  
  // DSE Listed Securities metadata for autocomplete
  securities: [
    { ticker: "SQURPHARMA", name: "Square Pharmaceuticals PLC", sector: "Pharmaceuticals & Chemicals", price: 216.5, change: 1.2, pe: 11.4, rsi: 48, trend: "Neutral-Bullish" },
    { ticker: "FINEFOODS", name: "Fine Foods Limited", sector: "Food & Allied", price: 148.2, change: 5.8, pe: 64.1, rsi: 78, trend: "Overbought / Risky" },
    { ticker: "BEXIMCO", name: "Bangladesh Export Import Company Ltd.", sector: "Miscellaneous", price: 115.6, change: 0.0, pe: 24.5, rsi: 35, trend: "Sideways" },
    { ticker: "GP", name: "Grameenphone Ltd.", sector: "Telecommunication", price: 282.4, change: -0.8, pe: 12.1, rsi: 42, trend: "Neutral" },
    { ticker: "BRACBANK", name: "BRAC Bank PLC.", sector: "Banking", price: 44.5, change: 2.1, pe: 8.9, rsi: 61, trend: "Bullish" },
    { ticker: "LHIB", name: "LafargeHolcim Bangladesh PLC.", sector: "Cement", price: 68.7, change: -1.3, pe: 14.2, rsi: 39, trend: "Bearish" },
    { ticker: "BATBC", name: "British American Tobacco Bangladesh Company Limited", sector: "Food & Allied", price: 395.0, change: 0.5, pe: 15.3, rsi: 50, trend: "Neutral" },
    { ticker: "ROBI", name: "Robi Axiata PLC.", sector: "Telecommunication", price: 26.2, change: -0.4, pe: 31.8, rsi: 45, trend: "Neutral" },
    { ticker: "BEXGSUKUK", name: "Beximco Green Sukuk Al Istisna'a", sector: "Corporate Bond", price: 85.0, change: 0.2, pe: null, rsi: 46, trend: "Neutral" },
    { ticker: "KPCL", name: "Khulna Power Company Limited", sector: "Fuel & Power", price: 28.9, change: 3.2, pe: -15.4, rsi: 65, trend: "Bullish" },
    { ticker: "UPGDCL", name: "United Power Generation & Distribution Company Ltd.", sector: "Fuel & Power", price: 195.4, change: -1.1, pe: 13.8, rsi: 41, trend: "Bearish" },
    { ticker: "MJLBD", name: "MJL Bangladesh PLC.", sector: "Fuel & Power", price: 82.1, change: 0.7, pe: 10.2, rsi: 52, trend: "Neutral" }
  ],

  presetAnalyses: {
    "Square Pharma .jpg": {
      ticker: "SQURPHARMA",
      name: "Square Pharmaceuticals PLC",
      platform: "StockNow / TradingView",
      indicators: ["RSI (14)", "MACD (12, 26, 9)", "EMA 50", "EMA 200", "Volume"],
      analysis: {
        recommendation: "BUY",
        recommendationBn: "ক্রয়",
        confidence: 8,
        trend: "Strong accumulation near the BDT 210-212 support zone. Short-term momentum is shifting positive.",
        trendBn: "BDT ২১০-২১২ সাপোর্ট জোনের কাছাকাছি শক্তিশালী ক্রয়ের প্রবণতা। স্বল্পমেয়াদী গতিবেগ ইতিবাচক হচ্ছে।",
        rsi: { 
          value: 48.2, 
          interpretation: "Neutral. Recovering from an oversold boundary of 35, indicating sellers are losing momentum and buying interest is stepping back in.",
          interpretationBn: "নিরপেক্ষ। ৩৫ এর ওভারসোল্ড জোন থেকে মার্কেট রিকভার করছে, যা নির্দেশ করে যে বিক্রেতারা তাদের শক্তি হারাচ্ছে এবং ক্রেতারা পুনরায় বাজারে ফিরছে।"
        },
        macd: { 
          value: "-0.45 / 0.12 Crossover", 
          interpretation: "Bullish Crossover. The MACD line has crossed above the signal line below the zero line, accompanied by shrinking red histogram bars. This is a classic early-stage trend reversal signal.",
          interpretationBn: "বুলিশ ক্রসওভার। এমএসিডি লাইনটি জিরো লাইনের নিচে সিগন্যাল লাইনের উপরে অতিক্রম করেছে, যার সাথে লাল হিস্টোগ্রাম বার ছোট হচ্ছে। এটি একটি ক্লাসিক প্রাথমিক ট্রেন্ড পরিবর্তনের সংকেত।"
        },
        supportResistance: {
          support: "BDT 211.50 (Recent double-bottom test)",
          supportBn: "BDT ২১১.৫০ (সাম্প্রতিক ডাবল-বটম পরীক্ষা)",
          resistance: "BDT 228.00 (EMA 200 overlap), BDT 236.00 (Prior breakout point)",
          resistanceBn: "BDT ২২৮.০০ (EMA ২০০ ওভারল্যাপ), BDT ২৩৬.০০ (পূর্ববর্তী ব্রেকআউট পয়েন্ট)"
        },
        candlestickPattern: "Bullish Hammer tested at support on high volume, indicating strong institutional bidding.",
        candlestickPatternBn: "উচ্চ ভলিউমে সাপোর্টের কাছে বুলিশ হ্যামার প্যাটার্ন তৈরি হয়েছে, যা প্রাতিষ্ঠানিক ক্রয়ের ইঙ্গিত দেয়।",
        outlook: "Cautiously Bullish. Target entry BDT 214-216, watch levels BDT 228 for profit-taking or further consolidation.",
        outlookBn: "সতর্কতার সাথে বুলিশ। ২১৪-২১৬ বিডিটি রেঞ্জে প্রবেশ করা যেতে পারে, প্রফিট-বুকিং বা কনসোলিডেশনের জন্য ২২৮ বিডিটি লক্ষ্য রাখুন।"
      }
    },
    "Finefood.jpg": {
      ticker: "FINEFOODS",
      name: "Fine Foods Limited",
      platform: "AmarStock",
      indicators: ["RSI (14)", "Volume Rate of Change", "Support/Resistance Grid"],
      analysis: {
        recommendation: "AVOID",
        recommendationBn: "পরিহার",
        confidence: 9,
        trend: "Highly volatile vertical price spike on speculative volumes. Parabolic rally shows signs of exhaustion.",
        trendBn: "উচ্চ মাত্রার উদ্বায়ী এবং জল্পনা-কল্পনাভিত্তিক ট্রেডিং ভলিউমের কারণে উল্লম্ব মূল্য বৃদ্ধি। প্যারাবোলিক র্যালি ক্লান্তি বা অবসাদের লক্ষণ দেখাচ্ছে।",
        rsi: { 
          value: 78.5, 
          interpretation: "Extreme Overbought. RSI is hovering deep inside the danger territory (>70). Historically, spikes above 75 in this ticker lead to sudden, high-velocity pullbacks.",
          interpretationBn: "অত্যধিক ওভারবট (বেশি কেনা)। আরএসআই বিপজ্জনক সীমার (>৭০) গভীরে রয়েছে। ঐতিহাসিকভাবে, এই শেয়ারে আরএসআই ৭৫-এর উপরে গেলে দ্রুত ও তীব্র দরপতন ঘটে।"
        },
        macd: { 
          value: "Not plotted / Price-Volume focused", 
          interpretation: "Extreme volume expansion (5x daily average) suggests retail FOMO (Fear of Missing Out). Institutional distributors are likely unloading shares into this strength.",
          interpretationBn: "অত্যধিক ভলিউম বৃদ্ধি (দৈনিক গড়ের ৫ গুণ) সাধারণ বিনিয়োগকারীদের ফোমো (FOMO) নির্দেশ করে। প্রাতিষ্ঠানিক বড় বিনিয়োগকারীরা এই সুযোগে শেয়ার বিক্রি করে বের হয়ে যেতে পারে।"
        },
        supportResistance: {
          support: "BDT 132.00 (Prior console zone), BDT 118.00 (Strong baseline)",
          supportBn: "BDT ১৩২.০০ (পূর্ববর্তী কনসোলিডেশন জোন), BDT ১১৮.০০ (শক্তিশালী বেসলাইন)",
          resistance: "BDT 165.00 (Recent peak / ceiling)",
          resistanceBn: "BDT ১৬৫.০০ (সাম্প্রতিক সর্বোচ্চ সীমা)"
        },
        candlestickPattern: "Shooting Star/Inverted Hammer close to the day's high, suggesting profit booking at elevated levels.",
        candlestickPatternBn: "দিনের সর্বোচ্চ দরের কাছাকাছি শুটিং স্টার বা ইনভার্টেড হ্যামার ক্যান্ডেলস্টিক প্যাটার্ন তৈরি হয়েছে, যা প্রফিট বুকিংয়ের ইঙ্গিত দেয়।",
        outlook: "Bearish / Highly Risky. Avoid fresh entries at current levels. Expect a correction back to the BDT 130-135 support zone.",
        outlookBn: "বেয়ারিশ / উচ্চ ঝুঁকিপূর্ণ। বর্তমান মূল্যে নতুন করে প্রবেশ করা এড়িয়ে চলুন। মূল্য সংশোধন হয়ে ১৩০-১৫৫ বিডিটি সাপোর্ট জোনে ফিরে আসার সম্ভাবনা রয়েছে।"
      }
    },
    "Loser 01.jpg": {
      ticker: "LHIB",
      name: "LafargeHolcim Bangladesh PLC",
      platform: "DSE Portal Chart",
      indicators: ["EMA 50", "EMA 100", "RSI (14)", "Volume"],
      analysis: {
        recommendation: "SELL",
        recommendationBn: "বিক্রয়",
        confidence: 8,
        trend: "Definitive downtrend marked by lower highs and lower lows. Trading below all major exponential moving averages.",
        trendBn: "স্পষ্ট দরপতন বা ডাউনট্রেন্ড, যা প্রতিটি ধাপে আগের চেয়ে কম সর্বোচ্চ এবং সর্বনিম্ন মূল্য দ্বারা চিহ্নিত। শেয়ারটি সমস্ত প্রধান মুভিং অ্যাভারেজের নিচে ট্রেড করছে।",
        rsi: { 
          value: 28.1, 
          interpretation: "Oversold. RSI has dipped below the 30 threshold. While technically oversold, a stock can remain oversold during strong structural bear phases.",
          interpretationBn: "অত্যধিক ওভারসোল্ড (বেশি বিক্রি)। আরএসআই ৩০ এর নিচে নেমে গেছে। এটি ওভারসোল্ড হলেও, একটি শেয়ার তীব্র বেয়ারিশ বা মন্দা বাজারে দীর্ঘ সময় ধরে ওভারসোল্ড থাকতে পারে।"
        },
        macd: { 
          value: "Negative expansion", 
          interpretation: "Bearish Momentum. Moving averages are diverging downwards, reflecting persistent selling pressure and lack of major institutional bids.",
          interpretationBn: "বেয়ারিশ মোমেন্টাম। মুভিং অ্যাভারেজগুলো নিচের দিকে প্রসারিত হচ্ছে, যা অবিরাম বিক্রির চাপ এবং প্রাতিষ্ঠানিক ক্রেতাদের নিষ্ক্রিয়তা নির্দেশ করে।"
        },
        supportResistance: {
          support: "BDT 65.00 (Key psychological support)",
          supportBn: "BDT ৬৫.০০ (গুরুত্বপূর্ণ মনস্তাত্ত্বিক সাপোর্ট)",
          resistance: "BDT 72.50 (EMA 50 dynamic resistance), BDT 76.00 (Prior structural peak)",
          resistanceBn: "BDT ৭২.৫০ (EMA ৫০ ডায়নামিক রেজিস্ট্যান্স), BDT ৭৬.০০ (পূর্ববর্তী কাঠামোগত সর্বোচ্চ সীমা)"
        },
        candlestickPattern: "Consecutive Marubozu-like bearish candles indicating sellers are in complete control of the price action.",
        candlestickPatternBn: "টানা কয়েকটি বড় মারুবোজু-র মতো বেয়ারিশ ক্যান্ডেল তৈরি হয়েছে, যা নির্দেশ করে যে বিক্রেতারা বাজারের সম্পূর্ণ নিয়ন্ত্রণে রয়েছে।",
        outlook: "Bearish. Wait for stabilization or a bullish divergence pattern near the BDT 65 support before initiating any partial long positions.",
        outlookBn: "বেয়ারিশ। কোনো আংশিক দীর্ঘমেয়াদী পজিশন নেয়ার আগে ৬৫ বিডিটি সাপোর্টের কাছাকাছি বাজারের স্থিতিশীলতা বা বুলিশ ডাইভারজেন্স প্যাটার্ন খোঁজার পরামর্শ রইল।"
      }
    },
    "3.jpg": {
      ticker: "BEXIMCO",
      name: "Bangladesh Export Import Company Ltd. (BEXIMCO)",
      platform: "StockNow Dashboard",
      indicators: ["RSI (14)", "Bollinger Bands (20, 2)", "Volume"],
      analysis: {
        recommendation: "HOLD",
        recommendationBn: "হোল্ড",
        confidence: 7,
        trend: "Tight trading range (flat) near key support, signifying low market interest and consolidation.",
        trendBn: "মূল সাপোর্টের কাছাকাছি সংকীর্ণ ট্রেডিং রেঞ্জ (ফ্ল্যাট), যা কম বাজার আগ্রহ এবং কনসোলিডেশন নির্দেশ করে।",
        rsi: { 
          value: 35.4, 
          interpretation: "Neutral-Bearish. Hovering near the lower half, indicating quiet distribution or sideways compression.",
          interpretationBn: "নিরপেক্ষ-বেয়ারিশ। নিচের অর্ধেকের কাছাকাছি ঘোরাঘুরি করছে, যা মৃদু বণ্টন (distribution) বা পাশ্ববর্তী সংকোচন নির্দেশ করে।"
        },
        macd: { 
          value: "Flat histogram", 
          interpretation: "Absence of momentum. The MACD histogram is clinging to the zero line, confirming flat price action and lack of institutional direction.",
          interpretationBn: "মোমেন্টামের অনুপস্থিতি। এমএসিডি হিস্টোগ্রামটি জিরো লাইনের সাথে লেগে রয়েছে, যা ফ্ল্যাট প্রাইস অ্যাকশন এবং প্রাতিষ্ঠানিক নির্দেশনাহীনতা নিশ্চিত করে।"
        },
        supportResistance: {
          support: "BDT 115.00 (Floor / Major floor)",
          supportBn: "BDT ১১৫.০০ (মেজর ফ্লোর বা সর্বনিম্ন সীমা)",
          resistance: "BDT 122.00 (Upper Bollinger band boundary)",
          resistanceBn: "BDT ১২২.০০ (উচ্চতর বলিঞ্জার ব্যান্ড সীমা)"
        },
        candlestickPattern: "Doji and Spinning Tops with small body sizes, highlighting intense market indecision.",
        candlestickPatternBn: "ছোট বডি সাইজ বিশিষ্ট দোজি (Doji) এবং স্পিনিং টপস ক্যান্ডেল তৈরি হয়েছে, যা চরম বাজার অনিশ্চয়তা নির্দেশ করে।",
        outlook: "Neutral / Wait and Watch. Breakout above BDT 122 or breakdown below BDT 115 will dictate the next primary direction.",
        outlookBn: "নিরপেক্ষ / অপেক্ষা করুন ও লক্ষ্য রাখুন। ১২২ বিডিটির উপরে ব্রেকআউট অথবা ১১৫ বিডিটির নিচে ব্রেকডাউন পরবর্তী প্রধান গতিপথ নির্ধারণ করবে।"
      }
    },
    "4.jpg": {
      ticker: "GP",
      name: "Grameenphone Ltd. (GP)",
      platform: "TradingView DSE",
      indicators: ["EMA 20", "EMA 50", "RSI (14)", "MACD"],
      analysis: {
        recommendation: "HOLD",
        recommendationBn: "হোল্ড",
        confidence: 8,
        trend: "Moderate pull-back from peak. Finding dynamic support near the EMA 50 line.",
        trendBn: "সর্বোচ্চ দর থেকে মাঝারি ধরনের পুল-ব্যাক বা মূল্য সংশোধন। EMA ৫০ লাইনের কাছাকাছি ডায়নামিক সাপোর্ট খুঁজে পাচ্ছে।",
        rsi: { 
          value: 42.8, 
          interpretation: "Neutral. Slipped from overbought highs of 68 down to 42, cooling off the market's over-extended state.",
          interpretationBn: "নিরপেক্ষ। আরএসআই ওভারবট ৬৮ থেকে নেমে ৪২-এ এসেছে, যা অতিরিক্ত ক্রয় চাপকে স্বাভাবিক অবস্থায় ফিরিয়ে এনেছে।"
        },
        macd: { 
          value: "Bearish crossover near zero line", 
          interpretation: "Slight bearish momentum. MACD line is slightly below the signal line but remains above zero, indicating a healthy corrective pullback rather than a full crash.",
          interpretationBn: "সামান্য বেয়ারিশ মোমেন্টাম। এমএসিডি লাইনটি সিগন্যাল লাইনের সামান্য নিচে রয়েছে তবে জিরো লাইনের উপরে আছে, যা বড় কোনো পতনের চেয়ে একটি স্বাস্থ্যকর পুল-ব্যাক নির্দেশ করে।"
        },
        supportResistance: {
          support: "BDT 278.00 (EMA 50 line / prior buyer peak)",
          supportBn: "BDT ২৭৮.০০ (EMA ৫০ লাইন / পূর্ববর্তী ক্রেতাদের শিখর)",
          resistance: "BDT 294.00 (Recent local high)",
          resistanceBn: "BDT ২৯৪.০০ (সাম্প্রতিক স্থানীয় সর্বোচ্চ মূল্য)"
        },
        candlestickPattern: "Bullish Piercing pattern forming near the EMA 50 line, indicating buyers are defending the trend.",
        candlestickPatternBn: "EMA ৫০ লাইনের কাছাকাছি বুলিশ পিয়ার্সিং প্যাটার্ন তৈরি হচ্ছে, যা নির্দেশ করে ক্রেতারা এই আপট্রেন্ড বজায় রাখার চেষ্টা করছে।",
        outlook: "Neutral-Bullish. Good entry range at BDT 278-280, with a target stop-loss below BDT 274.",
        outlookBn: "নিরপেক্ষ-বুলিশ। ২৭৮-২৮০ বিডিটি রেঞ্জে ভালো এন্ট্রি হতে পারে, স্টপ-লস ২৭৪ বিডিটির নিচে রাখা যেতে পারে।"
      }
    },
    "5.jpg": {
      ticker: "BRACBANK",
      name: "BRAC Bank PLC.",
      platform: "StockNow Charts",
      indicators: ["RSI (14)", "MACD", "Volume Rate of Change", "Support/Resistance"],
      analysis: {
        recommendation: "BUY",
        recommendationBn: "ক্রয়",
        confidence: 9,
        trend: "Steady uptrend along a rising channel. Institutional buy support visible on rising volumes.",
        trendBn: "একটি ক্রমবর্ধমান চ্যানেলের মধ্য দিয়ে ক্রমাগত ঊর্ধ্বমুখী গতিপথ। বর্ধিত ভলিউমে প্রাতিষ্ঠানিক ক্রয়ের সমর্থন দৃশ্যমান।",
        rsi: { 
          value: 61.2, 
          interpretation: "Bullish. RSI is in the bullish range (60-70), suggesting strong, sustainable buying momentum without being severely overbought yet.",
          interpretationBn: "বুলিশ। আরএসআই বর্তমানে বুলিশ রেঞ্জে (৬০-৭০) রয়েছে, যা নির্দেশ করে বাজার অতিরিক্ত ওভারবট হওয়ার আগে পর্যন্ত টেকসই গতিশীলতা বজায় থাকবে।"
        },
        macd: { 
          value: "Bullish expansion", 
          interpretation: "MACD line is expanding higher above the zero line and the signal line, confirming strong upward movement.",
          interpretationBn: "এমএসিডি লাইনটি জিরো লাইন এবং সিগন্যাল লাইনের উপরে ক্রমাগত ঊর্ধ্বমুখী হচ্ছে, যা জোরালো ঊর্ধ্বমুখী প্রবণতা নিশ্চিত করে।"
        },
        supportResistance: {
          support: "BDT 42.00 (Channel floor / EMA 20)",
          supportBn: "BDT ৪২.০০ (চ্যানেল ফ্লোর / EMA ২০)",
          resistance: "BDT 46.50 (Channel resistance / psychological limit)",
          resistanceBn: "BDT ৪৬.৫০ (চ্যানেল রেজিস্ট্যান্স / মনস্তাত্ত্বিক সীমা)"
        },
        candlestickPattern: "Three White Soldiers pattern in recent weeks, showing consistent bull pressure.",
        candlestickPatternBn: "সাম্প্রতিক সপ্তাহগুলোতে 'থ্রি হোয়াইট সোলজারস' প্যাটার্ন তৈরি হয়েছে, যা ক্রমাগত ঊর্ধ্বমুখী চাপ প্রতিফলিত করে।",
        outlook: "Strong Bullish. Hold positions. Fresh buys recommended on minor dips toward BDT 43.50.",
        outlookBn: "শক্তিশালী বুলিশ। পজিশন হোল্ড করুন। ৪৩.৫০ বিডিটির দিকে সামান্য সংশোধনে নতুন ক্রয়ের জন্য সুপারিশ করা হচ্ছে।"
      }
    }
  },

  // Educational library for explanations
  educationalGuides: {
    "RSI (14)": {
      title: "Relative Strength Index (RSI)",
      desc: "RSI is a momentum oscillator that measures the speed and change of price movements between 0 and 100.",
      bullishSignal: "RSI rising above 30 (exiting oversold) or showing a Bullish Divergence (price makes a lower low, but RSI makes a higher low).",
      bearishSignal: "RSI falling below 70 (exiting overbought) or showing a Bearish Divergence (price makes a higher high, but RSI makes a lower high).",
      applicationTip: "In strong uptrends, RSI tends to fluctuate between 40 and 80, using 40 as a support. In downtrends, it fluctuates between 20 and 60."
    },
    "MACD (12, 26, 9)": {
      title: "Moving Average Convergence Divergence (MACD)",
      desc: "MACD is a trend-following momentum indicator that shows the relationship between two moving averages of a security’s price.",
      bullishSignal: "The MACD Line crossing above the Signal Line (Bullish Crossover) or crossing above the Centerline (0).",
      bearishSignal: "The MACD Line crossing below the Signal Line (Bearish Crossover) or crossing below the Centerline (0).",
      applicationTip: "Crossovers below the zero line are considered earlier reversal signals but carry higher risk. Confirm with volume spikes."
    },
    "EMA 50 / 200": {
      title: "Exponential Moving Average (EMA)",
      desc: "EMAs are averages of historical prices that apply more weight to the most recent data points, making them highly responsive.",
      bullishSignal: "Golden Cross (EMA 50 crossing above EMA 200) or price bouncing off the EMA support line.",
      bearishSignal: "Death Cross (EMA 50 crossing below EMA 200) or price breaking down below the EMA support line.",
      applicationTip: "EMA 200 represents the long-term trend. As long as the price remains above EMA 200, the primary trend is considered bullish."
    },
    "Volume Analysis": {
      title: "Volume Confirmation",
      desc: "Volume represents the total number of shares traded in a given period. It validates the strength of any price movement.",
      bullishSignal: "Price breakout accompanied by volume that is 2x to 5x higher than the 20-day moving average volume.",
      bearishSignal: "Price dropping on high volume, or price rising on declining volume (indicating weak retail buying).",
      applicationTip: "Price trends without volume confirmation are highly susceptible to sudden reversals and false breakouts."
    }
  },

  // Database arrays for VIP launch, User Registry, and Pending Payments
  users: [
    { name: "Demo Premium User", phone: "01799999999", email: "premium@test.com", password: "password", tier: "premium", submittedTrxId: null },
    { name: "Demo Free User", phone: "01788888888", email: "free@test.com", password: "password", tier: "free", submittedTrxId: null }
  ],

  vipList: [
    "authorized.rep@dse.com.bd",
    "representative@multisecurities.com",
    "vip.investor@gmail.com",
    "01711223344",
    "01899887766",
    "01911222333",
    "mehedul@dsepro.com.bd"
  ],

  pendingPayments: [
    { email: "pending@test.com", name: "Siddique Rahman", phone: "01677777777", method: "bkash", sender: "01677777777", reference: "BK928374829", amount: "499" }
  ]
};
