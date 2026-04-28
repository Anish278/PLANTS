import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUsers, FaShoppingCart, FaBox, FaList, FaChartLine, FaMoneyBillWave, FaTruck, FaStar, FaCalendarAlt, FaCreditCard, FaWallet, FaPaypal, FaHeart } from 'react-icons/fa';
import { getDashboardStats } from '../../firebase/firestore';
import './AdminDashboard.css';
// Modern icons
import { AiOutlineHome, AiOutlineShopping, AiOutlineUser, AiOutlineTags, AiOutlineBarChart, AiOutlineBell, AiOutlineLogout, AiOutlineAppstore, AiOutlineShoppingCart } from 'react-icons/ai';
// Add Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
    newUsersThisMonth: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRegularProducts: 0,
    totalWishGenieProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0,
    averageRating: 0,
    paymentMethods: {
      card: 0,
      netbanking: 0,
      upi: 0,
      wallet: 0,
      cash: 0,
      other: 0
    },
    orderTrend: { labels: [], data: [] },
    revenueTrend: { labels: [], data: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 300000); // 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for order trend
  const orderChartData = {
    labels: stats.orderTrend?.labels || [],
    datasets: [
      {
        label: 'Number of Orders',
        data: stats.orderTrend?.data || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }
    ]
  };

  // Prepare chart data for revenue trend
  const revenueChartData = {
    labels: stats.revenueTrend?.labels || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: stats.revenueTrend?.data || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4
      }
    ]
  };

  // Prepare chart data for payment methods
  const paymentMethodsData = {
    labels: ['Card', 'Net Banking', 'UPI', 'Wallet', 'Cash', 'Other'],
    datasets: [
      {
        label: 'Payment Methods',
        data: [
          stats.paymentMethods?.card || 0,
          stats.paymentMethods?.netbanking || 0,
          stats.paymentMethods?.upi || 0,
          stats.paymentMethods?.wallet || 0,
          stats.paymentMethods?.cash || 0,
          stats.paymentMethods?.other || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(201, 203, 207, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Prepare chart data for order status
  const orderStatusData = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: 'Order Status',
        data: [
          stats.pendingOrders || 0,
          stats.processingOrders || 0,
          stats.shippedOrders || 0,
          stats.deliveredOrders || 0,
          stats.completedOrders || 0,
          stats.cancelledOrders || 0
        ],
        backgroundColor: [
          '#FFA726', // Pending - Orange
          '#29B6F6', // Processing - Blue
          '#66BB6A', // Shipped - Green
          '#AB47BC', // Delivered - Purple
          '#4CAF50', // Completed - Dark Green
          '#EF5350'  // Cancelled - Red
        ],
        borderWidth: 1
      }
    ]
  };

  if (!user?.isAdmin) {
    return <div>Access Denied</div>;
  }

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo"><AiOutlineAppstore size={28} /></span>
          <span className="sidebar-brand">Admin Panel</span>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineHome /></span>
            <span className="nav-text">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/cart-management" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><FaShoppingCart /></span>
            <span className="nav-text">Cart Management</span>
          </NavLink>
          <NavLink to="wishlist-management" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><FaHeart /></span>
            <span className="nav-text">Wishlist Management</span>
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineShopping /></span>
            <span className="nav-text">Products</span>
          </NavLink>
          <NavLink to="/admin/wish-genie" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineShopping /></span>
            <span className="nav-text">Wish Genie</span>
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineShoppingCart /></span>
            <span className="nav-text">Orders</span>
          </NavLink>
          <NavLink to="/admin/delivery-management" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><FaTruck /></span>
            <span className="nav-text">Delivery Management</span>
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineUser /></span>
            <span className="nav-text">Users</span>
          </NavLink>
          {/* <NavLink to="/admin/categories" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineTags /></span>
            <span className="nav-text">Categories</span>
          </NavLink> */}
          <NavLink to="/admin/analytics" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineBarChart /></span>
            <span className="nav-text">Analytics</span>
          </NavLink>
          <NavLink to="/admin/notifications" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineBell /></span>
            <span className="nav-text">Notifications</span>
          </NavLink>
          <NavLink to="/admin/testimonials" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><FaStar /></span>
            <span className="nav-text">Testimonials</span>
          </NavLink>
          <button onClick={handleLogout} className="nav-item logout">
            <span className="nav-icon"><AiOutlineLogout /></span>
            <span className="nav-text">Logout</span>
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-header-content">
            <h1>Welcome, {user?.displayName || 'Admin'}</h1>
            <button onClick={fetchDashboardData} className="refresh-button">
              Refresh Data
            </button>
          </div>
        </header>
        
        <div className="admin-main-content">
          {window.location.pathname === '/admin' ? (
            <>
              <h2>Dashboard Overview</h2>
              
              {/* Summary Statistics Cards */}
              <div className="stats-summary">
                <div className="summary-card total-revenue">
                  <h3>Total Revenue</h3>
                  <p className="summary-value">₹{stats.totalRevenue.toLocaleString()}</p>
                  <div className="summary-icon"><FaMoneyBillWave /></div>
                </div>
                
                <div className="summary-card total-orders">
                  <h3>Total Orders</h3>
                  <p className="summary-value">{stats.totalOrders}</p>
                  <div className="summary-icon"><FaShoppingCart /></div>
                </div>
                
                <div className="summary-card total-users">
                  <h3>Total Users</h3>
                  <p className="summary-value">{stats.totalUsers}</p>
                  <div className="summary-icon"><FaUsers /></div>
                </div>
                
                <div className="summary-card avg-order">
                  <h3>Avg. Order Value</h3>
                  <p className="summary-value">₹{stats.averageOrderValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                  <div className="summary-icon"><FaChartLine /></div>
                </div>
              </div>
              
              {/* Chart Section */}
              <div className="chart-section">
                <div className="chart-container">
                  <h3>Order Trends (Last 6 Months)</h3>
                  <Line data={orderChartData} options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false
                      },
                    },
                  }} />
                </div>
                
                <div className="chart-container">
                  <h3>Revenue Trends (Last 6 Months)</h3>
                  <Line data={revenueChartData} options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false
                      },
                    },
                  }} />
                </div>
              </div>
              
              {/* Order Status and Payment Methods */}
              <div className="chart-section">
                <div className="chart-container">
                  <h3>Order Status</h3>
                  <Bar data={orderStatusData} options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false
                      },
                      title: {
                        display: false
                      },
                    },
                  }} />
                </div>
                
                <div className="chart-container">
                  <h3>Payment Methods</h3>
                  <Bar data={paymentMethodsData} options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false
                      },
                      title: {
                        display: false
                      },
                    },
                  }} />
                </div>
              </div>
              
              {/* Detailed Stats Grid */}
              <h3>Detailed Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaUsers />
                  </div>
                  <div className="stat-info">
                    <h3>User Statistics</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                    <div className="stat-details">
                      <span>Male: {stats.maleUsers}</span> <br />
                      <span>Female: {stats.femaleUsers}</span> <br />
                      <span>New This Month: {stats.newUsersThisMonth}</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaShoppingCart />
                  </div>
                  <div className="stat-info">
                    <h3>Order Statistics</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                    <div className="stat-details">
                      <span>Pending: {stats.pendingOrders}</span> <br />
                      <span>Processing: {stats.processingOrders}</span> <br />
                      <span>Shipped: {stats.shippedOrders}</span> <br />
                      <span>Delivered: {stats.deliveredOrders}</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaBox />
                  </div>
                  <div className="stat-info">
                    <h3>Product Statistics</h3>
                    <p className="stat-value">{stats.totalProducts}</p>
                    <div className="stat-details">
                      <span>Regular: {stats.totalRegularProducts}</span> <br />
                      <span>Wish Genie: {stats.totalWishGenieProducts}</span> <br />
                      <span>Categories: {stats.totalCategories}</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaMoneyBillWave />
                  </div>
                  <div className="stat-info">
                    <h3>Financial Statistics</h3>
                    <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
                    <div className="stat-details">
                      <span>Avg. Order: ₹{stats.averageOrderValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</span> <br />
                      <span>Completed Orders: {stats.completedOrders}</span> <br />
                      <span>Cancelled Orders: {stats.cancelledOrders}</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaCreditCard />
                  </div>
                  <div className="stat-info">
                    <h3>Payment Methods</h3>
                    <div className="stat-details">
                      <span>Card: {stats.paymentMethods.card}</span> <br />
                      <span>Net Banking: {stats.paymentMethods.netbanking}</span> <br />
                      <span>UPI: {stats.paymentMethods.upi}</span> <br />
                      <span>Wallet: {stats.paymentMethods.wallet}</span> <br />
                      <span>Cash: {stats.paymentMethods.cash}</span> <br />
                      <span>Other: {stats.paymentMethods.other}</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaStar />
                  </div>
                  <div className="stat-info">
                    <h3>Average Rating</h3>
                    <p className="stat-value">{stats.averageRating.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 
