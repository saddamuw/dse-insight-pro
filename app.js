// DSE Insight Pro - Application Controller
document.addEventListener("DOMContentLoaded", () => {
  // --- Load database arrays from LocalStorage (or fall back to DSE_DATABASE seeds) ---
  let users = JSON.parse(localStorage.getItem("dse_users"));
  if (!users) {
    users = [...DSE_DATABASE.users];
    localStorage.setItem("dse_users", JSON.stringify(users));
  }

  let vipList = JSON.parse(localStorage.getItem("dse_vip_list"));
  if (!vipList) {
    vipList = [...DSE_DATABASE.vipList];
    localStorage.setItem("dse_vip_list", JSON.stringify(vipList));
  }

  let pendingPayments = JSON.parse(localStorage.getItem("dse_pending_payments"));
  if (!pendingPayments) {
    pendingPayments = [...DSE_DATABASE.pendingPayments];
    localStorage.setItem("dse_pending_payments", JSON.stringify(pendingPayments));
  }

  let currentUser = JSON.parse(localStorage.getItem("dse_current_user")) || null;

  // --- BST Date Helper (Dhaka Time UTC+6) ---
  function getDhakaDateString() {
    const offset = 6 * 60 * 60 * 1000;
    const localTime = new Date();
    const utcTime = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);
    const dhakaTime = new Date(utcTime + offset);
    
    const yyyy = dhakaTime.getFullYear();
    const mm = String(dhakaTime.getMonth() + 1).padStart(2, '0');
    const dd = String(dhakaTime.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // --- App State ---
  let scanCount = parseInt(localStorage.getItem("dse_scan_count")) || 0;
  let proScanCount = parseInt(localStorage.getItem("dse_pro_scan_count")) || 0;
  let proLastScanDate = localStorage.getItem("dse_pro_last_scan_date") || "";
  let activeAnalysis = null;
  let useRealAI = localStorage.getItem("dse_use_real_ai") === "true";
  let apiKey = localStorage.getItem("dse_api_key") || DSE_DATABASE.defaultApiKey;

  // --- DOM Elements ---
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const uploadScreen = document.getElementById("upload-screen");
  const scanningScreen = document.getElementById("scanning-screen");
  const resultsScreen = document.getElementById("results-screen");
  
  // Scans Tracking
  const freeScansLeftEl = document.getElementById("free-scans-left");
  const scanCounterProgress = document.getElementById("scan-counter-progress");
  const scanCountBadge = document.getElementById("scan-count-badge");
  const premiumStatusBadge = document.getElementById("premium-status-badge");

  // AI Selector
  const toggleRealAi = document.getElementById("toggle-real-ai");
  const apiKeyContainer = document.getElementById("api-key-container");
  const apiKeyInput = document.getElementById("api-key-input");
  
  // Results Elements
  const analyzedImg = document.getElementById("analyzed-img");
  const resultTicker = document.getElementById("result-ticker");
  const resultName = document.getElementById("result-name");
  const resultPlatform = document.getElementById("result-platform");
  const resultTrend = document.getElementById("result-trend");
  const resultRsiVal = document.getElementById("result-rsi-val");
  const resultRsiInterpretation = document.getElementById("result-rsi-interpretation");
  const resultMacdVal = document.getElementById("result-macd-val");
  const resultMacdInterpretation = document.getElementById("result-macd-interpretation");
  const resultSupport = document.getElementById("result-support");
  const resultResistance = document.getElementById("result-resistance");
  const resultPattern = document.getElementById("result-pattern");
  const resultOutlook = document.getElementById("result-outlook");
  const indicatorsList = document.getElementById("indicators-list");
  const engineBadge = document.getElementById("engine-badge");

  // Authentication & Payment Views inside Modal
  const paywallModal = document.getElementById("paywall-modal");
  const closePaywallBtn = document.getElementById("close-paywall");
  const upgradeCtaBtn = document.getElementById("upgrade-cta-btn");
  
  const authRegisterView = document.getElementById("auth-register-view");
  const authLoginView = document.getElementById("auth-login-view");
  const paymentPortalView = document.getElementById("payment-portal-view");

  const toggleToLoginBtn = document.getElementById("toggle-to-login");
  const toggleToRegisterBtn = document.getElementById("toggle-to-register");

  // Auth Inputs & Forms
  const registerForm = document.getElementById("register-form");
  const regName = document.getElementById("reg-name");
  const regEmail = document.getElementById("reg-email");
  const regPhone = document.getElementById("reg-phone");
  const regPassword = document.getElementById("reg-password");
  const btnSubmitRegister = document.getElementById("btn-submit-register");

  const loginForm = document.getElementById("login-form");
  const loginIdentifier = document.getElementById("login-identifier");
  const loginPassword = document.getElementById("login-password");
  const btnSubmitLogin = document.getElementById("btn-submit-login");

  // Payment Inputs
  const paymentForm = document.getElementById("payment-submission-form");
  const payPackage = document.getElementById("pay-package");
  const payMethod = document.getElementById("pay-method");
  const paySender = document.getElementById("pay-sender");
  const payReference = document.getElementById("pay-reference");
  const btnSubmitPayment = document.getElementById("btn-submit-payment");

  // Super Admin Console Elements
  const adminPendingList = document.getElementById("admin-pending-list");
  const adminVipInput = document.getElementById("admin-vip-input");
  const btnSeedVip = document.getElementById("btn-seed-vip");

  // Educational Modal
  const eduModal = document.getElementById("edu-modal");
  const eduTitle = document.getElementById("edu-title");
  const eduDesc = document.getElementById("edu-desc");
  const eduBullish = document.getElementById("edu-bullish");
  const eduBearish = document.getElementById("edu-bearish");
  const eduTip = document.getElementById("edu-tip");
  const closeEduBtn = document.getElementById("close-edu");

  // Actions
  const scanNewBtn = document.getElementById("scan-new-btn");
  const exportPdfBtn = document.getElementById("export-pdf-btn");

  // Dev Settings Panel (in footer)
  const devResetScansBtn = document.getElementById("dev-reset-scans");
  const devTogglePremiumBtn = document.getElementById("dev-toggle-premium");

  // --- State Sync ---
  function saveState() {
    localStorage.setItem("dse_users", JSON.stringify(users));
    localStorage.setItem("dse_vip_list", JSON.stringify(vipList));
    localStorage.setItem("dse_pending_payments", JSON.stringify(pendingPayments));
    localStorage.setItem("dse_current_user", JSON.stringify(currentUser));
    localStorage.setItem("dse_scan_count", scanCount);
  }

  // --- Initial Setup & Render ---
  function init() {
    updateSubscriptionUI();
    setupAPIKeyConfig();
    renderSampleCards();
    renderAdminConsole();
    setupAuthListeners();
    renderUserHeaderArea();
  }

  // --- Dynamic User Header Display ---
  function renderUserHeaderArea() {
    // Look for existing display or create one
    let profileArea = document.getElementById("header-profile-area");
    if (!profileArea) {
      profileArea = document.createElement("div");
      profileArea.id = "header-profile-area";
      profileArea.style.display = "flex";
      profileArea.style.alignItems = "center";
      profileArea.style.gap = "10px";
      profileArea.style.marginLeft = "10px";
      
      const headerActions = document.querySelector(".header-actions");
      headerActions.appendChild(profileArea);
    }

    if (currentUser) {
      const tierLabel = currentUser.tier === "premium" 
        ? `<span style="font-size:10px; background:rgba(245,158,11,0.2); color:var(--accent-gold); padding:2px 6px; border-radius:4px; font-weight:700;">PRO</span>` 
        : currentUser.tier === "pending"
        ? `<span style="font-size:10px; background:rgba(56,189,248,0.2); color:#38bdf8; padding:2px 6px; border-radius:4px; font-weight:700;">PENDING</span>`
        : `<span style="font-size:10px; background:rgba(255,255,255,0.08); color:var(--text-muted); padding:2px 6px; border-radius:4px; font-weight:700;">FREE</span>`;

      profileArea.innerHTML = `
        <span style="font-size: 12px; font-weight:600; color:#fff; display:flex; align-items:center; gap:5px;">
          <i class="lucide-user" style="width:14px; height:14px; color:var(--text-muted);"></i>
          ${currentUser.name} ${tierLabel}
        </span>
        <button id="btn-logout" class="btn-dev" style="padding:2px 8px; font-size:10px;">Logout</button>
      `;

      document.getElementById("btn-logout").addEventListener("click", () => {
        currentUser = null;
        saveState();
        updateSubscriptionUI();
        renderUserHeaderArea();
        alert("Logged out successfully.");
        resetToUpload();
      });
    } else {
      profileArea.innerHTML = `
        <button id="btn-header-login" class="btn-secondary" style="padding: 6px 12px; font-size:12px;">Log In</button>
      `;
      document.getElementById("btn-header-login").addEventListener("click", () => {
        showPaywall("login");
      });
    }
    
    // Refresh Lucide Icons inside the injected HTML
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- Pro Daily Limit Checker ---
  function checkProDailyLimit() {
    const today = getDhakaDateString();
    if (proLastScanDate !== today) {
      proScanCount = 0;
      proLastScanDate = today;
      localStorage.setItem("dse_pro_scan_count", 0);
      localStorage.setItem("dse_pro_last_scan_date", today);
    }
    return proScanCount >= 30;
  }

  // --- Subscription State management ---
  function updateSubscriptionUI() {
    let effectivePremium = false;

    if (currentUser) {
      if (currentUser.tier === "premium") {
        effectivePremium = true;
      }
    } else {
      // If anonymous, premium status is loaded from dev toggle
      effectivePremium = localStorage.getItem("dse_premium") === "true";
    }

    // Update displays
    if (effectivePremium) {
      premiumStatusBadge.textContent = currentUser ? "PREMIUM VIP" : "PREMIUM MEMBER";
      premiumStatusBadge.className = "status-badge premium";
      
      // Dynamic Pro scans remaining check
      const today = getDhakaDateString();
      if (proLastScanDate !== today) {
        proScanCount = 0;
        proLastScanDate = today;
        localStorage.setItem("dse_pro_scan_count", 0);
        localStorage.setItem("dse_pro_last_scan_date", today);
      }
      
      const proRemaining = Math.max(0, 30 - proScanCount);
      freeScansLeftEl.textContent = `${proRemaining} of 30 daily scans remaining today (BST)`;
      
      const percentage = (proScanCount / 30) * 100;
      scanCounterProgress.style.width = `${Math.min(100, percentage)}%`;
      scanCounterProgress.style.background = "linear-gradient(90deg, #f59e0b, #eab308)";
      if (upgradeCtaBtn) upgradeCtaBtn.style.display = "none";
      scanCountBadge.textContent = `Pro Daily: ${proScanCount}/30`;
    } else {
      premiumStatusBadge.textContent = "FREE TIER";
      premiumStatusBadge.className = "status-badge free";
      const remaining = Math.max(0, 3 - scanCount);
      freeScansLeftEl.textContent = `${remaining} of 3 free scans remaining`;
      const percentage = (scanCount / 3) * 100;
      scanCounterProgress.style.width = `${Math.min(100, percentage)}%`;
      scanCounterProgress.style.background = "var(--primary-glow)";
      if (upgradeCtaBtn) upgradeCtaBtn.style.display = "inline-flex";
      scanCountBadge.textContent = `Scans: ${scanCount}/3`;
    }
  }

  function setupAPIKeyConfig() {
    toggleRealAi.checked = useRealAI;
    apiKeyInput.value = apiKey;

    if (useRealAI) {
      apiKeyContainer.style.display = "block";
    } else {
      apiKeyContainer.style.display = "none";
    }

    toggleRealAi.addEventListener("change", (e) => {
      useRealAI = e.target.checked;
      localStorage.setItem("dse_use_real_ai", useRealAI);
      apiKeyContainer.style.display = useRealAI ? "block" : "none";
    });

    apiKeyInput.addEventListener("input", (e) => {
      apiKey = e.target.value;
      localStorage.setItem("dse_api_key", apiKey);
    });
  }

  // Render clickable presets for easy demonstration
  function renderSampleCards() {
    const gallery = document.getElementById("sample-gallery");
    gallery.innerHTML = "";

    const samples = [
      { name: "Square Pharma .jpg", label: "Square Pharma (MACD Cross)" },
      { name: "Finefood.jpg", label: "Fine Foods (RSI Overbought)" },
      { name: "Loser 01.jpg", label: "LafargeHolcim (Bearish Trend)" },
      { name: "3.jpg", label: "BEXIMCO (Consolidation Range)" },
      { name: "4.jpg", label: "GP (Pullback Support Test)" },
      { name: "5.jpg", label: "BRAC Bank (Bullish Channel)" }
    ];

    samples.forEach(sample => {
      const card = document.createElement("div");
      card.className = "sample-card";
      
      const imgPath = `./assets/${sample.name}`;
      card.innerHTML = `
        <div class="sample-card-preview" style="background-image: url('${imgPath}')"></div>
        <div class="sample-card-info">
          <h4>${sample.label}</h4>
          <span class="sample-card-tag">Preset Chart</span>
        </div>
      `;

      card.addEventListener("click", () => {
        simulatePresetUpload(sample.name);
      });

      gallery.appendChild(card);
    });
  }

  // --- Auth Dialog Navigation ---
  function showPaywall(initialView = "register") {
    paywallModal.classList.add("active");
    
    // Toggle the visible screen
    if (initialView === "register") {
      authRegisterView.style.display = "block";
      authLoginView.style.display = "none";
      paymentPortalView.style.display = "none";
    } else if (initialView === "login") {
      authRegisterView.style.display = "none";
      authLoginView.style.display = "block";
      paymentPortalView.style.display = "none";
    } else if (initialView === "payment") {
      authRegisterView.style.display = "none";
      authLoginView.style.display = "none";
      paymentPortalView.style.display = "block";
    }
  }

  function hidePaywall() {
    paywallModal.classList.remove("active");
  }

  // Setup registration and login click toggles
  function setupAuthListeners() {
    toggleToLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showPaywall("login");
    });

    toggleToRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showPaywall("register");
    });

    // Registration Submission
    registerForm.addEventListener("submit", () => {
      const name = regName.value.trim();
      const email = regEmail.value.trim().toLowerCase();
      const phone = regPhone.value.trim();
      const password = regPassword.value;

      if (!name || !email || !phone || !password) return;

      // Check duplicate
      const exist = users.find(u => u.email === email || u.phone === phone);
      if (exist) {
        alert("An account with this email or phone number already exists. Please log in.");
        showPaywall("login");
        return;
      }

      // Check VIP pre-approval list (emails or phone numbers)
      const isVip = vipList.some(item => 
        item.toLowerCase() === email || item === phone
      );

      let assignedTier = "free";
      if (isVip) {
        assignedTier = "premium";
        alert(`✨ Pre-approved VIP Investor Recognized! \nWelcome back. Instant unlimited premium access has been pre-activated for you.`);
      }

      const newUser = {
        name,
        email,
        phone,
        password,
        tier: assignedTier,
        submittedTrxId: null
      };

      users.push(newUser);
      currentUser = newUser;
      
      saveState();
      updateSubscriptionUI();
      renderUserHeaderArea();

      // Form clear
      registerForm.reset();

      if (assignedTier === "premium") {
        hidePaywall();
      } else {
        // Standard user -> direct to payment portal
        showPaywall("payment");
      }
    });

    // Login Submission
    loginForm.addEventListener("submit", () => {
      const identifier = loginIdentifier.value.trim().toLowerCase();
      const pass = loginPassword.value;

      if (!identifier || !pass) return;

      // Find user matching email OR phone
      const user = users.find(u => 
        (u.email.toLowerCase() === identifier || u.phone === identifier) && u.password === pass
      );

      if (user) {
        currentUser = user;
        saveState();
        updateSubscriptionUI();
        renderUserHeaderArea();
        loginForm.reset();
        
        alert(`Welcome back, ${user.name}!`);
        
        // Modal state routing based on tier
        if (user.tier === "premium") {
          hidePaywall();
        } else if (user.tier === "pending") {
          alert(`Your bKash/Bank payment validation request is currently pending verification. Unlimited access will unlock as soon as approved by our research desk.`);
          hidePaywall();
        } else {
          // Free tier
          if (scanCount >= 3) {
            showPaywall("payment");
          } else {
            hidePaywall();
          }
        }
      } else {
        alert("Invalid credentials. Please verify your Email/Phone and Password.");
      }
    });

    // Payment Reference Submission
    paymentForm.addEventListener("submit", () => {
      if (!currentUser) {
        alert("Please register or log in first.");
        showPaywall("register");
        return;
      }

      const pkg = payPackage.value;
      const method = payMethod.value;
      const sender = paySender.value.trim();
      const ref = payReference.value.trim();

      if (!sender || !ref) return;

      // Create validation request
      const paymentRequest = {
        email: currentUser.email,
        name: currentUser.name,
        phone: currentUser.phone,
        method: method,
        sender: sender,
        reference: ref,
        amount: pkg
      };

      pendingPayments.push(paymentRequest);
      
      // Update local user tier state to pending
      const matchedUser = users.find(u => u.email === currentUser.email);
      if (matchedUser) {
        matchedUser.tier = "pending";
        matchedUser.submittedTrxId = ref;
      }
      currentUser.tier = "pending";
      currentUser.submittedTrxId = ref;

      saveState();
      updateSubscriptionUI();
      renderUserHeaderArea();
      renderAdminConsole();
      paymentForm.reset();
      hidePaywall();

      alert(`Payment Reference Submitted! \nMethod: ${method.toUpperCase()} | TrxID: ${ref} \n\nWe are verifying your transaction. Access will unlock in 10-15 minutes. You can monitor or approve it instantly in the Admin Board in the footer.`);
    });
  }

  // --- Super Admin Approval Console ---
  function renderAdminConsole() {
    adminPendingList.innerHTML = "";

    if (pendingPayments.length === 0) {
      adminPendingList.innerHTML = `
        <div style="color: var(--text-dark); font-size: 12px; font-style: italic;">No pending approval requests.</div>
      `;
      return;
    }

    pendingPayments.forEach((req, idx) => {
      const row = document.createElement("div");
      row.style.background = "rgba(255,255,255,0.02)";
      row.style.border = "1px solid var(--border-color)";
      row.style.borderRadius = "8px";
      row.style.padding = "10px";
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      
      const pkgLabel = req.amount === "3999" ? "Yearly (3,999)" : "Monthly (499)";
      row.innerHTML = `
        <div style="font-size: 12px; line-height: 1.4;">
          <div style="font-weight:700; color:#fff;">${req.name} (${req.phone})</div>
          <div style="color:var(--text-muted); font-size:11px;">
            Pkg: <strong style="color:var(--accent-gold);">${pkgLabel}</strong> | Method: <strong>${req.method.toUpperCase()}</strong> | Sender: <strong>${req.sender}</strong>
          </div>
          <div style="font-family:monospace; color:#38bdf8; font-size:11px; margin-top:2px;">TrxID: ${req.reference}</div>
        </div>
        <div style="display:flex; gap:5px;">
          <button class="btn-approve btn-dev" style="background:#10b981; color:#fff; border:none; padding:4px 8px; border-radius:4px;">Approve</button>
          <button class="btn-reject btn-dev" style="background:#f43f5e; color:#fff; border:none; padding:4px 8px; border-radius:4px;">Reject</button>
        </div>
      `;

      // Approve Handler
      row.querySelector(".btn-approve").addEventListener("click", () => {
        // 1. Upgrade user tier in database
        const targetUser = users.find(u => u.email === req.email);
        if (targetUser) {
          targetUser.tier = "premium";
        }
        
        // If current logged-in user is the one approved, update session
        if (currentUser && currentUser.email === req.email) {
          currentUser.tier = "premium";
        }

        // 2. Remove from pending payments list
        pendingPayments.splice(idx, 1);
        
        saveState();
        updateSubscriptionUI();
        renderUserHeaderArea();
        renderAdminConsole();
        alert(`Account for ${req.name} has been activated to PREMIUM.`);
      });

      // Reject Handler
      row.querySelector(".btn-reject").addEventListener("click", () => {
        // 1. Revert user tier in database
        const targetUser = users.find(u => u.email === req.email);
        if (targetUser) {
          targetUser.tier = "free";
        }

        // If current logged-in user is the one rejected, update session
        if (currentUser && currentUser.email === req.email) {
          currentUser.tier = "free";
        }

        // 2. Remove from pending payments list
        pendingPayments.splice(idx, 1);
        
        saveState();
        updateSubscriptionUI();
        renderUserHeaderArea();
        renderAdminConsole();
        alert(`Payment reference for ${req.name} has been rejected.`);
      });

      adminPendingList.appendChild(row);
    });
  }

  // VIP Database Seeding Handler
  btnSeedVip.addEventListener("click", () => {
    const rawInput = adminVipInput.value;
    if (!rawInput.trim()) return;

    // Split by newlines or commas
    const entries = rawInput.split(/[\n,]+/).map(item => item.trim()).filter(item => item.length > 0);
    
    let addedCount = 0;
    entries.forEach(entry => {
      const normalized = entry.toLowerCase();
      if (!vipList.includes(normalized)) {
        vipList.push(normalized);
        addedCount++;
      }
    });

    saveState();
    adminVipInput.value = "";
    alert(`Success: Added ${addedCount} pre-approved entries to the VIP Seeding Database.`);
  });

  // --- Upload Coordination ---
  async function handleFileSelected(file) {
    if (!file) return;

    // Check Account Status limits
    const currentTier = currentUser ? currentUser.tier : (localStorage.getItem("dse_premium") === "true" ? "premium" : "free");

    if (currentTier === "premium") {
      // PRO USER LIMIT: 30 daily scans
      if (checkProDailyLimit()) {
        alert("Daily Limit Reached! \nPro users are limited to 30 scans per day. Please wait until tomorrow (BST) to analyze more stock charts.");
        return;
      }
    } else if (currentTier === "pending") {
      alert(`Your payment reference is currently under review by our accounts department. \nTransaction reference: ${currentUser.submittedTrxId} \n\nUnlimited access will unlock as soon as approved.`);
      return;
    } else {
      // FREE USER LIMIT: 3 scans in total
      if (scanCount >= 3) {
        if (!currentUser) {
          showPaywall("register");
        } else {
          showPaywall("payment");
        }
        return;
      }
    }

    // Switch to Scanning Screen
    uploadScreen.style.display = "none";
    scanningScreen.style.display = "flex";
    resultsScreen.style.display = "none";

    try {
      const result = await VisionEngine.analyzeScreenshot(file, {
        useRealAI: useRealAI,
        apiKey: apiKey
      });

      // Increment counts on free/pro tiers
      if (currentTier === "premium") {
        proScanCount++;
        localStorage.setItem("dse_pro_scan_count", proScanCount);
      } else {
        scanCount++;
        saveState();
      }
      
      updateSubscriptionUI();
      displayResults(result);

      // Force Registration workflow as soon as 3rd free scan completes
      if (currentTier === "free" && scanCount === 3 && !currentUser) {
        setTimeout(() => {
          alert("Trial scan completed! You have reached your limit of 3 free scans. \n\nPlease create a profile to continue using the application.");
          showPaywall("register");
        }, 3500); // Trigger after scanning dashboard has fully rendered
      }
    } catch (err) {
      console.error(err);
      alert("Analysis failed: " + err.message);
      resetToUpload();
    }
  }

  function simulatePresetUpload(fileName) {
    const mockFile = {
      name: fileName,
      size: 1024,
      type: "image/jpeg"
    };
    handleFileSelected(mockFile);
  }

  // --- Display Results ---
  function displayResults(data) {
    activeAnalysis = data;
    
    // Switch screens
    scanningScreen.style.display = "none";
    resultsScreen.style.display = "block";

    // Set images and ticker info
    analyzedImg.src = data.imageSrc;
    resultTicker.textContent = data.ticker;
    resultName.textContent = data.name;
    resultPlatform.textContent = data.platform || "DSE Stock Charts";
    engineBadge.textContent = data.engine || "Analysis Engine";

    // Detailed metrics with English & Bengali side-by-side / stacked
    renderDualLang(resultTrend, data.analysis.trend, data.analysis.trendBn);
    
    resultRsiVal.textContent = data.analysis.rsi.value;
    renderDualLang(resultRsiInterpretation, data.analysis.rsi.interpretation, data.analysis.rsi.interpretationBn);

    resultMacdVal.textContent = data.analysis.macd.value;
    renderDualLang(resultMacdInterpretation, data.analysis.macd.interpretation, data.analysis.macd.interpretationBn);

    renderDualLang(resultSupport, data.analysis.supportResistance.support, data.analysis.supportResistance.supportBn);
    renderDualLang(resultResistance, data.analysis.supportResistance.resistance, data.analysis.supportResistance.resistanceBn);
    renderDualLang(resultPattern, data.analysis.candlestickPattern, data.analysis.candlestickPatternBn);
    renderDualLang(resultOutlook, data.analysis.outlook, data.analysis.outlookBn);

    // Render clickable indicators list for educational detail
    indicatorsList.innerHTML = "";
    const indicatorKeys = data.indicators || ["RSI (14)", "MACD (12, 26, 9)", "EMA 50 / 200", "Volume Analysis"];
    
    indicatorKeys.forEach(indKey => {
      const tag = document.createElement("button");
      tag.className = "indicator-edu-tag";
      tag.innerHTML = `<i class="lucide-info"></i> ${indKey}`;
      tag.addEventListener("click", () => {
        showEducationDetails(indKey);
      });
      indicatorsList.appendChild(tag);
    });

    if (data.error) {
      const alertDiv = document.createElement("div");
      alertDiv.className = "api-warning-bar";
      alertDiv.innerHTML = `<i class="lucide-alert-triangle"></i> ${data.error}`;
      resultsScreen.insertBefore(alertDiv, resultsScreen.firstChild);
      setTimeout(() => alertDiv.remove(), 8000);
    }
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- Educational Modals ---
  function showEducationDetails(indicatorName) {
    let databaseKey = "RSI (14)";
    if (indicatorName.includes("RSI")) databaseKey = "RSI (14)";
    else if (indicatorName.includes("MACD")) databaseKey = "MACD (12, 26, 9)";
    else if (indicatorName.includes("EMA") || indicatorName.includes("MA")) databaseKey = "EMA 50 / 200";
    else if (indicatorName.includes("Volume")) databaseKey = "Volume Analysis";

    const eduData = DSE_DATABASE.educationalGuides[databaseKey];
    if (eduData) {
      eduTitle.textContent = eduData.title;
      eduDesc.textContent = eduData.desc;
      eduBullish.textContent = eduData.bullishSignal;
      eduBearish.textContent = eduData.bearishSignal;
      eduTip.textContent = eduData.applicationTip;
      
      eduModal.classList.add("active");
    }
  }

  // --- Reset UI ---
  function resetToUpload() {
    uploadScreen.style.display = "flex";
    scanningScreen.style.display = "none";
    resultsScreen.style.display = "none";
    activeAnalysis = null;
  }

  // --- Drag & Drop Listeners ---
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelected(files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  dropzone.addEventListener("click", (e) => {
    if (e.target !== fileInput) {
      fileInput.click();
    }
  });

  // --- General Click Event Bindings ---
  scanNewBtn.addEventListener("click", resetToUpload);
  
  exportPdfBtn.addEventListener("click", () => {
    const currentTier = currentUser ? currentUser.tier : (localStorage.getItem("dse_premium") === "true" ? "premium" : "free");
    if (currentTier !== "premium") {
      if (!currentUser) {
        showPaywall("register");
      } else {
        showPaywall("payment");
      }
    } else {
      PDFExporter.exportReport(activeAnalysis);
    }
  });

  closePaywallBtn.addEventListener("click", hidePaywall);
  upgradeCtaBtn.addEventListener("click", () => {
    if (!currentUser) {
      showPaywall("register");
    } else if (currentUser.tier === "premium") {
      alert("You are already a Premium member.");
    } else {
      showPaywall("payment");
    }
  });
  closeEduBtn.addEventListener("click", () => eduModal.classList.remove("active"));

  window.addEventListener("click", (e) => {
    if (e.target === paywallModal) hidePaywall();
    if (e.target === eduModal) eduModal.classList.remove("active");
  });

  // --- Developer Controls ---
  devResetScansBtn.addEventListener("click", () => {
    scanCount = 0;
    proScanCount = 0;
    localStorage.setItem("dse_pro_scan_count", 0);
    saveState();
    updateSubscriptionUI();
    alert("Scan count limits (Free & Pro daily limits) have been reset.");
  });

  devTogglePremiumBtn.addEventListener("click", () => {
    let effective = localStorage.getItem("dse_premium") === "true";
    effective = !effective;
    localStorage.setItem("dse_premium", effective);
    
    if (currentUser) {
      currentUser.tier = effective ? "premium" : "free";
      const dbUser = users.find(u => u.email === currentUser.email);
      if (dbUser) dbUser.tier = currentUser.tier;
    }
    
    saveState();
    updateSubscriptionUI();
    renderUserHeaderArea();
    alert(`Premium mode toggled: ${effective ? "ON" : "OFF"}`);
  });

  // Run startup
  init();
});
