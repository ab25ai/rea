(() => {
  "use strict";

  const SAMPLE = [
    {
      symbol: "NVA",
      name: "Navira Components",
      sector: "Industrials",
      price: 842,
      marketCap: 12840,
      pe: 24.6,
      roce: 22.4,
      roe: 18.7,
      salesGrowth: 16.2,
      profitGrowth: 19.5,
      debtToEquity: 0.08,
      description:
        "A fictional precision engineering supplier used to demonstrate Stocky’s company research view.",
    },
    {
      symbol: "KST",
      name: "Kestrel Consumer",
      sector: "Consumer Goods",
      price: 1260,
      marketCap: 38750,
      pe: 38.2,
      roce: 31.8,
      roe: 27.4,
      salesGrowth: 14.1,
      profitGrowth: 15.8,
      debtToEquity: 0.12,
      description:
        "A fictional consumer products business in the sample dataset.",
    },
    {
      symbol: "ORB",
      name: "Orbis Renewables",
      sector: "Energy",
      price: 518,
      marketCap: 19420,
      pe: 31.5,
      roce: 19.3,
      roe: 13.6,
      salesGrowth: 27.6,
      profitGrowth: 23.1,
      debtToEquity: 0.55,
      description: "A fictional clean energy developer in the sample dataset.",
    },
    {
      symbol: "MTR",
      name: "Meridian Textiles",
      sector: "Textiles",
      price: 274,
      marketCap: 4360,
      pe: 13.8,
      roce: 17.6,
      roe: 15.2,
      salesGrowth: 11.3,
      profitGrowth: 12.8,
      debtToEquity: 0.31,
      description: "A fictional textile manufacturer in the sample dataset.",
    },
    {
      symbol: "PLM",
      name: "Palladium Life Sciences",
      sector: "Healthcare",
      price: 935,
      marketCap: 22600,
      pe: 29.4,
      roce: 24.7,
      roe: 20.3,
      salesGrowth: 18.5,
      profitGrowth: 22.4,
      debtToEquity: 0.06,
      description: "A fictional healthcare company in the sample dataset.",
    },
    {
      symbol: "CED",
      name: "Cedar Financial",
      sector: "Financials",
      price: 466,
      marketCap: 15890,
      pe: 17.1,
      roce: 12.4,
      roe: 16.8,
      salesGrowth: 21.8,
      profitGrowth: 18.6,
      debtToEquity: 1.24,
      description:
        "A fictional financial services company in the sample dataset.",
    },
    {
      symbol: "VTR",
      name: "Venture Logistics",
      sector: "Logistics",
      price: 392,
      marketCap: 8950,
      pe: 21.7,
      roce: 18.9,
      roe: 14.5,
      salesGrowth: 19.2,
      profitGrowth: 20.7,
      debtToEquity: 0.22,
      description: "A fictional logistics operator in the sample dataset.",
    },
    {
      symbol: "HZN",
      name: "Horizon Foods",
      sector: "Consumer Goods",
      price: 688,
      marketCap: 27410,
      pe: 42.3,
      roce: 28.1,
      roe: 23.6,
      salesGrowth: 13.7,
      profitGrowth: 14.2,
      debtToEquity: 0.03,
      description: "A fictional packaged foods business in the sample dataset.",
    },
    {
      symbol: "AER",
      name: "Aeronix Systems",
      sector: "Technology",
      price: 1545,
      marketCap: 31200,
      pe: 35.6,
      roce: 26.2,
      roe: 21.8,
      salesGrowth: 24.5,
      profitGrowth: 26.1,
      debtToEquity: 0,
      description:
        "A fictional technology services company in the sample dataset.",
    },
    {
      symbol: "RIV",
      name: "Riverstone Materials",
      sector: "Materials",
      price: 318,
      marketCap: 6750,
      pe: 11.2,
      roce: 15.8,
      roe: 12.9,
      salesGrowth: 8.4,
      profitGrowth: 9.6,
      debtToEquity: 0.47,
      description:
        "A fictional specialty materials supplier in the sample dataset.",
    },
    {
      symbol: "SOL",
      name: "Solstice Electricals",
      sector: "Industrials",
      price: 1078,
      marketCap: 18360,
      pe: 27.8,
      roce: 23.5,
      roe: 19.2,
      salesGrowth: 17.8,
      profitGrowth: 18.1,
      debtToEquity: 0.14,
      description:
        "A fictional electrical equipment maker in the sample dataset.",
    },
    {
      symbol: "BRK",
      name: "Brookfield Retail",
      sector: "Retail",
      price: 235,
      marketCap: 5240,
      pe: 19.3,
      roce: 16.4,
      roe: 14.8,
      salesGrowth: 20.6,
      profitGrowth: 17.2,
      debtToEquity: 0.38,
      description: "A fictional specialty retailer in the sample dataset.",
    },
  ];
  const STORAGE = {
    data: "stocky.data.v1",
    watch: "stocky.watch.v1",
    portfolio: "stocky.portfolio.v1",
    research: "stocky.research.v1",
  };
  const palette = [
    ["#eaf1e5", "#60845e"],
    ["#f4ebe4", "#b17a56"],
    ["#e8eff2", "#68889a"],
    ["#f1eafa", "#886ca6"],
    ["#f7eee4", "#a87e4f"],
    ["#e5f0ef", "#5c8c84"],
  ];
  const el = (id) => document.getElementById(id);
  let imported = localStorage.getItem(STORAGE.data) !== null;
  let stocks = readStoredData();
  let watch = new Set(readWatchlist());
  let portfolio = readJson(STORAGE.portfolio, []);
  let research = readJson(STORAGE.research, []);
  let kukuHistory = [];
  let kukuReady = false;
  let webSearchReady = false;
  let voiceReady = false;
  let navReady = false;
  let pendingVoice = false;

  let view = "overview";
  let query = "";
  let selected = null;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return Array.isArray(value) ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function readStoredData() {
    try {
      const raw = localStorage.getItem(STORAGE.data);
      if (!raw) return SAMPLE.map((x) => ({ ...x }));
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length
        ? parsed
        : SAMPLE.map((x) => ({ ...x }));
    } catch {
      return SAMPLE.map((x) => ({ ...x }));
    }
  }
  function readWatchlist() {
    try {
      const v = JSON.parse(localStorage.getItem(STORAGE.watch) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }
  function persist() {
    try {
      if (imported) localStorage.setItem(STORAGE.data, JSON.stringify(stocks));
      else localStorage.removeItem(STORAGE.data);
      localStorage.setItem(STORAGE.watch, JSON.stringify([...watch]));
    } catch {
      /* Browser storage may be disabled or full. */
    }
  }
  function fmt(value, digits = 1) {
    return Number.isFinite(Number(value))
      ? Number(value).toLocaleString("en-IN", { maximumFractionDigits: digits })
      : "—";
  }
  function cap(value) {
    const n = Number(value);
    return n >= 100000
      ? `${fmt(n / 100000, 2)}L Cr`
      : n >= 1000
        ? `${fmt(n / 1000, 1)}K Cr`
        : `${fmt(n, 0)} Cr`;
  }
  function colorFor(symbol) {
    let n = 0;
    for (const c of symbol) n = (n * 31 + c.charCodeAt(0)) % palette.length;
    return palette[n];
  }
  function badge(stock, cls = "company-logo") {
    const [bg, fg] = colorFor(stock.symbol);
    return `<span class="${cls}" style="background:${bg};color:${fg}">${escapeHtml(stock.symbol.slice(0, 2))}</span>`;
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  function filteredStocks() {
    const needle = query.trim().toLowerCase();
    let list = stocks.filter(
      (s) =>
        (!needle ||
          `${s.name} ${s.symbol} ${s.sector || ""}`
            .toLowerCase()
            .includes(needle)) &&
        (view !== "watchlist" || watch.has(s.symbol)) &&
        (!el("maxPe").value || s.pe <= Number(el("maxPe").value)) &&
        (!el("minRoce").value || s.roce >= Number(el("minRoce").value)) &&
        (!el("minCap").value || s.marketCap >= Number(el("minCap").value)),
    );
    const sort = el("sortSelect").value;
    list.sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "pe"
          ? a.pe - b.pe
          : (b[sort] || 0) - (a[sort] || 0),
    );
    return list;
  }
  function render() {
    const rows = filteredStocks();
    const count = stocks.length;
    el("watchCount").textContent = watch.size;
    el("portfolioCount").textContent = portfolio.length;
    el("statCompanies").textContent = count;
    el("statWatch").textContent = watch.size;
    el("statRoce").textContent = rows.length
      ? `${fmt(rows.reduce((n, s) => n + s.roce, 0) / rows.length)}%`
      : "—";
    el("resultCount").textContent =
      `Showing ${rows.length} of ${count} companies`;
    el("tableTitle").textContent =
      view === "watchlist"
        ? "Your watchlist"
        : view === "screener"
          ? "Screener results"
          : "Companies to explore";
    el("crumbTitle").textContent =
      {
        watchlist: "Watchlist",
        screener: "Stock screener",
        portfolio: "Portfolio",
        research: "Research list",
        kuku: "Kuku chat",
      }[view] || "Overview";
    el("marketPill").innerHTML =
      `<span class="market-dot"></span> ${view === "portfolio" ? "LOCAL SNAPSHOT" : view === "research" ? "NO LIVE FEED" : "DEMO DATA"}`;
    document
      .querySelectorAll(".nav-item[data-view]")
      .forEach((n) => n.classList.toggle("active", n.dataset.view === view));
    const headings = {
      overview: [
        "Make research <em>clearer.</em>",
        "A calm place to explore company fundamentals and build your watchlist.",
      ],
      screener: [
        "Find your <em>next question.</em>",
        "Filter the dataset and explore the companies that fit your criteria.",
      ],
      watchlist: [
        "Your ideas, <em>in one place.</em>",
        "Companies you saved to revisit, all in one place.",
      ],
      portfolio: [
        "Know what <em>you own.</em>",
        "A private snapshot of your stocks, ETFs, and mutual funds.",
      ],
      research: [
        "Follow your <em>curiosity.</em>",
        "Keep investments you want to understand close at hand.",
      ],
      kuku: [
        "Meet <em>Kuku.</em>",
        "Plain-English investing help, powered by your local model.",
      ],
    };
    el("pageTitle").innerHTML = headings[view][0];
    el("pageSubtitle").textContent = headings[view][1];
    const personalView =
      view === "portfolio" || view === "research" || view === "kuku";
    el("statsGrid").hidden = personalView;
    document.querySelector(".data-note").hidden = personalView;
    document.querySelector(".market-strip").hidden = personalView;
    document.querySelector(".content-grid").hidden = personalView;
    el("portfolioView").hidden = view !== "portfolio";
    el("researchView").hidden = view !== "research";
    el("kukuView").hidden = view !== "kuku";
    el("newScreenBtn").hidden = personalView;
    if (view === "kuku") refreshKukuStatus();
    el("statCompanies").parentElement.querySelector(".stat-foot").textContent =
      imported ? "Imported on this device" : "In this sample dataset";
    const body = el("stockRows");
    body.innerHTML = rows.length
      ? rows
          .map(
            (s) =>
              `<tr data-symbol="${escapeHtml(s.symbol)}"><td><div class="company-cell">${badge(s)}<div><div class="company-name">${escapeHtml(s.name)}</div><div class="company-symbol">${escapeHtml(s.symbol)} · ${escapeHtml(s.sector || "Company")}</div></div></div></td><td>₹${fmt(s.price, 2)}</td><td>${cap(s.marketCap)}</td><td>${fmt(s.pe)}</td><td class="${s.roce >= 18 ? "positive" : ""}">${fmt(s.roce)}%</td><td>${fmt(s.roe)}%</td><td><button class="watch-star ${watch.has(s.symbol) ? "saved" : ""}" data-watch="${escapeHtml(s.symbol)}" aria-label="${watch.has(s.symbol) ? "Remove from" : "Add to"} watchlist">${watch.has(s.symbol) ? "★" : "☆"}</button></td></tr>`,
          )
          .join("")
      : `<tr><td colspan="7"><div class="empty-state"><strong>${view === "watchlist" ? "Your watchlist is empty" : "No companies match"}</strong>${view === "watchlist" ? "Add a company with the star beside its name." : "Try adjusting your search or filters."}</div></td></tr>`;
    const preview = [...watch]
      .map((sym) => stocks.find((s) => s.symbol === sym))
      .filter(Boolean)
      .slice(0, 4);
    el("watchlistPreview").innerHTML = preview.length
      ? preview
          .map(
            (s) =>
              `<div class="watch-row" data-open="${escapeHtml(s.symbol)}">${badge(s, "watch-mini-logo")}<div class="watch-row-info"><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.symbol)}</small></div><div class="watch-row-price">₹${fmt(s.price, 0)}<small>${fmt(s.roce)}% ROCE</small></div></div>`,
          )
          .join("")
      : `<div class="watch-empty">A shortlist makes it easier to follow the companies you care about.</div>`;
    const values = [
      ["P/E", el("maxPe").value],
      ["ROCE ≥", el("minRoce").value ? `${el("minRoce").value}%` : ""],
      ["Mkt cap ≥", el("minCap").value ? `${el("minCap").value} Cr` : ""],
    ].filter((x) => x[1]);
    el("filterBadge").hidden = !values.length;
    el("filterBadge").textContent = values.length;
    el("activeFilters").innerHTML = values
      .map(([k, v]) => `<span class="filter-chip">${k} ${escapeHtml(v)}</span>`)
      .join("");
    renderPortfolio();
    renderResearch();
  }

  function money(value, digits = 0) {
    return Number.isFinite(value)
      ? `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
      : "—";
  }
  function renderPortfolio() {
    const has = portfolio.length > 0;
    el("portfolioEmpty").hidden = has;
    el("portfolioSummary").hidden = !has;
    const sourceDates = [
      ...new Set(portfolio.map((p) => p.asOfDate).filter(Boolean)),
    ];
    el("portfolioAsOf").textContent = has
      ? `${sourceDates.length === 1 ? `Data as of ${sourceDates[0]} · ` : sourceDates.length > 1 ? "Multiple report dates · " : "Report date not supplied · "}Imported ${new Date(portfolio[0].importedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · prices reflect your CSV snapshot`
      : "Import a holdings CSV to get started.";
    if (!has) return;
    const knownValue = portfolio
      .filter((p) => Number.isFinite(p.value))
      .reduce((a, p) => a + p.value, 0);
    const completePositions = portfolio.filter(
      (p) => Number.isFinite(p.value) && Number.isFinite(p.invested),
    );
    const knownInvested = completePositions.reduce((a, p) => a + p.invested, 0);
    const complete = portfolio.every(
      (p) => Number.isFinite(p.value) && Number.isFinite(p.invested),
    );
    const pnl = completePositions.reduce((a, p) => a + p.value - p.invested, 0);
    const pct = knownInvested ? (100 * pnl) / knownInvested : NaN;
    el("portfolioValue").textContent = money(knownValue);
    el("portfolioInvested").textContent = complete
      ? money(knownInvested)
      : `${money(knownInvested)}*`;
    el("portfolioPnl").textContent = complete ? money(pnl) : `${money(pnl)}*`;
    el("portfolioPnl").className = `${pnl >= 0 ? "positive" : "negative"}`;
    el("portfolioPnlPct").textContent =
      complete && Number.isFinite(pct)
        ? `${pct >= 0 ? "+" : ""}${fmt(pct)}% total return`
        : "* Partial: average cost missing for one or more positions";
    el("portfolioPositions").textContent = portfolio.length;
    el("portfolioRows").innerHTML = portfolio
      .map((p) => {
        const gain =
          Number.isFinite(p.invested) && Number.isFinite(p.value)
            ? p.value - p.invested
            : NaN;
        const pc = p.invested ? (100 * gain) / p.invested : NaN;
        return `<tr><td><div class="company-cell">${badge({ symbol: p.symbol })}<div><div class="company-name">${escapeHtml(p.name)}</div><div class="company-symbol">${escapeHtml(p.symbol)}${p.isin ? ` · ${escapeHtml(p.isin)}` : ""}</div></div></div></td><td>${escapeHtml(p.type)}</td><td>${fmt(p.units, 4)}</td><td>${money(p.averageCost, 2)}</td><td>${money(p.currentPrice, 2)}</td><td>${money(p.value)}</td><td class="${gain >= 0 ? "positive" : "negative"}">${Number.isFinite(gain) ? `${money(gain)} (${fmt(pc)}%)` : "Cost basis n/a"}</td></tr>`;
      })
      .join("");
    const types = ["Stock", "ETF", "Mutual fund"];
    el("allocationRows").innerHTML = types
      .map((type) => {
        const amount = portfolio
          .filter((p) => p.type === type && Number.isFinite(p.value))
          .reduce((n, p) => n + p.value, 0);
        const pct = knownValue ? (amount / knownValue) * 100 : 0;
        return `<div class="allocation-row"><div><span>${type === "Mutual fund" ? "Mutual funds" : `${type}s`}</span><b>${fmt(pct)}%</b></div><div class="allocation-track"><span style="width:${pct.toFixed(2)}%"></span></div><small>${money(amount)}</small></div>`;
      })
      .join("");
  }
  function renderResearch() {
    el("researchCount").textContent = `${research.length} saved`;
    el("researchRows").innerHTML = research.length
      ? research
          .map(
            (item, i) =>
              `<div class="research-row"><div class="research-token">${escapeHtml(item.type === "Mutual fund" ? "MF" : item.type.slice(0, 1))}</div><div class="research-row-main"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.type)}${item.symbol ? ` · ${escapeHtml(item.symbol)}` : ""}</small></div><small class="research-date">Added ${new Date(item.addedAt).toLocaleDateString("en-IN")}</small><button class="remove-research" data-remove-research="${i}" aria-label="Remove ${escapeHtml(item.name)}">×</button></div>`,
          )
          .join("")
      : '<div class="empty-state"><strong>Your research list is empty</strong>Add a stock, ETF, or mutual fund you want to look into.</div>';
  }
  function updateKukuFeatureState(status) {
    webSearchReady = Boolean(status && status.webSearch);
    voiceReady = Boolean(status && status.voiceTranscription);
    navReady = Boolean(status && status.mutualFundNav);
    const webLabel = el("webResearch");
    const voiceButton = el("voiceButton");
    const voiceLabel = el("voiceButtonLabel");
    const voiceStatus = el("voiceStatus");
    const navLabel = el("navLookup");
    webLabel.classList.toggle("kuku-unavailable", !webSearchReady);
    webLabel.title = webSearchReady
      ? "Web search is connected through your Ollama service."
      : "Internet research is not configured in Stocky/.env.local.";
    webLabel.textContent = webSearchReady
      ? "⌕ Web search ready"
      : "⌕ Web search not connected";
    navLabel.classList.toggle("kuku-unavailable", !navReady);
    navLabel.title = navReady
      ? "Current mutual-fund NAV data from AMFI is available."
      : "AMFI fund NAV lookup is not configured yet.";
    navLabel.textContent = navReady
      ? "◌ Fund NAV ready"
      : "◌ Fund NAV not ready";
    voiceButton.disabled = !voiceReady;
    voiceButton.title = voiceReady
      ? "Use local voice transcription"
      : "Voice transcription is not configured yet.";
    voiceLabel.textContent = voiceReady ? "Voice input" : "Voice not set up";
    voiceStatus.textContent = voiceReady
      ? "Live transcription ready"
      : "Voice disabled";
    voiceStatus.style.display = voiceReady ? "inline" : "none";
  }
  function renderKuku() {
    const root = el("kukuMessages");
    root.replaceChildren();
    if (!kukuHistory.length) {
      const welcome = document.createElement("div");
      welcome.className = "kuku-welcome";
      welcome.innerHTML =
        '<div class="welcome-mark">✳</div><h2>Hi, I’m Kuku.</h2><p>Ask about your imported holdings or investment concepts. Kuku runs on the local model in Ollama and can use optional web sources, daily AMFI fund NAVs, and local voice input when configured.</p><div class="suggestion-chips"><button type="button" data-prompt="Explain the main risks and concentration in my holdings.">Explain portfolio risks</button><button type="button" data-prompt="What is the latest NAV and source for my HDFC Index Fund? Use current fund data if available.">Check mutual fund NAV</button><button type="button" data-prompt="What recent news should I know about Reliance Industries? Use current web sources if available.">Check a company</button></div>';
      root.append(welcome);
      return;
    }
    for (const message of kukuHistory) {
      const item = document.createElement("article");
      item.className =
        "chat-message " + (message.role === "user" ? "from-user" : "from-kuku");
      if (message.role === "assistant") {
        const mark = document.createElement("span");
        mark.className = "chat-avatar";
        mark.textContent = "✳";
        item.append(mark);
      }
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      const body = document.createElement("div");
      body.className = "chat-text";
      body.textContent = message.content;
      bubble.append(body);
      item.append(bubble);
      root.append(item);
    }
    root.scrollTop = root.scrollHeight;
  }
  let kukuStatusRetry = null;

  function scheduleKukuStatusRetry() {
    if (kukuStatusRetry) return;
    kukuStatusRetry = setInterval(() => {
      if (document.visibilityState !== "hidden")
        refreshKukuStatus().catch(() => {});
    }, 5000);
  }

  function clearKukuStatusRetry() {
    if (kukuStatusRetry) {
      clearInterval(kukuStatusRetry);
      kukuStatusRetry = null;
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      clearKukuStatusRetry();
      return;
    }
    if (!kukuReady) {
      scheduleKukuStatusRetry();
    }
  });

  window.addEventListener("beforeunload", clearKukuStatusRetry);

  async function refreshKukuStatus() {
    el("kukuStatusText").textContent = "Checking Ollama on this computer…";
    el("includePortfolio").disabled = portfolio.length === 0;
    el("includePortfolio").parentElement.title = portfolio.length
      ? "When enabled, imported holdings are sent only to Ollama running on this computer."
      : "Import a portfolio first.";
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      const status = await response.json();
      kukuReady = response.ok && status.configured === true;
      updateKukuFeatureState(status);
      el("kukuSetup").hidden = kukuReady;
      el("kukuChat").hidden = !kukuReady;
      el("kukuStatusDot").classList.toggle("ready", kukuReady);
      el("kukuStatusText").textContent = kukuReady
        ? "Connected locally · " + status.model
        : status.message || "Ollama is not ready yet.";
      if (kukuReady) {
        clearKukuStatusRetry();
        renderKuku();
      } else {
        scheduleKukuStatusRetry();
      }
    } catch {
      kukuReady = false;
      el("kukuSetup").hidden = false;
      el("kukuChat").hidden = true;
      el("kukuStatusDot").classList.remove("ready");
      el("kukuStatusText").textContent =
        "Start Stocky’s local server to connect";
      scheduleKukuStatusRetry();
    }
  }
  async function sendKuku(question) {
    if (!kukuReady) return;
    kukuHistory.push({ role: "user", content: question });
    renderKuku();
    const pending = document.createElement("article");
    pending.className = "chat-message from-kuku";
    pending.innerHTML =
      '<span class="chat-avatar">✳</span><div class="chat-bubble typing-indicator">Kuku is thinking<span>…</span></div>';
    el("kukuMessages").append(pending);
    el("kukuMessages").scrollTop = el("kukuMessages").scrollHeight;
    el("sendKuku").disabled = true;
    el("kukuInput").disabled = true;
    try {
      const payload = {
        messages: kukuHistory.slice(-16),
        includePortfolio: el("includePortfolio").checked,
        webResearch:
          el("webResearch").classList.contains("kuku-ready") || webSearchReady,
      };
      const mutualFundName = (el("navLookup").dataset.query || "").trim();
      if (mutualFundName) {
        payload.mutualFundName = mutualFundName;
        payload.mutualFundNav = true;
      }
      if (payload.includePortfolio) payload.portfolio = portfolio;
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Request failed (" + response.status + ").",
        );
      kukuHistory.push({
        role: "assistant",
        content: result.answer || "The local model returned an empty answer.",
      });
    } catch (error) {
      kukuHistory.push({
        role: "assistant",
        content: "I couldn’t complete that request: " + error.message,
      });
    } finally {
      el("sendKuku").disabled = false;
      el("kukuInput").disabled = false;
      el("kukuInput").focus();
      renderKuku();
    }
  }

  async function handleVoiceInput() {
    if (!voiceReady) {
      el("voiceStatus").textContent = "Configure whisper.cpp";
      return;
    }
    const media = navigator.mediaDevices;
    if (!media || !media.getUserMedia) {
      el("voiceStatus").textContent = "Microphone not available";
      return;
    }
    try {
      pendingVoice = true;
      el("voiceStatus").textContent = "Listening…";
      const stream = await media.getUserMedia({ audio: true, video: false });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunks.push(event.data);
      };
      await new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = () =>
          reject(new Error("Microphone recording failed."));
        recorder.start();
        setTimeout(() => recorder.stop(), 4500);
      });
      stream.getTracks().forEach((track) => track.stop());
      const audioBlob = new Blob(chunks, { type: mimeType || "audio/webm" });
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: audioBlob,
        headers: { "Content-Type": audioBlob.type || "audio/webm" },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Voice transcription failed.");
      el("kukuInput").value = (
        el("kukuInput").value +
        " " +
        result.transcript
      ).trim();
      el("kukuInput").focus();
      el("voiceStatus").textContent = "Transcript ready";
    } catch (error) {
      el("voiceStatus").textContent = error.message || "Voice failed";
    } finally {
      pendingVoice = false;
      setTimeout(() => {
        if (!pendingVoice && voiceReady)
          el("voiceStatus").textContent = "Live transcription ready";
      }, 1400);
    }
  }

  function updateWebToggle() {
    const enabled = webSearchReady;
    const label = el("webResearch");
    label.classList.toggle("kuku-ready", enabled);
    label.classList.toggle("kuku-unavailable", !enabled);
    label.setAttribute("aria-pressed", String(enabled));
  }

  function updateNavToggle() {
    const label = el("navLookup");
    label.classList.toggle("kuku-ready", navReady);
    label.classList.toggle("kuku-unavailable", !navReady);
    label.setAttribute("aria-pressed", String(navReady));
  }

  if (typeof navigator !== "undefined" && navigator.mediaDevices) {
    el("voiceButton").addEventListener("click", handleVoiceInput);
  }
  el("webResearch").addEventListener("click", () => {
    if (!webSearchReady) return;
    const active = el("webResearch").classList.toggle("kuku-ready");
    el("webResearch").classList.toggle("kuku-unavailable", !active);
    el("webResearch").title = active
      ? "Web search is enabled for this chat."
      : "Web search is disabled for this chat.";
    el("webResearch").textContent = active
      ? "⌕ Web search enabled"
      : "⌕ Web search not connected";
  });
  el("navLookup").addEventListener("click", () => {
    if (!navReady) return;
    const active = el("navLookup").classList.toggle("kuku-ready");
    el("navLookup").classList.toggle("kuku-unavailable", !active);
    el("navLookup").title = active
      ? "AMFI fund NAV lookup is enabled for the next question."
      : "AMFI fund NAV lookup is disabled for the next question.";
    el("navLookup").textContent = active
      ? "◌ Fund NAV enabled"
      : "◌ Fund NAV not ready";
    el("navLookup").dataset.query = active ? "HDFC Index Fund" : "";
  });

  el("voiceButton").disabled = true;
  el("voiceButton").title = "Voice transcription is not set up in local mode.";
  el("voiceButtonLabel").textContent = "Voice not set up";

  updateWebToggle();
  updateNavToggle();

  document.querySelectorAll(".nav-item[data-view]").forEach((n) =>
    n.addEventListener("click", () => {
      view = n.dataset.view;
      render();
    }),
  );
  el("searchInput").addEventListener("input", (e) => {
    query = e.target.value;
    render();
  });
  el("sortSelect").addEventListener("change", render);
  ["maxPe", "minRoce", "minCap"].forEach((id) =>
    el(id).addEventListener("input", render),
  );
  el("filtersToggle").addEventListener("click", () => {
    el("filterDrawer").hidden = !el("filterDrawer").hidden;
  });
  el("clearFilters").addEventListener("click", () => {
    ["maxPe", "minRoce", "minCap"].forEach((id) => (el(id).value = ""));
    render();
  });
  el("stockRows").addEventListener("click", (e) => {
    const star = e.target.closest("[data-watch]");
    if (star) {
      e.stopPropagation();
      toggleWatch(star.dataset.watch);
      return;
    }
    const tr = e.target.closest("[data-symbol]");
    if (tr) openCompany(tr.dataset.symbol);
  });
  el("watchlistPreview").addEventListener("click", (e) => {
    const row = e.target.closest("[data-open]");
    if (row) openCompany(row.dataset.open);
  });
  el("watchlistLink").onclick = () => {
    view = "watchlist";
    render();
  };
  el("addWatchPrompt").onclick = () => {
    view = "screener";
    query = "";
    el("searchInput").value = "";
    render();
    el("searchInput").focus();
  };
  el("showAllBtn").onclick = () => {
    view = "screener";
    query = "";
    el("searchInput").value = "";
    render();
  };
  el("tipAction").onclick = () => {
    const first = filteredStocks()[0];
    if (first) openCompany(first.symbol);
  };
  el("newScreenBtn").onclick = () => {
    view = "screener";
    el("filterDrawer").hidden = false;
    render();
    el("maxPe").focus();
  };
  el("importSide").onclick = openImport;
  el("loadSampleBtn").onclick = () => {
    stocks = SAMPLE.map((x) => ({ ...x }));
    imported = false;
    watch = new Set(
      [...watch].filter((s) => stocks.some((x) => x.symbol === s)),
    );
    persist();
    render();
    el("importMessage").className = "import-message success";
    el("importMessage").textContent = "Sample dataset restored.";
    setTimeout(() => el("importDialog").close(), 700);
  };
  el("exportSide").onclick = exportResults;
  el("csvFile").addEventListener("change", (e) =>
    handleFile(e.target.files[0]),
  );
  el("cancelImport").onclick = () => el("importDialog").close();
  el("importClose").onclick = () => el("importDialog").close();
  el("dialogClose").onclick = () => el("companyDialog").close();
  el("portfolioImportBtn").onclick = openPortfolioImport;
  el("emptyPortfolioImport").onclick = openPortfolioImport;
  el("portfolioImportClose").onclick = () =>
    el("portfolioImportDialog").close();
  el("portfolioCancelImport").onclick = () =>
    el("portfolioImportDialog").close();
  el("portfolioCsvFile").addEventListener("change", (e) =>
    handlePortfolioFile(e.target.files[0]),
  );
  el("portfolioExportBtn").onclick = exportPortfolio;
  el("researchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = el("researchName").value.trim();
    const symbol = el("researchSymbol").value.trim().toUpperCase();
    const type = el("researchType").value;
    if (!name) return;
    research.unshift({ name, symbol, type, addedAt: new Date().toISOString() });
    try {
      localStorage.setItem(STORAGE.research, JSON.stringify(research));
    } catch {}
    el("researchForm").reset();
    renderResearch();
  });
  el("researchRows").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-research]");
    if (!btn) return;
    research.splice(Number(btn.dataset.removeResearch), 1);
    try {
      localStorage.setItem(STORAGE.research, JSON.stringify(research));
    } catch {}
    renderResearch();
  });
  el("clearKuku").onclick = () => {
    kukuHistory = [];
    renderKuku();
    el("kukuInput").focus();
  };
  el("kukuForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = el("kukuInput");
    const question = input.value.trim();
    if (!question) return;
    input.value = "";
    sendKuku(question);
  });
  el("kukuMessages").addEventListener("click", (e) => {
    const suggestion = e.target.closest("[data-prompt]");
    if (suggestion) {
      el("kukuInput").value = suggestion.dataset.prompt;
      el("kukuInput").focus();
    }
  });
  el("voiceButton").disabled = true;
  el("voiceButton").title = "Voice transcription is not set up in local mode.";
  el("voiceButtonLabel").textContent = "Voice not set up";
  document.querySelector(".note-close").onclick = () =>
    document.querySelector(".data-note").remove();
  const drop = el("csvFile").closest(".file-drop");
  drop.addEventListener("dragover", (e) => {
    e.preventDefault();
    drop.style.background = "#f1f7ee";
  });
  drop.addEventListener("dragleave", () => (drop.style.background = ""));
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.style.background = "";
    handleFile(e.dataTransfer.files[0]);
  });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      el("searchInput").focus();
    }
  });
  render();
  refreshKukuStatus();
})();
async function fetchFundNavLookup(query, options = {}) {
  const search = typeof query === "string" ? query.trim() : "";
  if (!search) {
    throw new Error(
      "Enter a mutual-fund name or scheme code to look up the latest NAV.",
    );
  }
  const response = await fetch("/api/fund-nav", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: search }),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(
      result.error || "Could not fetch the latest mutual-fund NAV.",
    );
  return result.result || result;
}

async function handleResearchNavLookup() {
  const fundName =
    el("researchName").value.trim() || el("researchSymbol").value.trim();
  if (!fundName) {
    el("researchNavStatus").textContent =
      "Enter a fund name or scheme code first.";
    el("researchNavStatus").className = "nav-lookup-status error";
    return;
  }
  el("researchNavStatus").textContent = "Looking up AMFI NAV…";
  el("researchNavStatus").className = "nav-lookup-status";
  try {
    const nav = await fetchFundNavLookup(fundName);
    const value = Number(nav.nav);
    const asOf = nav.asOf || "N/A";
    const source = nav.source || "AMFI daily NAV data";
    const url = nav.sourceUrl || "https://www.amfiindia.com";
    el("researchNavStatus").innerHTML =
      `Latest NAV: ₹${Number.isFinite(value) ? value.toFixed(2) : "—"} · As of ${escapeHtml(asOf)} · <a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(source)}</a>`;
    el("researchNavStatus").className = "nav-lookup-status success";
  } catch (error) {
    el("researchNavStatus").textContent =
      error.message || "Could not fetch the mutual-fund NAV.";
    el("researchNavStatus").className = "nav-lookup-status error";
  }
}

el("researchNavLookup").addEventListener("click", handleResearchNavLookup);

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseCsvText(text) {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (!rows.length) return [];
  const parsed = rows.map(parseCsvLine);
  const headers = parsed[0].map((cell) =>
    cell.toLowerCase().replace(/\s+/g, ""),
  );
  return parsed
    .slice(1)
    .filter((row) => row.some((cell) => cell && cell !== ""))
    .map((row) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = row[index] ?? "";
      });
      return record;
    });
}

function openImport() {
  el("csvFile").value = "";
  el("importDialog").showModal();
}

function openPortfolioImport() {
  el("portfolioCsvFile").value = "";
  el("portfolioImportDialog").showModal();
}

function handleFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const rows = parseCsvText(String(reader.result || ""));
      if (!rows.length) throw new Error("The CSV is empty.");
      const mapped = rows
        .map((row) => ({
          symbol: String(row.symbol || row.Symbol || "")
            .trim()
            .toUpperCase(),
          name: String(row.name || row.Name || row.company || "").trim(),
          sector: String(row.sector || row.Sector || "").trim() || "Unknown",
          price: Number(row.price || row.Price || 0),
          marketCap: Number(
            row.marketcap || row.marketCap || row["market cap"] || 0,
          ),
          pe: Number(row.pe || row.PE || 0),
          roce: Number(row.roce || row.ROCE || 0),
          roe: Number(row.roe || row.ROE || 0),
          salesGrowth: Number(
            row.salesgrowth || row.salesGrowth || row["sales growth"] || 0,
          ),
          profitGrowth: Number(
            row.profitgrowth || row.profitGrowth || row["profit growth"] || 0,
          ),
          debtToEquity: Number(
            row.debttoequity || row.debtToEquity || row["debt to equity"] || 0,
          ),
          description: String(
            row.description || row.Description || "Imported from CSV.",
          ).trim(),
        }))
        .filter((item) => item.symbol && item.name);
      if (!mapped.length)
        throw new Error("No valid company rows were found in the CSV.");
      stocks = mapped;
      imported = true;
      persist();
      render();
      el("importMessage").className = "import-message success";
      el("importMessage").textContent =
        `Loaded ${mapped.length} companies from ${file.name}.`;
      setTimeout(() => el("importDialog").close(), 800);
    } catch (error) {
      el("importMessage").className = "import-message error";
      el("importMessage").textContent =
        error.message || "Could not read the CSV file.";
    }
  };
  reader.onerror = () => {
    el("importMessage").className = "import-message error";
    el("importMessage").textContent =
      "The browser could not read that CSV file.";
  };
  reader.readAsText(file);
}

function exportResults() {
  const rows = [
    [
      "symbol",
      "name",
      "sector",
      "price",
      "marketCap",
      "pe",
      "roce",
      "roe",
      "salesGrowth",
      "profitGrowth",
      "debtToEquity",
    ],
    ...stocks.map((item) => [
      item.symbol,
      item.name,
      item.sector || "",
      item.price,
      item.marketCap,
      item.pe,
      item.roce,
      item.roe,
      item.salesGrowth,
      item.profitGrowth,
      item.debtToEquity,
    ]),
  ];
  const csv = rows
    .map((row) =>
      row
        .map((value) => '"' + String(value ?? "").replace(/"/g, '""') + '"')
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "stocky-export.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function toggleWatch(symbol) {
  if (!symbol) return;
  if (watch.has(symbol)) {
    watch.delete(symbol);
  } else {
    watch.add(symbol);
  }
  persist();
  render();
}

function openCompany(symbol) {
  const stock = stocks.find((item) => item.symbol === symbol);
  if (!stock) return;
  const detail = el("companyDetail");
  detail.innerHTML = `
      <div class="company-detail-header">
        ${badge(stock, "company-detail-logo")}
        <div>
          <div class="eyebrow">${escapeHtml(stock.sector || "Company")}</div>
          <h2>${escapeHtml(stock.name)}</h2>
          <p>${escapeHtml(stock.symbol)}</p>
        </div>
      </div>
      <div class="company-metrics">
        <div><span>Price</span><strong>₹${fmt(stock.price, 2)}</strong></div>
        <div><span>Market cap</span><strong>₹${fmt(stock.marketCap / 10000000, 2)} Cr</strong></div>
        <div><span>P/E</span><strong>${fmt(stock.pe, 2)}</strong></div>
        <div><span>ROCE</span><strong>${fmt(stock.roce, 1)}%</strong></div>
        <div><span>ROE</span><strong>${fmt(stock.roe, 1)}%</strong></div>
        <div><span>Sales growth</span><strong>${fmt(stock.salesGrowth, 1)}%</strong></div>
      </div>
      <p class="company-description">${escapeHtml(stock.description || "No summary available for this company.")}</p>
    `;
  el("companyDialog").showModal();
}

function handlePortfolioFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const rows = parseCsvText(String(reader.result || ""));
      if (!rows.length) throw new Error("The portfolio CSV is empty.");
      const mapped = rows
        .map((row) => ({
          symbol: String(row.symbol || row.Symbol || "")
            .trim()
            .toUpperCase(),
          name: String(row.name || row.Name || "").trim(),
          type: String(row.type || row.Type || "Stock").trim(),
          units: Number(
            row.units || row.Units || row.quantity || row.Quantity || 0,
          ),
          averageCost: Number(
            row.averagecost || row.averageCost || row["avg cost"] || 0,
          ),
          currentPrice: Number(
            row.currentprice ||
              row.currentPrice ||
              row["current price"] ||
              row.nav ||
              row.NAV ||
              0,
          ),
          value: Number(
            row.value || row.Value || row.marketvalue || row.marketValue || 0,
          ),
          invested: Number(
            row.invested ||
              row.Invested ||
              row.investment ||
              row.investmentValue ||
              0,
          ),
          asOfDate: String(
            row.asofdate || row.asOfDate || row["as of date"] || "",
          ).trim(),
          isin: String(row.isin || row.ISIN || "").trim(),
          importedAt: new Date().toISOString(),
        }))
        .filter((item) => item.symbol && item.name);
      if (!mapped.length)
        throw new Error("No valid positions were found in the portfolio CSV.");
      portfolio = mapped;
      try {
        localStorage.setItem(STORAGE.portfolio, JSON.stringify(portfolio));
      } catch {}
      render();
      el("portfolioImportMessage").className = "import-message success";
      el("portfolioImportMessage").textContent =
        `Imported ${mapped.length} positions.`;
      setTimeout(() => el("portfolioImportDialog").close(), 700);
    } catch (error) {
      el("portfolioImportMessage").className = "import-message error";
      el("portfolioImportMessage").textContent =
        error.message || "Could not read the portfolio CSV.";
    }
  };
  reader.onerror = () => {
    el("portfolioImportMessage").className = "import-message error";
    el("portfolioImportMessage").textContent =
      "The browser could not read that portfolio file.";
  };
  reader.readAsText(file);
}

function exportPortfolio() {
  const rows = [
    [
      "symbol",
      "name",
      "type",
      "units",
      "averageCost",
      "currentPrice",
      "value",
      "invested",
      "asOfDate",
      "isin",
    ],
    ...portfolio.map((item) => [
      item.symbol,
      item.name,
      item.type,
      item.units,
      item.averageCost,
      item.currentPrice,
      item.value,
      item.invested,
      item.asOfDate || "",
      item.isin || "",
    ]),
  ];
  const csv = rows
    .map((row) =>
      row
        .map((value) => '"' + String(value ?? "").replace(/"/g, '""') + '"')
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "stocky-portfolio.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
