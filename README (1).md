# 📊 Sales Dashboard

> A clean, real-time sales analytics dashboard that turns raw Supabase data into KPIs, charts, and rep leaderboards — at a glance.
---

## 📖 Overview

**Sales Dashboard** is a lightweight, single-page web app that gives sales teams an instant snapshot of business performance for any chosen day.

Instead of digging through spreadsheets or a database console, a sales manager (or any stakeholder) picks a **report date**, and the dashboard pulls together **today's numbers, month-to-date totals, comparisons with the previous month, per-representative performance, and monthly trends** — all in one screen.

It's built for:
- 📈 **Sales managers** who need a fast daily/monthly performance snapshot
- 🧑‍💻 **Developers** looking for a minimal, dependency-free example of a Supabase-powered analytics UI
- 🎓 **Recruiters/reviewers** evaluating clean, well-structured vanilla front-end code

No frameworks, no build tools, no bundlers — just HTML, CSS, and JavaScript talking directly to a Supabase Postgres function.

---

## ✨ Features

- 🗓️ **Date-based reporting** — select any date and reload the entire dashboard for that day
- ⚡ **Auto-load on page open** — dashboard fetches data automatically for the default date without a manual click
- 💳 **KPI cards** — Today's Revenue & Sales, Month-to-Date Revenue & Sales, Previous Month (same day) comparison, and Previous Month totals
- 📊 **Sales-by-Representative bar chart** — month-to-date sales volume per rep, rendered with Chart.js
- 📈 **Monthly sales trend line chart** — sales volume across the months of the year
- 🏆 **Sales representative leaderboard** — a sortable-by-data table ranking reps by MTD sales, MTD revenue, today's sales, and today's revenue
- 🔒 **XSS-safe rendering** — leaderboard rows are built with a manual HTML-escaping helper before being injected into the DOM
- 🇮🇳 **Localized currency formatting** — revenue displayed in Indian Rupees (`₹`) using `Intl`-based `toLocaleString`
- 🚦 **Live status indicator** — a pulsing "Live Dashboard" badge in the navbar
- 🧯 **Graceful error handling** — failed requests show a user-facing alert while logging details to the console
- 🔁 **Button loading state** — the "Load Dashboard" button disables and shows "Loading..." while a fetch is in progress
- 📱 **Fully responsive layout** — grid layouts collapse gracefully across desktop, tablet, and mobile breakpoints

---

## 🖼️ Screenshots


### Dashboard Overview
![Dasboard](image.png)

### KPI Cards & Charts
![KPI and Charts](image-1.png)

### Sales Representative Leaderboard
![Leaderboard](image-2.png)


