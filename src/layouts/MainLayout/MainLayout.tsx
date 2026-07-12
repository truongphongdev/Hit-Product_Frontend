import { NavLink, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useState } from 'react';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);

  // Determine current page title
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/cameras':
        return 'CCTV Camera Management';
      case '/models':
        return 'AI Model Configuration';
      case '/models-library':
        return 'AI Model Registry Library';
      case '/violations':
        return 'Safety Violations Log';
      case '/reports':
        return 'Analytics & Compliance Reports';
      case '/settings':
        return 'System Settings';
      case '/help':
        return 'Help & Documentation';
      default:
        return 'VisionGuard AI';
    }
  };

  const handleEmergencyAlert = () => {
    setEmergencyAlertActive(true);
    alert('🔴 EMERGENCY SYSTEM ALERT ACTIVATED! Broadcast sent to safety officers.');
    setTimeout(() => setEmergencyAlertActive(false), 5000);
  };

  return (
    <div className={styles.container}>
      {/* Top Header Navbar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.headerTitle}>{getPageTitle(location.pathname)}</h2>
        </div>
        
        <div className={styles.headerRight}>
          {/* Search bar */}
          <div className={styles.searchWrapper}>
            <span className="material-symbols-outlined styles.searchIcon">search</span>
            <input 
              type="text" 
              placeholder="Search cameras, models, logs..." 
              className={styles.searchInput}
            />
          </div>
          
          {/* Notifications */}
          <button className={styles.iconBtn} aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          
          {/* Profile */}
          <button className={styles.iconBtn} aria-label="Profile" onClick={() => navigate('/settings')}>
            <span className="material-symbols-outlined icon-filled">account_circle</span>
          </button>
        </div>
      </header>

      {/* Side Navigation Bar */}
      <nav className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className={styles.logoText}>VisionGuard AI</h1>
          </Link>
          <p className={styles.logoSubText}>🔴 Command Monitoring Active</p>
        </div>

        <ul className={styles.navLinksList}>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/cameras" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className="material-symbols-outlined">videocam</span>
              <span>Cameras</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/models" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className="material-symbols-outlined">psychology</span>
              <span>Active Model</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/models-library" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className="material-symbols-outlined">folder_shared</span>
              <span>Model Library</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/violations" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className="material-symbols-outlined">warning</span>
              <span>Violations</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/reports" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className="material-symbols-outlined">assessment</span>
              <span>Reports</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>

        {/* Emergency Alert Action */}
        <button 
          className={styles.alertBtn} 
          onClick={handleEmergencyAlert}
          style={{ opacity: emergencyAlertActive ? 0.7 : 1 }}
        >
          <span className="material-symbols-outlined">emergency</span>
          <span>Emergency Alert</span>
        </button>

        {/* Sidebar Footer Link list */}
        <div className={styles.sidebarFooter}>
          <NavLink to="/help" className={styles.sidebarFooterItem}>
            <span className="material-symbols-outlined">help</span>
            <span>Help Center</span>
          </NavLink>
          <Link to="/login" className={styles.sidebarFooterItem}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Pane */}
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className={styles.mobileNav}>
        <NavLink to="/" className={({ isActive }) => `${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/cameras" className={({ isActive }) => `${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}>
          <span className="material-symbols-outlined">videocam</span>
          <span>Cameras</span>
        </NavLink>
        <NavLink to="/models" className={({ isActive }) => `${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}>
          <span className="material-symbols-outlined">psychology</span>
          <span>Active AI</span>
        </NavLink>
        <NavLink to="/violations" className={({ isActive }) => `${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}>
          <span className="material-symbols-outlined">warning</span>
          <span>Violations</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}>
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}
