// File: src/pages/admin/ChartAdmin.jsx
import React, { useEffect } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
  BarElement,
  BarController,
  PieController,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
  BarElement,
  BarController,
  PieController,
  Tooltip,
  Legend,
  Filler
);

// Palette (có thể đổi theo brand của bạn)
const PALETTE = {
  primary: "#0d6efd",
  success: "#198754",
  warning: "#ffc107",
  danger: "#dc3545",
  info: "#0dcaf0",
  purple: "#6f42c1",
  pink: "#d63384",
};

export default function ChartAdmin() {
  useEffect(() => {
    const area = document.getElementById("myAreaChart");
    const bar = document.getElementById("myBarChart");
    const pie = document.getElementById("myPieChart");

    let areaChart, barChart, pieChart;

    // AREA (line) — có gradient + màu viền
    if (area) {
      const ctx = area.getContext("2d");
      const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        area.clientHeight || 300
      );
      gradient.addColorStop(0, "rgba(13,110,253,0.35)"); // primary 35%
      gradient.addColorStop(1, "rgba(13,110,253,0.00)"); // transparent

      areaChart = new Chart(area, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Sessions",
              data: [120, 190, 150, 220, 180, 240, 200],
              fill: true,
              tension: 0.4,
              backgroundColor: gradient,
              borderColor: PALETTE.primary,
              borderWidth: 2,
              pointBackgroundColor: "#fff",
              pointBorderColor: PALETTE.primary,
              pointHoverBackgroundColor: PALETTE.primary,
              pointHoverBorderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { usePointStyle: true } },
            title: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.06)" } },
          },
        },
      });
    }

    // BAR — nhiều màu + bo góc
    if (bar) {
      barChart = new Chart(bar, {
        type: "bar",
        data: {
          labels: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"],
          datasets: [
            {
              label: "Count",
              data: [5, 7, 3, 8, 6],
              backgroundColor: [
                PALETTE.primary,
                PALETTE.success,
                PALETTE.warning,
                PALETTE.danger,
                PALETTE.info,
              ],
              borderColor: [
                "#0b5ed7",
                "#157347",
                "#ffca2c",
                "#bb2d3b",
                "#31d2f2",
              ],
              borderWidth: 1,
              borderRadius: 6,
              hoverBackgroundColor: [
                "#3b86ff",
                "#29a76a",
                "#ffd24a",
                "#e2555f",
                "#54dbf5",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
            title: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.06)" } },
          },
        },
      });
    }

    // DOUGHNUT — palette sống động
    if (pie) {
      pieChart = new Chart(pie, {
        type: "doughnut",
        data: {
          labels: ["Direct", "Referral", "Social", "Email", "Ads"],
          datasets: [
            {
              data: [35, 22, 18, 12, 13],
              backgroundColor: [
                PALETTE.primary,
                PALETTE.purple,
                PALETTE.success,
                PALETTE.warning,
                PALETTE.pink,
              ],
              borderColor: "#fff",
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { usePointStyle: true } },
            title: { display: false },
            tooltip: { enabled: true },
          },
          cutout: "60%",
        },
      });
    }

    return () => {
      areaChart?.destroy();
      barChart?.destroy();
      pieChart?.destroy();
    };
  }, []);

  return (
    <div className="container-fluid" id="container-wrapper">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Charts</h1>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="./">Home</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Charts
          </li>
        </ol>
      </div>

      <div className="row">
        {/* Area */}
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Area Chart</h6>
            </div>
            <div className="card-body">
              <div className="chart-area" style={{ height: 300 }}>
                <canvas id="myAreaChart" />
              </div>
            </div>
          </div>
        </div>

        {/* Bar */}
        <div className="col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Bar Chart</h6>
            </div>
            <div className="card-body">
              <div className="chart-bar" style={{ height: 280 }}>
                <canvas id="myBarChart" />
              </div>
            </div>
          </div>
        </div>

        {/* Doughnut */}
        <div className="col-lg-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Donut Chart</h6>
            </div>
            <div className="card-body">
              <div className="chart-pie pt-4" style={{ height: 280 }}>
                <canvas id="myPieChart" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