---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Markup** | HTML5 | Semantic page structure (`nav`, `main`, `header`, `section`, `article`, `footer`) |
| **Styling** | CSS3 (Custom Properties, Flexbox, Grid) | Theming via CSS variables, responsive layout |
| **Font** | [Google Fonts – Inter](https://fonts.google.com/specimen/Inter) | Typography, loaded via `<link>` with `preconnect` |
| **Scripting** | Vanilla JavaScript (ES6+, `async/await`, Fetch API) | Data fetching, DOM updates, chart rendering |
| **Charting** | [Chart.js](https://www.chartjs.org/) (via CDN) | Bar chart (sales by rep) & line chart (monthly trend) |
| **Backend / Database** | [Supabase](https://supabase.com/) (PostgreSQL) | Hosts the `get_sales_dashboard` RPC function that computes all dashboard metrics |
| **API Layer** | Supabase REST/RPC endpoint | Single POST endpoint returning all dashboard data as JSON |
| **Hosting** | Static file hosting (any) | No server-side runtime required |

---

## 📂 Project Structure

```
sc-sales-dashboard/
├── index.html      # Page markup — navbar, KPI cards, chart canvases, leaderboard table
├── style.css       # Styling — CSS variables, grid/flex layouts, responsive breakpoints
└── script.js       # App logic — Supabase fetch, chart rendering, DOM updates, formatting helpers
```

This is intentionally a **flat, dependency-free structure** — there is no `package.json`, bundler config, or backend server code in the project; everything runs directly in the browser.

---

## ⚙️ How It Works

1. **Page load** — `index.html` loads `style.css`, the Inter font, the Chart.js CDN script, and finally `script.js`.
2. **Auto-fetch on load** — a `DOMContentLoaded` listener immediately calls `loadDashboard()` using the date pre-filled in the `#reportDate` input.
3. **User-triggered reload** — clicking **"Load Dashboard"** re-runs the same function using whatever date is currently selected.
4. **Fetching data** — `loadDashboard()` sends a `POST` request to the Supabase RPC endpoint with the selected `report_date`, disabling the button and showing a "Loading..." state while the request is in flight.
5. **Parsing the response** — the first object in the returned array is destructured into four metric groups: `kpi_metrics`, `daily_metrics`, `month_metrics`, and `sales_rep_metrics`.
6. **Rendering KPIs** — `updateKPICards()` writes today's/MTD/previous-month figures into the KPI card `<strong>` elements, formatting numbers and currency along the way.
7. **Rendering charts** — `updateDailyChart()` and `updateMonthlyChart()` destroy any existing Chart.js instance (to avoid duplicate canvases on reload) and render a fresh bar chart and line chart respectively.
8. **Rendering the leaderboard** — `updateLeaderboard()` clears the table body and rebuilds one row per sales representative, escaping text content to prevent HTML injection.
9. **Error path** — if the request fails or returns no data, the user sees an alert while the full error is logged to the browser console for debugging.

---

## 🔌 API Integration

| Aspect | Details |
|---|---|
| **Backend** | Supabase (PostgreSQL + auto-generated REST/RPC layer) — no custom backend server exists in this repo |
| **Database** | A Supabase Postgres database exposing a single stored procedure |
| **API Endpoint** | `POST {SUPABASE_URL}/rest/v1/rpc/get_sales_dashboard` |
| **Request Body** | `{ "report_date": "YYYY-MM-DD" }` |
| **Response Shape** | Array with one object containing `kpi_metrics`, `daily_metrics`, `month_metrics`, and `sales_rep_metrics` sub-arrays |
| **Data Flow** | Browser → `fetch()` → Supabase RPC → Postgres function computes aggregates → JSON returned → charts/table/KPIs rendered client-side |
| **Authentication** | Requests are authenticated using a Supabase **publishable (anon) API key** sent via the `apikey` header. There is no user login, session, or role-based access implemented in the front end — access control (if any) is expected to be enforced by Supabase Row Level Security policies on the database side |

> ⚠️ No other endpoints, third-party APIs, or backend services are used — the entire data layer is this one RPC call.

---


## 🧩 Dashboard Components

| Component | Description |
|---|---|
| **Navbar** | Brand logo, product name, and a "Live Dashboard" status badge |
| **Dashboard Header** | Page title, short description, and the date filter (date picker + "Load Dashboard" button) |
| **KPI Grid** | Four cards — Today, Month to Date, Previous Month (same day), and Previous Month (total) — each showing sales count and revenue |
| **Sales by Representative Chart** | Bar chart showing each rep's month-to-date sales volume |
| **Monthly Sales Chart** | Line chart showing sales volume trend across the months of the year |
| **Leaderboard Table** | Per-representative breakdown of MTD sales, MTD revenue, today's sales, and today's revenue |
| **Footer** | Product attribution and a "Data powered by Supabase" note |

---

## 📱 Responsive Design

Responsiveness is handled entirely with **CSS Grid/Flexbox and three media query breakpoints**, no separate mobile layout or JS-based resizing:

- **`≤ 1100px`** — KPI grid collapses from 4 columns to 2
- **`≤ 850px`** — header switches to a stacked (column) layout; charts grid collapses to a single column
- **`≤ 600px`** — navbar padding tightens and the status badge is hidden; the date filter, inputs, and button stretch to full width; KPI grid becomes single-column; chart containers shrink in height; the leaderboard's "Ranked by MTD sales" label is hidden to save space

Chart canvases also use Chart.js's `responsive: true` and `maintainAspectRatio: false` options so charts resize fluidly with their containers.

---

## ⚡ Performance Optimizations

- **Chart instance cleanup** — existing `Chart.js` instances are explicitly `.destroy()`-ed before re-rendering, preventing memory leaks and duplicate canvases on repeated date changes
- **Minimal dependencies** — no framework or bundler overhead; only Chart.js is loaded, via CDN
- **Font preconnect** — `<link rel="preconnect">` hints for Google Fonts domains reduce font-loading latency
- **Disabled-button guard** — the "Load Dashboard" button is disabled while a request is in-flight, preventing duplicate/overlapping fetches
- **Single network round-trip** — one RPC call returns all KPI, chart, and leaderboard data together, instead of separate requests per widget

---



## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

<p align="center">⭐ If you found this project useful, consider giving it a star!</p>
