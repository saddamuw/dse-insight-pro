// DSE Insight Pro - PDF Exporter Utility
const PDFExporter = {
  // Compile analysis data and trigger standard print dialog optimized via Print CSS
  exportReport(analysisData) {
    if (!analysisData) {
      alert("No active scan data to export.");
      return;
    }

    // Dynamic compilation of the print report template
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocker is enabled! Please allow popups for this site in your browser settings to export the PDF report.");
      return;
    }
    
    // Inject styles and html structure
    const dateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    const rec = (analysisData.analysis && analysisData.analysis.recommendation) || "NEUTRAL";
    const recBn = (analysisData.analysis && analysisData.analysis.recommendationBn) || "নিরপেক্ষ";
    const conf = (analysisData.analysis && analysisData.analysis.confidence) || 7;
    const recClass = rec.toLowerCase();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DSE Insight Pro - Technical Report: ${analysisData.ticker}</title>
        <base href="${window.location.origin}${window.location.pathname}">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          
          body {
            font-family: 'Inter', 'Hind Siliguri', sans-serif;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            background: #ffffff;
            line-height: 1.4;
            font-size: 11.5px;
          }
          
          .pdf-page {
            page-break-after: always;
            page-break-inside: avoid;
            box-sizing: border-box;
            width: 100%;
          }
          
          .pdf-page:last-child {
            page-break-after: avoid;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #0052cc;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          
          .logo-area {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .logo-text {
            font-size: 24px;
            font-weight: 700;
            color: #0052cc;
            letter-spacing: -0.5px;
          }
          
          .logo-badge {
            background: #0052cc;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
          }
          
          .meta-info {
            text-align: right;
            font-size: 11px;
            color: #666;
          }
          
          .report-title {
            font-size: 15px;
            font-weight: 700;
            color: #333;
            margin-bottom: 12px;
            background: #f4f6fa;
            padding: 8px 12px;
            border-radius: 6px;
            border-left: 4px solid #0052cc;
          }
          
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 12px;
          }
          
          .card {
            border: 1px solid #e1e4ea;
            border-radius: 8px;
            padding: 10px;
            background: #fafbfc;
          }
          
          .card h3 {
            margin-top: 0;
            font-size: 11.5px;
            color: #0052cc;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e1e4ea;
            padding-bottom: 5px;
            margin-bottom: 6px;
          }
          
          .card p {
            margin: 4px 0;
            font-size: 10.5px;
          }
          
          .indicator-val {
            font-weight: 600;
            color: #333;
          }
          
          .screenshot-box {
            text-align: center;
            border: 1px solid #e1e4ea;
            border-radius: 8px;
            padding: 8px;
            margin-bottom: 12px;
            background: #fafbfc;
          }
          
          .screenshot-box img {
            max-width: 100%;
            max-height: 140px;
            border-radius: 4px;
            object-fit: contain;
          }
          
          .section {
            margin-bottom: 12px;
          }
          
          .section-title {
            font-size: 12.5px;
            font-weight: 700;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 4px;
            margin-bottom: 8px;
          }
          
          .highlight {
            padding: 8px 10px;
            border-radius: 6px;
            font-size: 11px;
            margin-bottom: 8px;
          }
          
          .highlight.bullish {
            background: #e6f7ed;
            border-left: 4px solid #28a745;
            color: #155724;
          }
          
          .highlight.bearish {
            background: #fdf2f2;
            border-left: 4px solid #dc3545;
            color: #721c24;
          }
          
          .highlight.neutral {
            background: #f8f9fa;
            border-left: 4px solid #6c757d;
            color: #383d41;
          }
          
          .footer {
            margin-top: 15px;
            border-top: 1px solid #e1e4ea;
            padding-top: 8px;
            text-align: center;
            font-size: 9.5px;
            color: #888;
            line-height: 1.35;
          }
          
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
          
          /* Recommendation & Confidence Banner */
          .pdf-rec-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #e1e4ea;
            border-radius: 8px;
            padding: 8px 12px;
            margin-bottom: 12px;
            background: #fafbfc;
          }
          
          .pdf-rec-buy {
            border-left: 5px solid #10b981;
            background: #f0fdf4;
          }
          
          .pdf-rec-sell {
            border-left: 5px solid #f43f5e;
            background: #fff1f2;
          }
          
          .pdf-rec-hold {
            border-left: 5px solid #f59e0b;
            background: #fffbeb;
          }
          
          .pdf-rec-avoid {
            border-left: 5px solid #ec4899;
            background: #fdf2f8;
          }
          
          .pdf-rec-neutral {
            border-left: 5px solid #64748b;
            background: #f8fafc;
          }
          
          .pdf-rec-badge-section {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          
          .pdf-rec-label {
            font-size: 9px;
            color: #666;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.05em;
          }
          
          .pdf-rec-val-container {
            display: flex;
            align-items: baseline;
            gap: 6px;
          }
          
          .pdf-rec-val {
            font-size: 18px;
            font-weight: 800;
          }
          
          .pdf-rec-buy .pdf-rec-val { color: #15803d; }
          .pdf-rec-sell .pdf-rec-val { color: #b91c1c; }
          .pdf-rec-hold .pdf-rec-val { color: #b45309; }
          .pdf-rec-avoid .pdf-rec-val { color: #be185d; }
          .pdf-rec-neutral .pdf-rec-val { color: #475569; }
          
          .pdf-rec-val-bn {
            font-family: 'Hind Siliguri', sans-serif;
            font-size: 12px;
            font-weight: 600;
            color: #555;
            font-style: italic;
          }
          
          .pdf-confidence-section {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 2px;
            min-width: 120px;
          }
          
          .pdf-confidence-header {
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-size: 9px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
          }
          
          .pdf-confidence-score-number {
            color: #4f46e5;
            font-weight: bold;
          }
          
          .pdf-confidence-meter-bg {
            width: 100%;
            height: 6px;
            background: #e2e8f0;
            border-radius: 99px;
            overflow: hidden;
          }
          
          .pdf-confidence-meter-fill {
            height: 100%;
            border-radius: 99px;
          }
          
          .pdf-rec-buy .pdf-confidence-meter-fill { background: #10b981; }
          .pdf-rec-sell .pdf-confidence-meter-fill { background: #f43f5e; }
          .pdf-rec-hold .pdf-confidence-meter-fill { background: #f59e0b; }
          .pdf-rec-avoid .pdf-confidence-meter-fill { background: #ec4899; }
          .pdf-rec-neutral .pdf-confidence-meter-fill { background: #64748b; }
          
          /* Bilingual Translation Styling */
          .translation-bn {
            font-family: 'Hind Siliguri', sans-serif;
            font-size: 9.5px;
            color: #4b5563; /* Gray-600 */
            font-style: italic;
            margin-top: 4px;
            line-height: 1.35;
            border-top: 1px dashed #e5e7eb; /* Gray-200 */
            padding-top: 3px;
            text-align: left;
            font-weight: 400;
          }
          
          /* Deep Technical Breakdown 2x2 Dashboard */
          .breakdown-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 12px;
          }
          
          .breakdown-card {
            border: 1px solid #e1e4ea;
            border-radius: 8px;
            padding: 8px 10px;
            background: #fafbfc;
          }
          
          .breakdown-card h4 {
            margin-top: 0;
            font-size: 11px;
            color: #0052cc;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e1e4ea;
            padding-bottom: 4px;
            margin-bottom: 6px;
            font-weight: 700;
          }
          
          .breakdown-card p {
            margin: 0;
            font-size: 10px;
            line-height: 1.35;
          }
        </style>
      </head>
      <body>
        <div class="pdf-page">
          <div class="header">
            <div class="logo-area">
              <img src="assets/Logo.png" alt="Khan AI Lab Logo" style="height: 36px; width: auto; border-radius: 6px; border: 1px solid #e1e4ea; box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-right: 5px;">
              <div>
                <span class="logo-text" style="display: block; font-size: 20px; line-height: 1.1; margin-bottom: 2px;">DSE Insight Pro</span>
                <span style="font-size: 10px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em;">by Khan AI Lab</span>
              </div>
              <span class="logo-badge" style="margin-left: 15px;">Premium Technical Report</span>
            </div>
            <div class="meta-info">
              Generated: ${dateStr} (BST)<br>
              Engine: ${analysisData.engine || "Standard Vision Model"}
            </div>
          </div>

          <div class="report-title">
            Technical Analysis Report: <strong>${analysisData.ticker}</strong> (${analysisData.name})
          </div>

          <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; font-size: 10px; line-height: 1.4; text-align: left; font-style: italic; font-weight: 500;">
            <strong>Educational Purpose Notice:</strong> This AI-generated analysis is strictly for educational, learning, and research purposes. It does not constitute financial or investment advice.
            <div style="font-family: 'Hind Siliguri', sans-serif; font-size: 9.5px; margin-top: 3px; color: #2563eb;"><strong>শিক্ষামূলক উদ্দেশ্য বিজ্ঞপ্তি:</strong> এই এআই-উত্পন্ন প্রতিবেদনটি শুধুমাত্র শিক্ষামূলক এবং গবেষণার উদ্দেশ্যে প্রস্তুত করা হয়েছে। এটি কোনো আর্থিক বা বিনিয়োগ পরামর্শ নয়।</div>
          </div>

          <div class="pdf-rec-banner pdf-rec-${recClass}">
            <div class="pdf-rec-badge-section">
              <span class="pdf-rec-label">AI Analysis Signal / এআই সিগন্যাল</span>
              <div class="pdf-rec-val-container">
                <span class="pdf-rec-val">${rec}</span>
                <span class="pdf-rec-val-bn">/ ${recBn}</span>
              </div>
            </div>
            <div class="pdf-confidence-section">
              <div class="pdf-confidence-header">
                <span>Confidence / আস্থা</span>
                <span class="pdf-confidence-score-number">${conf}/10</span>
              </div>
              <div class="pdf-confidence-meter-bg">
                <div class="pdf-confidence-meter-fill" style="width: ${conf * 10}%;"></div>
              </div>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <h3>Security Overview / সিকিউরিটি বিবরণী</h3>
              <p><strong>Ticker:</strong> ${analysisData.ticker}</p>
              <p><strong>Name:</strong> ${analysisData.name}</p>
              <p><strong>Source Platform:</strong> ${analysisData.platform}</p>
              <p><strong>Detected Indicators:</strong> ${analysisData.indicators ? analysisData.indicators.join(', ') : 'None'}</p>
            </div>
            <div class="card">
              <h3>Technical Outlook / টেকনিক্যাল আউটলুক</h3>
              <div class="highlight ${(analysisData.analysis && analysisData.analysis.outlook && analysisData.analysis.outlook.toLowerCase().includes('bullish')) ? 'bullish' : (analysisData.analysis && analysisData.analysis.outlook && analysisData.analysis.outlook.toLowerCase().includes('bearish')) ? 'bearish' : 'neutral'}">
                <strong>Sentiment / অনুভূতি:</strong> ${(analysisData.analysis && analysisData.analysis.trend) || ""}
                ${(analysisData.analysis && analysisData.analysis.trendBn) ? `<div class="translation-bn">${analysisData.analysis.trendBn}</div>` : ''}
              </div>
              <p><strong>Support:</strong> <span class="indicator-val">${(analysisData.analysis && analysisData.analysis.supportResistance && analysisData.analysis.supportResistance.support) || ""}</span>
                ${(analysisData.analysis && analysisData.analysis.supportResistance && analysisData.analysis.supportResistance.supportBn) ? `<div class="translation-bn">${analysisData.analysis.supportResistance.supportBn}</div>` : ''}
              </p>
              <p><strong>Resistance:</strong> <span class="indicator-val">${(analysisData.analysis && analysisData.analysis.supportResistance && analysisData.analysis.supportResistance.resistance) || ""}</span>
                ${(analysisData.analysis && analysisData.analysis.supportResistance && analysisData.analysis.supportResistance.resistanceBn) ? `<div class="translation-bn">${analysisData.analysis.supportResistance.resistanceBn}</div>` : ''}
              </p>
            </div>
          </div>

          <div class="screenshot-box">
            <div style="font-size: 11px; color: #777; margin-bottom: 6px;">Analyzed Chart Screenshot / স্ক্যানকৃত চার্ট স্ক্রিনশট</div>
            <img src="${analysisData.imageSrc}" alt="Uploaded Stock Chart">
          </div>
        </div>
          
        <div class="pdf-page">
          <div class="section-title">Deep Technical Breakdown / গভীর টেকনিক্যাল বিশ্লেষণ</div>
          <div class="breakdown-grid">
            <div class="breakdown-card">
              <h4>Trend Analysis / মূল্য প্রবণতা বিশ্লেষণ</h4>
              <p>${(analysisData.analysis && analysisData.analysis.trend) || ""}</p>
              ${(analysisData.analysis && analysisData.analysis.trendBn) ? `<div class="translation-bn">${analysisData.analysis.trendBn}</div>` : ''}
            </div>
            
            <div class="breakdown-card">
              <h4>RSI Interpretation / আরএসআই বিশ্লেষণ</h4>
              <p>RSI value detected at <span class="indicator-val">${(analysisData.analysis && analysisData.analysis.rsi && analysisData.analysis.rsi.value) || ""}</span>. ${(analysisData.analysis && analysisData.analysis.rsi && analysisData.analysis.rsi.interpretation) || ""}</p>
              ${(analysisData.analysis && analysisData.analysis.rsi && analysisData.analysis.rsi.interpretationBn) ? `<div class="translation-bn">${analysisData.analysis.rsi.interpretationBn}</div>` : ''}
            </div>
            
            <div class="breakdown-card">
              <h4>MACD Indicator / এমএসিডি সূচক</h4>
              <p>Detected state: <span class="indicator-val">${(analysisData.analysis && analysisData.analysis.macd && analysisData.analysis.macd.value) || ""}</span>. ${(analysisData.analysis && analysisData.analysis.macd && analysisData.analysis.macd.interpretation) || ""}</p>
              ${(analysisData.analysis && analysisData.analysis.macd && analysisData.analysis.macd.interpretationBn) ? `<div class="translation-bn">${analysisData.analysis.macd.interpretationBn}</div>` : ''}
            </div>
            
            <div class="breakdown-card">
              <h4>Candlestick Formation / ক্যান্ডেলস্টিক প্যাটার্ন</h4>
              <p>${(analysisData.analysis && analysisData.analysis.candlestickPattern) || ""}</p>
              ${(analysisData.analysis && analysisData.analysis.candlestickPatternBn) ? `<div class="translation-bn">${analysisData.analysis.candlestickPatternBn}</div>` : ''}
            </div>
          </div>
 
          <div class="section">
            <div class="section-title">Strategic Outlook & Warning Levels / স্ট্র্যাটেজিক আউটলুক ও সতর্কবার্তা</div>
            <p style="font-size: 11px; line-height: 1.45; margin: 0;">
              ${(analysisData.analysis && analysisData.analysis.outlook) || ""}
              ${(analysisData.analysis && analysisData.analysis.outlookBn) ? `<div class="translation-bn">${analysisData.analysis.outlookBn}</div>` : ''}
            </p>
          </div>

          <div class="footer">
            <strong>DSE Insight Pro &copy; 2026 · A Product of <a href="https://khanailab.vercel.app" target="_blank" rel="noopener" style="color: #0052cc; text-decoration: none; font-weight: 600;">Khan AI Lab</a> (khanailab.vercel.app)</strong><br>
            This report is for educational and analytical purposes only. Trading in the Dhaka Stock Exchange involves high risk. Consult a registered financial analyst before investing.
          </div>
        </div>

        <script>
          // Wait for all fonts (including Google Fonts) to load before printing
          if (document.fonts) {
            document.fonts.ready.then(function() {
              setTimeout(function() {
                window.print();
              }, 250);
            });
          } else {
            // Fallback for older browsers
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 1000);
            };
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  }
};
