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
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;600;700&display=swap');
          
          @page {
            size: A4;
            margin: 15mm 15mm 15mm 15mm;
          }
          
          body {
            font-family: 'Inter', 'Hind Siliguri', sans-serif;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            background: #ffffff;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #0052cc;
            padding-bottom: 15px;
            margin-bottom: 25px;
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
            font-size: 12px;
            color: #666;
          }
          .report-title {
            font-size: 20px;
            font-weight: 700;
            color: #333;
            margin-bottom: 20px;
            background: #f4f6fa;
            padding: 10px 15px;
            border-radius: 6px;
            border-left: 4px solid #0052cc;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
          }
          .card {
            border: 1px solid #e1e4ea;
            border-radius: 8px;
            padding: 15px;
            background: #fafbfc;
          }
          .card h3 {
            margin-top: 0;
            font-size: 14px;
            color: #0052cc;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e1e4ea;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .card p {
            margin: 6px 0;
            font-size: 13px;
          }
          .indicator-val {
            font-weight: 600;
            color: #333;
          }
          .screenshot-box {
            text-align: center;
            border: 1px solid #e1e4ea;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 25px;
            background: #fafbfc;
          }
          .screenshot-box img {
            max-width: 100%;
            max-height: 250px;
            border-radius: 4px;
            object-fit: contain;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 15px;
            font-weight: 700;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 6px;
            margin-bottom: 12px;
          }
          .highlight {
            padding: 10px;
            border-radius: 6px;
            font-size: 13px;
            margin-bottom: 15px;
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
            margin-top: 40px;
            border-top: 1px solid #e1e4ea;
            padding-top: 15px;
            text-align: center;
            font-size: 11px;
            color: #888;
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
            padding: 12px 18px;
            margin-bottom: 20px;
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
            font-size: 10px;
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
            font-size: 22px;
            font-weight: 800;
          }
          .pdf-rec-buy .pdf-rec-val { color: #15803d; }
          .pdf-rec-sell .pdf-rec-val { color: #b91c1c; }
          .pdf-rec-hold .pdf-rec-val { color: #b45309; }
          .pdf-rec-avoid .pdf-rec-val { color: #be185d; }
          .pdf-rec-neutral .pdf-rec-val { color: #475569; }

          .pdf-rec-val-bn {
            font-size: 14px;
            font-weight: 600;
            color: #555;
            font-style: italic;
          }
          
          .pdf-confidence-section {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
            min-width: 150px;
          }
          .pdf-confidence-header {
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-size: 10px;
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
        </style>
      </head>
      <body>
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
            <div class="highlight ${analysisData.analysis.outlook.toLowerCase().includes('bullish') ? 'bullish' : analysisData.analysis.outlook.toLowerCase().includes('bearish') ? 'bearish' : 'neutral'}">
              <strong>Sentiment / অনুভূতি:</strong> ${analysisData.analysis.trend}
              ${analysisData.analysis.trendBn ? `<div style="font-size:11px; margin-top:2px; font-weight:normal; opacity:0.85;">${analysisData.analysis.trendBn}</div>` : ''}
            </div>
            <p><strong>Support:</strong> <span class="indicator-val">${analysisData.analysis.supportResistance.support}</span>
              ${analysisData.analysis.supportResistance.supportBn ? `<br><span style="font-size:11px; color:#555; font-style:italic;">${analysisData.analysis.supportResistance.supportBn}</span>` : ''}
            </p>
            <p><strong>Resistance:</strong> <span class="indicator-val">${analysisData.analysis.supportResistance.resistance}</span>
              ${analysisData.analysis.supportResistance.resistanceBn ? `<br><span style="font-size:11px; color:#555; font-style:italic;">${analysisData.analysis.supportResistance.resistanceBn}</span>` : ''}
            </p>
          </div>
        </div>

        <div class="screenshot-box">
          <div style="font-size: 11px; color: #777; margin-bottom: 8px;">Analyzed Chart Screenshot / স্ক্যানকৃত চার্ট স্ক্রিনশট</div>
          <img src="${analysisData.imageSrc}" alt="Uploaded Stock Chart">
        </div>

        <div class="section">
          <div class="section-title">Deep Technical Breakdown / গভীর টেকনিক্যাল বিশ্লেষণ</div>
          <p><strong>Trend Analysis / মূল্য প্রবণতা বিশ্লেষণ:</strong><br>
            ${analysisData.analysis.trend}
            ${analysisData.analysis.trendBn ? `<br><span style="font-size:12px; color:#555; font-style:italic;">${analysisData.analysis.trendBn}</span>` : ''}
          </p>
          
          <p style="margin-top:12px;"><strong>RSI Interpretation / আরএসআই বিশ্লেষণ:</strong><br>
            RSI value detected at <span class="indicator-val">${analysisData.analysis.rsi.value}</span>. ${analysisData.analysis.rsi.interpretation}
            ${analysisData.analysis.rsi.interpretationBn ? `<br><span style="font-size:12px; color:#555; font-style:italic;">${analysisData.analysis.rsi.interpretationBn}</span>` : ''}
          </p>
          
          <p style="margin-top:12px;"><strong>MACD Indicator / এমএসিডি সূচক:</strong><br>
            Detected state: <span class="indicator-val">${analysisData.analysis.macd.value}</span>. ${analysisData.analysis.macd.interpretation}
            ${analysisData.analysis.macd.interpretationBn ? `<br><span style="font-size:12px; color:#555; font-style:italic;">${analysisData.analysis.macd.interpretationBn}</span>` : ''}
          </p>
          
          <p style="margin-top:12px;"><strong>Candlestick Formation / ক্যান্ডেলস্টিক প্যাটার্ন:</strong><br>
            ${analysisData.analysis.candlestickPattern}
            ${analysisData.analysis.candlestickPatternBn ? `<br><span style="font-size:12px; color:#555; font-style:italic;">${analysisData.analysis.candlestickPatternBn}</span>` : ''}
          </p>
        </div>

        <div class="section" style="page-break-inside: avoid;">
          <div class="section-title">Strategic Outlook & Warning Levels / স্ট্র্যাটেজিক আউটলুক ও সতর্কবার্তা</div>
          <p>
            ${analysisData.analysis.outlook}
            ${analysisData.analysis.outlookBn ? `<br><span style="font-size:12px; color:#555; font-style:italic;">${analysisData.analysis.outlookBn}</span>` : ''}
          </p>
        </div>

        <div class="footer">
          <strong>DSE Insight Pro &copy; 2026 · A Product of <a href="https://khanailab.vercel.app" target="_blank" rel="noopener" style="color: #0052cc; text-decoration: none; font-weight: 600;">Khan AI Lab</a> (khanailab.vercel.app)</strong><br>
          This report is for educational and analytical purposes only. Trading in the Dhaka Stock Exchange involves high risk. Consult a registered financial analyst before investing.
        </div>

        <script>
          // Auto trigger print and close window after completion
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  }
};
