// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

// Paste the API URL you used in Postman
const SUPABASE_URL = "https://bmwamubjpwsyibzekzoo.supabase.co/";

// Paste your publishable key
const SUPABASE_KEY = "sb_publishable_Nt97rsVnD2M5uKxcPJrZGA_ss-wTuUO";


// ==========================================
// ELEMENTS
// ==========================================

const reportDateInput = document.getElementById("reportDate");
const loadDashboardButton = document.getElementById("loadDashboard");

let dailyChart = null;
let monthlyChart = null;


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    const reportDate = reportDateInput.value;

    if (!reportDate) {
        alert("Please select a report date.");
        return;
    }

    loadDashboardButton.disabled = true;
    loadDashboardButton.textContent = "Loading...";

    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/get_sales_dashboard`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY
                },

                body: JSON.stringify({
                    report_date: reportDate
                })
            }
        );


        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }


        const result = await response.json();

        console.log("Dashboard API response:", result);


        if (!result || result.length === 0) {
            throw new Error("No dashboard data returned.");
        }


        const dashboardData = result[0];

        updateKPICards(dashboardData.kpi_metrics);
        updateDailyChart(dashboardData.daily_metrics);
        updateMonthlyChart(dashboardData.month_metrics);
        updateLeaderboard(dashboardData.sales_rep_metrics);

    }

    catch (error) {

        console.error("Dashboard error:", error);

        alert(
            "Could not load dashboard data. Check the browser console for details."
        );

    }

    finally {

        loadDashboardButton.disabled = false;
        loadDashboardButton.textContent = "Load Dashboard";

    }
}


// ==========================================
// KPI CARDS
// ==========================================

function updateKPICards(kpiMetrics) {

    if (!kpiMetrics || kpiMetrics.length === 0) {
        return;
    }

    const kpi = kpiMetrics[0];


    document.getElementById("todaySales").textContent =
        formatNumber(kpi.today_sales);


    document.getElementById("todayRevenue").textContent =
        formatCurrency(kpi.today_revenue);


    document.getElementById("mtdSales").textContent =
        formatNumber(kpi.month_sales);


    document.getElementById("mtdRevenue").textContent =
        formatCurrency(kpi.month_revenue);


    document.getElementById("previousSameDaySales").textContent =
        formatNumber(kpi.previous_same_day);


    document.getElementById("previousSameDayRevenue").textContent =
        formatCurrency(kpi.previous_mon_same_day_rev);


    document.getElementById("previousMonthSales").textContent =
        formatNumber(kpi.previous_sales);


    document.getElementById("previousMonthRevenue").textContent =
        formatCurrency(kpi.previous_revenue);
}


// ==========================================
// DAILY SUMMARY CHART
// ==========================================

function updateDailyChart(dailyMetrics) {

    if (!dailyMetrics) {
        return;
    }


    const labels = dailyMetrics.map(item =>
        item.sales_rep.trim()
    );


    const sales = dailyMetrics.map(item =>
        item.no_of_sales
    );


    const ctx = document
        .getElementById("dailyChart")
        .getContext("2d");


    if (dailyChart) {
        dailyChart.destroy();
    }


    dailyChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [
                {
                    label: "Sales",
                    data: sales,
                    borderWidth: 1,
                    borderRadius: 5
                }
            ]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {
                    beginAtZero: true
                }

            }
        }

    });
}


// ==========================================
// MONTHLY SUMMARY CHART
// ==========================================

function updateMonthlyChart(monthMetrics) {

    if (!monthMetrics) {
        return;
    }


    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];


    const labels = monthMetrics.map(item =>
        `${monthNames[item.month - 1]} ${item.year}`
    );


    const sales = monthMetrics.map(item =>
        item.no_of_sales
    );


    const ctx = document
        .getElementById("monthlyChart")
        .getContext("2d");


    if (monthlyChart) {
        monthlyChart.destroy();
    }


    monthlyChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [
                {
                    label: "Sales",
                    data: sales,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }
            ]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {
                    beginAtZero: true
                }

            }
        }

    });
}


// ==========================================
// SALES REP LEADERBOARD
// ==========================================

function updateLeaderboard(salesRepMetrics) {

    const leaderboardBody =
        document.getElementById("leaderboardBody");


    leaderboardBody.innerHTML = "";


    if (!salesRepMetrics) {
        return;
    }


    salesRepMetrics.forEach(rep => {

        const row = document.createElement("tr");


        row.innerHTML = `
            <td>${escapeHTML(rep.sales_rep.trim())}</td>

            <td>
                ${formatNumber(rep.mtd_sales)}
            </td>

            <td>
                ${formatCurrency(rep.mtd_revenue)}
            </td>

            <td>
                ${formatNumber(rep.tdy_sales)}
            </td>

            <td>
                ${formatCurrency(rep.tdy_revenue)}
            </td>
        `;


        leaderboardBody.appendChild(row);

    });
}


// ==========================================
// FORMAT NUMBERS
// ==========================================

function formatNumber(value) {

    if (value === null || value === undefined) {
        return "0";
    }

    return Number(value).toLocaleString();
}


// ==========================================
// FORMAT REVENUE
// ==========================================

function formatCurrency(value) {

    if (value === null || value === undefined) {
        return "₹0";
    }


    return "₹" + Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}


// ==========================================
// BASIC HTML ESCAPING
// ==========================================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ==========================================
// EVENTS
// ==========================================

loadDashboardButton.addEventListener(
    "click",
    loadDashboard
);


// Automatically load May 17, 2026 when page opens
document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);