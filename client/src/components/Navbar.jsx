import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Boxes,
  PlusCircle,
  LogOut,
  ShieldCheck,
  User,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { success } = useToast();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    navigate('/login');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#090d16]/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/products" className="flex items-center gap-3 no-underline group" onClick={closeMobile}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Boxes size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              InventoryHub
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              Smart Warehouse
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            to="/products"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/products'
                ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Boxes size={18} />
            <span>Inventory</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin/products/new"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/admin/products/new'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle size={18} />
              <span>Add Product</span>
            </Link>
          )}
        </nav>

        {/* Right Section: Theme Toggle, User & Logout */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer hover:scale-105"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Color Theme"
          >
            {isDark ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} className="text-slate-600" />}
          </button>

          {user && (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {user.name}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isAdmin ? 'text-violet-600 dark:text-violet-400' : 'text-cyan-600 dark:text-cyan-400'
                  }`}
                >
                  {isAdmin ? (
                    <>
                      <ShieldCheck size={11} /> Admin
                    </>
                  ) : (
                    <>
                      <User size={11} /> Member
                    </>
                  )}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900 transition-all cursor-pointer"
            title="Log out"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-sm flex items-center justify-center">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">{user?.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isAdmin ? 'text-violet-600 dark:text-violet-400' : 'text-cyan-600 dark:text-cyan-400'
                }`}
              >
                {isAdmin ? 'Admin' : 'Member'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              to="/products"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                location.pathname === '/products'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={closeMobile}
            >
              <Boxes size={18} />
              <span>Inventory Catalog</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin/products/new"
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === '/admin/products/new'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={closeMobile}
              >
                <PlusCircle size={18} />
                <span>Create New Product</span>
              </Link>
            )}

            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 mt-1">
              <span className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
                <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
              </span>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center cursor-pointer"
                onClick={toggleTheme}
                title="Toggle Theme"
              >
                {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
              </button>
            </div>

            <button
              onClick={() => {
                closeMobile();
                handleLogout();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 mt-2 cursor-pointer w-full text-left"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
