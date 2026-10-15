import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Boxes, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const { register, isAuthenticated } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 2 || name.trim().length > 50) {
      errs.name = 'Name must be between 2 and 50 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters long';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(name, email, password);
      success('Account created successfully! Welcome aboard.');
      navigate('/products', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Registration failed. Please check your details and try again.';
      setGeneralError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#090d16] transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl transition-colors">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <Boxes size={28} />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Join InventoryHub to access the centralized warehouse platform
          </p>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-semibold mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
              <input
                id="reg-name"
                type="text"
                className={`w-full bg-slate-50 dark:bg-slate-800/70 border rounded-xl text-slate-900 dark:text-white text-sm pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${
                  errors.name
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                disabled={submitting}
                autoComplete="name"
              />
            </div>
            {errors.name && <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.name}</span>}
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
              <input
                id="reg-email"
                type="email"
                className={`w-full bg-slate-50 dark:bg-slate-800/70 border rounded-xl text-slate-900 dark:text-white text-sm pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${
                  errors.email
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                disabled={submitting}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.email}</span>}
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className={`w-full bg-slate-50 dark:bg-slate-800/70 border rounded-xl text-slate-900 dark:text-white text-sm pl-11 pr-11 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${
                  errors.password
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                disabled={submitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer p-0.5 focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.password}</span>}
          </div>

          <div>
            <label htmlFor="reg-confirm" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
              <input
                id="reg-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full bg-slate-50 dark:bg-slate-800/70 border rounded-xl text-slate-900 dark:text-white text-sm pl-11 pr-11 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${
                  errors.confirmPassword
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                disabled={submitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer p-0.5 focus:outline-none"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            disabled={submitting}
          >
            <UserPlus size={18} />
            <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
            Sign In <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
