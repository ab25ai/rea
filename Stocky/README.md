# Stocky

Stocky is a local personal company research and screening dashboard. It is an independent prototype inspired by the stock screening workflow at Screener.in. It is not affiliated with Screener.in.

## Start

Double-click **Start Stocky.bat**, then open [http://127.0.0.1:4173](http://127.0.0.1:4173) in your browser. Keep the command window open while using Stocky; press `Ctrl+C` there to stop the local server. The launcher uses the Node.js runtime already installed with the parent REA checkout, or falls back to Python if that runtime is absent.

## Use your own fundamentals

Choose **Import CSV** in the sidebar. Required columns are `symbol`, `name`, `price`, `marketCap`, `pe`, `roce`, and `roe`. Optional columns are `sector`, `salesGrowth`, `profitGrowth`, `debtToEquity`, and `description`. Market capitalization is in ₹ crore. Percentages are plain numbers such as `18.5` for 18.5%.

The included sample companies and figures are fictional and illustrative. Stocky has no live quote or financial data feed. Imported rows and your watchlist are saved in this browser's local storage on this device; no account or upload is involved. Export downloads the rows currently visible after search and filters.

## Track your portfolio

Open **Portfolio** and import a CSV with `symbol`, `name`, and `type` (`Stock`, `ETF`, or `Mutual fund`), plus `units`, `averageCost`, and `currentPrice` (NAV for funds). You may provide `marketValue` instead of units and current price, and include `isin`, `sector`, and `asOfDate` when available. Stocky calculates value and unrealised gains from the figures in the imported file; it does not refresh prices. Use the included `sample-portfolio.csv` to see the format. Portfolio data is separate from the fictional screener dataset and is stored locally in this browser.

Paytm Money currently describes its portfolio holding, transaction, and realised-gains statements as PDF statements requested by email. Stocky does not yet parse those PDFs or connect to Paytm Money. Its Open API is a trading API that also supports order execution, so Stocky does not store Paytm credentials or request a password/OTP. If you want a Paytm-specific importer, share a copy of a statement with account identifiers and personal details removed; a sample is enough to map its format.

## Research on demand

Use **Research list** to save a stock, ETF, or mutual fund to revisit. Stocky itself does not fetch live news, quotes, or fund factsheets. To request a current research summary, ask about the investment in the Codex chat and include a ticker or fund name if you know it.

## Kuku chat

Kuku uses your local Ollama service and the gpt-oss:20b model by default. No OpenAI API key or API billing is needed. Keep the Ollama app running, then start Stocky. Questions and holdings that you explicitly include are sent to Ollama at 127.0.0.1 on this computer. Chat history stays in page memory and is not saved by Stocky.

To use a different installed model, set KUKU_MODEL in Stocky/.env.local. Kuku currently runs without web search or voice transcription, so it cannot verify current news, live quotes, or current NAVs. Its answers are generated from the model's training and any portfolio data you choose to include; verify current facts independently. Kuku is a research aid, not a SEBI-registered investment adviser. It does not give personalized buy/hold/sell instructions or place trades.

## Scope

The first version includes company search, fundamental filters, sorting, company detail cards, a local watchlist, portfolio snapshots, a research list, Kuku web research and voice input, CSV import and export, and responsive desktop/mobile layouts. It does not place trades.
