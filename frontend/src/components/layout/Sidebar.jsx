import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Loader2,
  UserCircle,
  Settings,
  HelpCircle,
  Users,
  Shield,
  ChevronDown,
  X,
  Package,
  FolderOpen,
  Layers,
  Receipt,
  Truck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../contexts/ModalContext';
import Logo from '../../common/Logo';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { showSuccess, showError, showWarning, showLoading, closeLoading } = useModal();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    userManagement: false,
    productManagement: false,
    transactionManagement: false,
  });

  // ✅ Auto-open submenu jika user berada di halaman yang termasuk submenu
  useEffect(() => {
    const isUserPage = location.pathname === '/users';
    const isRolePage = location.pathname === '/roles';
    const isCategoryPage = location.pathname === '/categories';
    const isProductTypePage = location.pathname === '/product-types';
    const isProductPage = location.pathname === '/products';
    const isSupplierPage = location.pathname === '/suppliers';

    if (isUserPage || isRolePage) {
      setOpenMenus(prev => ({ ...prev, userManagement: true }));
    }

    if (isCategoryPage || isProductTypePage || isProductPage) {
      setOpenMenus(prev => ({ ...prev, productManagement: true }));
    }

    if (isSupplierPage) {
      setOpenMenus(prev => ({ ...prev, transactionManagement: true }));
    }
  }, [location.pathname]);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-indigo-400',
      path: '/dashboard',
    },
  ];

  const userManagementMenu = {
    id: 'userManagement',
    label: 'Manajemen User',
    icon: Users,
    color: 'text-emerald-400',
    subItems: [
      {
        id: 'users',
        label: 'User',
        icon: Users,
        path: '/users',
        color: 'text-emerald-400',
      },
      {
        id: 'roles',
        label: 'Role',
        icon: Shield,
        path: '/roles',
        color: 'text-purple-400',
      },
    ],
  };

  const productManagementMenu = {
    id: 'productManagement',
    label: 'Manajemen Produk',
    icon: Package,
    color: 'text-blue-400',
    subItems: [
      {
        id: 'categories',
        label: 'Kategori',
        icon: FolderOpen,
        path: '/categories',
        color: 'text-blue-400',
      },
      {
        id: 'productTypes',
        label: 'Jenis Produk',
        icon: Layers,
        path: '/product-types',
        color: 'text-cyan-400',
      },
      {
        id: 'products',
        label: 'Produk',
        icon: Package,
        path: '/products',
        color: 'text-indigo-400',
      },
    ],
  };

  // ✅ NEW: Manajemen Transaksi
  const transactionManagementMenu = {
    id: 'transactionManagement',
    label: 'Manajemen Transaksi',
    icon: Receipt,
    color: 'text-amber-400',
    subItems: [
      {
        id: 'suppliers',
        label: 'Supplier',
        icon: Truck,
        path: '/suppliers',
        color: 'text-amber-400',
      },
      // Nanti tambahkan:
      // {
      //   id: 'transactions',
      //   label: 'Transaksi',
      //   icon: Receipt,
      //   path: '/transactions',
      //   color: 'text-orange-400',
      // },
    ],
  };

  const footerMenu = [
    {
      id: 'profile',
      label: 'Profile',
      icon: UserCircle,
      color: 'text-slate-400',
      path: '/profile',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-slate-400',
      path: '/settings',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    showWarning(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari aplikasi?',
      async () => {
        try {
          setIsLoggingOut(true);
          showLoading('Logging out...', 'Mohon tunggu sebentar');

          await logout();

          closeLoading();
          showSuccess('Logout Berhasil', 'Anda telah keluar dari aplikasi.');

          setTimeout(() => {
            navigate('/login');
          }, 500);
        } catch {
          closeLoading();
          showError('Logout Gagal', 'Terjadi kesalahan, namun Anda akan diarahkan ke halaman login.');

          setTimeout(() => {
            navigate('/login');
          }, 1000);
        } finally {
          setIsLoggingOut(false);
        }
      },
      () => {},
      'Ya, Keluar',
      'Batal'
    );
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const toggleSubmenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (subItems) => {
    return subItems?.some(item => location.pathname === item.path);
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const isIconOnly = isCollapsed && !isMobileOpen;

    return (
      <button
        key={item.id}
        onClick={() => handleNavigation(item.path)}
        className={`
          w-full flex items-center rounded-xl transition-colors duration-200 group
          ${isIconOnly ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'}
          ${active
            ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30'
            : 'hover:bg-slate-700/50'
          }
        `}
        title={isIconOnly ? item.label : ''}
      >
        <Icon
          className={`w-5 h-5 shrink-0 ${active ? 'text-white' : item.color} group-hover:text-white transition-colors duration-200`}
        />
        {!isIconOnly && (
          <>
            <span
              className={`font-medium ${active ? 'text-white' : 'text-slate-300'} whitespace-nowrap`}
            >
              {item.label}
            </span>
            {active && (
              <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse-slow"></div>
            )}
          </>
        )}
      </button>
    );
  };

  const renderSubmenuItem = (item) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <button
        key={item.id}
        onClick={() => handleNavigation(item.path)}
        className={`
          w-full flex items-center rounded-xl transition-colors duration-200 group
          gap-3 px-4 py-2 pl-11
          ${active
            ? 'bg-indigo-600/50 shadow-lg shadow-indigo-500/20'
            : 'hover:bg-slate-700/50'
          }
        `}
      >
        <Icon
          className={`w-4 h-4 shrink-0 ${active ? 'text-white' : item.color || 'text-slate-400'} group-hover:text-white transition-colors duration-200`}
        />
        <span
          className={`text-sm ${active ? 'text-white' : 'text-slate-300'} whitespace-nowrap`}
        >
          {item.label}
        </span>
        {active && (
          <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse-slow"></div>
        )}
      </button>
    );
  };

  const renderMenuWithSubmenu = (menu) => {
    const Icon = menu.icon;
    const isOpen = openMenus[menu.id];
    const isParentActiveFlag = isParentActive(menu.subItems);
    const showFull = !isCollapsed || isMobileOpen;

    return (
      <div key={menu.id} className="w-full">
        <button
          onClick={() => showFull && toggleSubmenu(menu.id)}
          className={`
            w-full flex items-center rounded-xl transition-colors duration-200 group
            ${showFull ? 'gap-3 px-4 py-3' : 'justify-center px-2 py-3'}
            ${isParentActiveFlag ? 'bg-indigo-600/30' : 'hover:bg-slate-700/50'}
          `}
          title={!showFull ? menu.label : ''}
        >
          <Icon
            className={`w-5 h-5 shrink-0 ${isParentActiveFlag ? 'text-indigo-400' : menu.color} group-hover:text-white transition-colors duration-200`}
          />
          {showFull && (
            <>
              <span
                className={`font-medium flex-1 text-left ${isParentActiveFlag ? 'text-indigo-400' : 'text-slate-300'} whitespace-nowrap`}
              >
                {menu.label}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </>
          )}
        </button>

        {showFull && isOpen && (
          <div className="mt-1 ml-2 space-y-1 animate-fadeIn">
            {menu.subItems.map((subItem) => renderSubmenuItem(subItem))}
          </div>
        )}
      </div>
    );
  };

  const isIconOnly = isCollapsed && !isMobileOpen;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-indigo-600 text-white p-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-200"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-fadeIn"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          sidebar-aside
          fixed lg:static z-40 bg-linear-to-b from-slate-900 to-slate-800 text-white shadow-2xl
          flex flex-col h-full border-r border-slate-700/50
          ${isIconOnly ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:z-auto
        `}
      >
        {/* Logo Section */}
        <div className={`p-6 border-b border-slate-700/50 ${isIconOnly ? 'px-4' : ''}`}>
          {isIconOnly ? (
            <div className="flex justify-center">
              <Logo showText={false} size="sm" />
            </div>
          ) : (
            <Logo showText={true} size="md" />
          )}
        </div>

        {/* Toggle Button (Desktop Only) */}
        {!isMobileOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all duration-200 hidden lg:flex items-center justify-center z-50"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 sidebar-scroll">
          {/* Menu Header */}
          {!isIconOnly && (
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 animate-fadeIn">
              Menu Utama
            </p>
          )}

          {/* Dashboard Menu */}
          {menuItems.map(item => renderMenuItem(item))}

          {/* Separator */}
          <div className="my-4 border-t border-slate-700/50"></div>

          {/* User Management Menu */}
          {renderMenuWithSubmenu(userManagementMenu)}

          {/* Product Management Menu */}
          {renderMenuWithSubmenu(productManagementMenu)}

          {/* ✅ NEW: Transaction Management Menu */}
          {renderMenuWithSubmenu(transactionManagementMenu)}

          {/* Separator */}
          <div className="my-4 border-t border-slate-700/50"></div>

          {/* Footer Menu */}
          {!isIconOnly && (
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 animate-fadeIn">
              Pengaturan
            </p>
          )}
          {footerMenu.map(item => renderMenuItem(item))}

          {/* Help */}
          {!isIconOnly && (
            <button
              onClick={() => handleNavigation('/help')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-700/50 transition-colors duration-200 text-slate-400 hover:text-white"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">Bantuan</span>
            </button>
          )}

          {/* Logout Button */}
          <div className="pt-4 mt-4 border-t border-slate-700/50">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`
                w-full flex items-center rounded-xl transition-colors duration-200 group
                ${!isIconOnly ? 'gap-3 px-4 py-3' : 'justify-center px-2 py-3'}
                hover:bg-red-600/20 hover:text-red-400
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              title={isIconOnly ? 'Logout' : ''}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-5 h-5 shrink-0 text-red-400 animate-spin" />
                  {!isIconOnly && (
                    <span className="font-medium text-slate-300 whitespace-nowrap">
                      Logging out...
                    </span>
                  )}
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5 shrink-0 text-red-400 group-hover:scale-110 transition-transform duration-200" />
                  {!isIconOnly && (
                    <span className="font-medium text-slate-300 whitespace-nowrap">
                      Logout
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;