import React, { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { FaBell, FaUserCircle, FaUsers, FaBox, FaDollarSign, FaCar, FaMoon, FaSun } from 'react-icons/fa';
import './DashboardOverview.css';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

const DashboardOverview = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Dummy data for stat cards
  const stats = [
    { icon: <FaUsers />, label: 'Total Users', value: 3256, color: '#6c47ff' },
    { icon: <FaBox />, label: 'Total Orders', value: 394, color: '#3f37c9' },
    { icon: '₹', label: 'Revenue', value: '₹2,536', color: '#f8961e' },
    { icon: <FaCar />, label: 'Available Cars', value: 38, color: '#4cc9f0' },
  ];

  // Dummy chart data
  const barData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Inpatients',
        backgroundColor: '#6c47ff',
        data: [1500, 2000, 1800, 2200, 2100, 2500],
        borderRadius: 8,
      },
      {
        label: 'Outpatients',
        backgroundColor: '#f8961e',
        data: [1000, 1200, 1100, 1400, 1300, 1600],
        borderRadius: 8,
      },
    ],
  };

  const donutData = {
    labels: ['Female', 'Male'],
    datasets: [
      {
        data: [58, 42],
        backgroundColor: ['#f72585', '#4361ee'],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: ['07 am', '08 am', '09 am', '10 am', '11 am', '12 pm'],
    datasets: [
      {
        label: 'Time Admitted',
        data: [50, 113, 80, 120, 90, 130],
        fill: true,
        backgroundColor: 'rgba(108,71,255,0.08)',
        borderColor: '#6c47ff',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6c47ff',
      },
    ],
  };

  // Dummy notifications
  const notifications = [
    { id: 1, text: 'New user registered', time: '2 min ago' },
    { id: 2, text: 'Order #1234 completed', time: '10 min ago' },
    { id: 3, text: 'Server backup successful', time: '1 hr ago' },
  ];

  // Light/Dark mode classes
  const modeClass = darkMode ? 'dashboard-dark' : '';

  return (
    <div className={`dashboard-overview ${modeClass}`}>
      <div className="dashboard-header-row">
        <div className="dashboard-title">Dashboard Overview</div>
        <div className="dashboard-header-actions">
          <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <div className="dashboard-bell">
            <FaBell />
            <span className="dashboard-bell-dot" />
          </div>
          <div className="dashboard-user">
            <FaUserCircle />
          </div>
        </div>
      </div>
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx} style={{ borderTop: `4px solid ${stat.color}` }}>
            <div className="stat-icon" style={{ background: stat.color + '22', color: stat.color }}>{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-widgets-row">
        <div className="dashboard-widget dashboard-bar-chart">
          <div className="widget-title">Inpatients vs. Outpatients</div>
          <Bar data={barData} options={{ plugins: { legend: { display: true } }, responsive: true, maintainAspectRatio: false }} height={220} />
        </div>
        <div className="dashboard-widget dashboard-donut-chart">
          <div className="widget-title">Patients by Gender</div>
          <Doughnut data={donutData} options={{ plugins: { legend: { display: true, position: 'bottom' } }, cutout: '70%' }} height={220} />
        </div>
        <div className="dashboard-widget dashboard-notifications">
          <div className="widget-title">Notifications</div>
          <ul className="notifications-list">
            {notifications.map(n => (
              <li key={n.id}><span className="notif-dot" />{n.text}<span className="notif-time">{n.time}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="dashboard-widgets-row">
        <div className="dashboard-widget dashboard-line-chart">
          <div className="widget-title">Time Admitted</div>
          <Line data={lineData} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }} height={180} />
        </div>
        <div className="dashboard-widget dashboard-calendar">
          <div className="widget-title">Calendar</div>
          <div className="calendar-placeholder">📅 Coming Soon</div>
        </div>
        <div className="dashboard-widget dashboard-quick-actions">
          <div className="widget-title">Quick Actions</div>
          <button className="quick-action-btn">+ Add User</button>
          <button className="quick-action-btn">+ Add Order</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 