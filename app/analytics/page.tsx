"use client";

import { useMemo, useState } from "react";

type Metric = {
  icon: string;
  value: string;
  change: string;
  description: string;
};

const monthlyData = [
  { month: "Jan", complaints: 213, closed: 193, sla: 91 },
  { month: "Feb", complaints: 200, closed: 190, sla: 95 },
  { month: "Mar", complaints: 214, closed: 200, sla: 93 },
  { month: "Apr", complaints: 190, closed: 180, sla: 95 },
  { month: "May", complaints: 185, closed: 170, sla: 92 },
];

const financialData = {
  assets: 26.396,
  loans: 16.956,
  deposits: 18.725,
  profitBeforeTax: 0.594,
  profitAfterTax: 0.417,
  costIncome: 43.2,
};

const fraudData = [
  { label: "Transaction anomalies", value: 68 },
  { label: "Account takeover signals", value: 42 },
  { label: "Unusual transfers", value: 56 },
  { label: "Identity concerns", value: 31 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("Jan–May");
  const [showData, setShowData] = useState(true);

  const totals = useMemo(() => {
    const complaints = monthlyData.reduce(
      (sum, item) => sum + item.complaints,
      0
    );

    const closed = monthlyData.reduce(
      (sum, item) => sum + item.closed,
      0
    );

    const open = complaints - closed;

    const closureRate = (closed / complaints) * 100;

    const averageSla =
      monthlyData.reduce((sum, item) => sum + item.sla, 0) /
      monthlyData.length;

    return {
      complaints,
      closed,
      open,
      closureRate,
      averageSla,
    };
  }, []);

  const maxComplaints = Math.max(
    ...monthlyData.map((item) => item.complaints)
  );

  return (
    <main className="analytics-page">
      <div className="analytics-shell">
        <header className="header">
          <div>
            <div className="eyebrow">VINCENT AI V4</div>
            <h1>Insights & Analytics</h1>
            <p>
              Banking intelligence, customer experience, risk and
              management reporting.
            </p>
          </div>

          <div className="header-actions">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Jan–May</option>
              <option>Q1 2026</option>
              <option>H1 2026</option>
              <option>Full Year</option>
            </select>

            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              ← Vincent AI
            </button>
          </div>
        </header>

        <section className="dashboard-banner">
          <div>
            <span className="banner-icon">📊</span>
            <div>
              <strong>Executive Analytics Dashboard</strong>
              <small>
                Period: {period} • Banking & Customer Experience
              </small>
            </div>
          </div>

          <span className="live-badge">● ANALYTICS READY</span>
        </section>

        <section className="kpi-grid">
          <MetricCard
            icon="📋"
            label="Total Complaints"
            value={totals.complaints.toLocaleString()}
            change="Jan–May"
            description="Customer complaints received"
          />

          <MetricCard
            icon="✅"
            label="Closed Cases"
            value={totals.closed.toLocaleString()}
            change={`${totals.closureRate.toFixed(1)}%`}
            description="Overall closure rate"
          />

          <MetricCard
            icon="⏳"
            label="Open Cases"
            value={totals.open.toLocaleString()}
            change="Requires action"
            description="Cases still outstanding"
          />

          <MetricCard
            icon="⏱️"
            label="Average SLA"
            value={`${totals.averageSla.toFixed(1)}%`}
            change="Performance"
            description="Average monthly SLA result"
          />
        </section>

        <section className="content-grid">
          <div className="card large">
            <div className="card-header">
              <div>
                <span className="card-kicker">CUSTOMER EXPERIENCE</span>
                <h2>Complaint Trend</h2>
              </div>

              <span className="status">5 MONTHS</span>
            </div>

            <div className="bar-chart">
              {monthlyData.map((item) => {
                const height =
                  (item.complaints / maxComplaints) * 100;

                return (
                  <div className="bar-column" key={item.month}>
                    <span className="bar-value">
                      {item.complaints}
                    </span>

                    <div className="bar-area">
                      <div
                        className="bar"
                        style={{ height: `${height}%` }}
                        title={`${item.month}: ${item.complaints} complaints`}
                      />
                    </div>

                    <strong>{item.month}</strong>

                    <small>
                      Closed {item.closed}
                    </small>
                  </div>
                );
              })}
            </div>

            <div className="chart-summary">
              <div>
                <strong>{totals.complaints}</strong>
                <span>Total complaints</span>
              </div>

              <div>
                <strong>{totals.closed}</strong>
                <span>Closed</span>
              </div>

              <div>
                <strong>{totals.open}</strong>
                <span>Outstanding</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <span className="card-kicker">SERVICE PERFORMANCE</span>
                <h2>SLA Performance</h2>
              </div>
            </div>

            <div className="sla-list">
              {monthlyData.map((item) => (
                <div className="sla-row" key={item.month}>
                  <div className="sla-title">
                    <strong>{item.month}</strong>
                    <span>{item.sla}%</span>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.sla}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="insight">
              <span>💡</span>
              <div>
                <strong>Vincent insight</strong>
                <p>
                  SLA performance is relatively stable, but management
                  should investigate the months with weaker closure
                  performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <span className="card-kicker">FRAUD & RISK</span>
                <h2>Risk Signal Overview</h2>
              </div>

              <span className="risk-badge">MONITOR</span>
            </div>

            <div className="risk-list">
              {fraudData.map((item) => (
                <div className="risk-row" key={item.label}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.value} signals</span>
                  </div>

                  <div className="risk-meter">
                    <div
                      style={{
                        width: `${Math.min(item.value, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="risk-note">
              ⚠️ These are analytical indicators, not confirmed fraud
              cases. Investigation and human approval remain necessary.
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <span className="card-kicker">FINANCIAL INTELLIGENCE</span>
                <h2>Financial Snapshot</h2>
              </div>

              <span className="status">TZS TRILLION</span>
            </div>

            <div className="financial-grid">
              <FinancialItem
                label="Total Assets"
                value={financialData.assets.toFixed(3)}
              />

              <FinancialItem
                label="Total Loans"
                value={financialData.loans.toFixed(3)}
              />

              <FinancialItem
                label="Customer Deposits"
                value={financialData.deposits.toFixed(3)}
              />

              <FinancialItem
                label="Profit Before Tax"
                value={`${(
                  financialData.profitBeforeTax * 1000
                ).toFixed(0)} B`}
              />

              <FinancialItem
                label="Profit After Tax"
                value={`${(
                  financialData.profitAfterTax * 1000
                ).toFixed(0)} B`}
              />

              <FinancialItem
                label="Cost-to-Income"
                value={`${financialData.costIncome}%`}
              />
            </div>
          </div>
        </section>

        <section className="card report-card">
          <div className="card-header">
            <div>
              <span className="card-kicker">REPORTING CENTRE</span>
              <h2>Management Reports</h2>
              <p>
                Prepare analytical outputs for management review.
              </p>
            </div>
          </div>

          <div className="report-actions">
            <button onClick={() => setShowData(!showData)}>
              📋 {showData ? "Hide Data Table" : "View Data Table"}
            </button>

            <button
              onClick={() =>
                alert(
                  "Excel export module will be connected in the next phase."
                )
              }
            >
              📥 Export to Excel
            </button>

            <button
              onClick={() =>
                alert(
                  "Management report generation will be connected in the next phase."
                )
              }
            >
              📑 Management Report
            </button>

            <button
              onClick={() =>
                alert(
                  "Vincent AI report analysis will be connected in the next phase."
                )
              }
            >
              🧠 Ask Vincent to Analyse
            </button>
          </div>

          {showData && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Complaints</th>
                    <th>Closed</th>
                    <th>Open</th>
                    <th>SLA</th>
                  </tr>
                </thead>

                <tbody>
                  {monthlyData.map((item) => (
                    <tr key={item.month}>
                      <td>{item.month}</td>
                      <td>{item.complaints}</td>
                      <td>{item.closed}</td>
                      <td>{item.complaints - item.closed}</td>
                      <td>{item.sla}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="recommendation">
          <div className="recommendation-icon">🧠</div>

          <div>
            <span>VINCENT AI MANAGEMENT INSIGHT</span>
            <h2>What management should focus on</h2>

            <ul>
              <li>
                Investigate the root causes behind repeated customer
                complaints.
              </li>

              <li>
                Reduce outstanding cases through stronger SLA
                monitoring and escalation.
              </li>

              <li>
                Use fraud indicators for early-warning monitoring,
                followed by human investigation.
              </li>

              <li>
                Combine CX, financial and operational KPIs into one
                management dashboard.
              </li>
            </ul>
          </div>
        </section>

        <footer>
          VINCENT AI V4 • Banking • Finance • Customer Experience •
          Fraud • Risk • Analytics
        </footer>
      </div>

      <style jsx>{`
        .analytics-page {
          min-height: 100vh;
          background: #f3f7fb;
          color: #14243b;
          font-family: Arial, Helvetica, sans-serif;
          padding: 30px 20px 50px;
        }

        .analytics-shell {
          max-width: 1250px;
          margin: auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 25px;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .eyebrow,
        .card-kicker {
          color: #2879e8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        h1 {
          margin: 6px 0;
          font-size: 34px;
        }

        .header p {
          margin: 0;
          color: #71839b;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        select,
        .back-button {
          border: 1px solid #d6e1ee;
          background: white;
          padding: 11px 14px;
          border-radius: 9px;
          font-weight: 700;
          color: #29435f;
          cursor: pointer;
        }

        .dashboard-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border: 1px solid #dbe6f2;
          border-radius: 16px;
          padding: 17px 20px;
          margin-bottom: 18px;
        }

        .dashboard-banner > div {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .banner-icon {
          font-size: 28px;
        }

        .dashboard-banner strong {
          display: block;
        }

        .dashboard-banner small {
          color: #7588a0;
        }

        .live-badge,
        .status,
        .risk-badge {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 7px 10px;
          border-radius: 20px;
          background: #edf5ff;
          color: #2879e8;
        }

        .risk-badge {
          background: #fff5e5;
          color: #9a6810;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 18px;
        }

        .metric {
          background: white;
          border: 1px solid #dbe6f2;
          border-radius: 16px;
          padding: 19px;
        }

        .metric-top {
          display: flex;
          justify-content: space-between;
        }

        .metric-icon {
          font-size: 23px;
        }

        .metric-change {
          font-size: 10px;
          color: #2879e8;
          font-weight: 800;
        }

        .metric-value {
          display: block;
          font-size: 28px;
          font-weight: 800;
          margin: 12px 0 4px;
        }

        .metric-label {
          display: block;
          font-weight: 700;
          font-size: 13px;
        }

        .metric-description {
          display: block;
          color: #8090a5;
          font-size: 11px;
          margin-top: 5px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 18px;
          margin-bottom: 18px;
        }

        .card {
          background: white;
          border: 1px solid #dbe6f2;
          border-radius: 17px;
          padding: 22px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        h2 {
          margin: 5px 0 0;
          font-size: 19px;
        }

        .card-header p {
          color: #788aa0;
          margin-bottom: 0;
        }

        .bar-chart {
          height: 245px;
          display: flex;
          align-items: stretch;
          justify-content: space-around;
          gap: 15px;
          border-bottom: 1px solid #e5edf6;
        }

        .bar-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
        }

        .bar-value {
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .bar-area {
          width: 65%;
          height: 180px;
          display: flex;
          align-items: flex-end;
        }

        .bar {
          width: 100%;
          background: #2879e8;
          border-radius: 7px 7px 0 0;
          min-height: 12px;
        }

        .bar-column strong {
          font-size: 12px;
          margin-top: 8px;
        }

        .bar-column small {
          color: #8291a5;
          font-size: 9px;
          margin-top: 3px;
        }

        .chart-summary {
          display: flex;
          justify-content: space-around;
          text-align: center;
          padding-top: 17px;
        }

        .chart-summary strong {
          display: block;
          font-size: 19px;
        }

        .chart-summary span {
          display: block;
          color: #8190a4;
          font-size: 10px;
          margin-top: 4px;
        }

        .sla-row {
          margin-bottom: 17px;
        }

        .sla-title {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .sla-title span {
          font-weight: 800;
        }

        .progress {
          height: 8px;
          background: #edf2f7;
          border-radius: 20px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #2879e8;
          border-radius: 20px;
        }

        .insight {
          display: flex;
          gap: 10px;
          padding: 13px;
          background: #f5f9fe;
          border-radius: 11px;
          margin-top: 20px;
        }

        .insight p {
          color: #687b92;
          font-size: 11px;
          line-height: 1.5;
          margin: 4px 0 0;
        }

        .risk-row {
          margin-bottom: 18px;
        }

        .risk-row > div:first-child {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
        }

        .risk-row strong {
          font-size: 12px;
        }

        .risk-row span {
          font-size: 10px;
          color: #78899e;
        }

        .risk-meter {
          height: 8px;
          background: #edf2f7;
          border-radius: 20px;
          overflow: hidden;
        }

        .risk-meter div {
          height: 100%;
          background: #e0a22f;
          border-radius: 20px;
        }

        .risk-note {
          padding: 12px;
          background: #fff9ed;
          border: 1px solid #f1dfb8;
          border-radius: 10px;
          color: #7d652d;
          font-size: 10px;
          line-height: 1.5;
        }

        .financial-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .financial-item {
          background: #f6f9fc;
          border-radius: 11px;
          padding: 13px;
        }

        .financial-item span {
          display: block;
          color: #788aa0;
          font-size: 10px;
        }

        .financial-item strong {
          display: block;
          margin-top: 5px;
          font-size: 19px;
        }

        .report-card {
          margin-bottom: 18px;
        }

        .report-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .report-actions button {
          border: 1px solid #d6e1ee;
          background: white;
          padding: 11px 14px;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 700;
          color: #29435f;
        }

        .report-actions button:hover {
          border-color: #2879e8;
        }

        .table-wrapper {
          margin-top: 20px;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        th,
        td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e7edf4;
        }

        th {
          background: #f6f9fc;
          font-size: 10px;
          text-transform: uppercase;
          color: #63768d;
        }

        .recommendation {
          display: flex;
          gap: 18px;
          padding: 24px;
          background: white;
          border: 1px solid #dbe6f2;
          border-radius: 17px;
        }

        .recommendation-icon {
          font-size: 30px;
        }

        .recommendation span {
          color: #2879e8;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .recommendation ul {
          margin-bottom: 0;
          padding-left: 20px;
          color: #64778e;
          font-size: 12px;
          line-height: 1.8;
        }

        footer {
          text-align: center;
          color: #8391a3;
          font-size: 10px;
          margin-top: 25px;
        }

        @media (max-width: 900px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .header {
            flex-direction: column;
          }
        }

        @media (max-width: 600px) {
          .analytics-page {
            padding: 20px 12px;
          }

          .kpi-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-banner {
            align-items: flex-start;
            gap: 10px;
            flex-direction: column;
          }

          .financial-grid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 27px;
          }
        }
      `}</style>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  change,
  description,
}: Metric) {
  return (
    <div className="metric">
      <div className="metric-top">
        <span className="metric-icon">{icon}</span>
        <span className="metric-change">{change}</span>
      </div>

      <strong className="metric-value">{value}</strong>

      <span className="metric-label">{label}</span>

      <span className="metric-description">
        {description}
      </span>
    </div>
  );
}

function FinancialItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="financial-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
