import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = (
    <>
      <a href="/#events" className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900">
        Events
      </a>
      <a href="/#how-it-works" className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900">
        How It Works
      </a>
      <a href="/#cta" className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900">
        Host
      </a>
    </>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-sm shadow-ink-900/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-8 lg:flex">{navLinks}</div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-800 shadow-sm transition-all hover:border-ink-300"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700">
                  {(profile?.full_name ?? 'U').charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{profile?.full_name ?? 'My Account'}</span>
                <ChevronDown className="h-4 w-4 text-ink-400" />
              </button>
              {userMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 z-20 w-48 animate-scale-in rounded-xl border border-ink-100 bg-white p-1.5 shadow-xl shadow-ink-900/10">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50"
                    >
                      <LayoutDashboard className="h-4 w-4 text-ink-400" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log In
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-700 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="glass animate-fade-in border-t border-ink-100 px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks}
            <div className="my-2 h-px bg-ink-100" />
            {user ? (
              <>
                <Link to="/dashboard" className="btn-secondary w-full">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn-secondary w-full text-red-600">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary w-full">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary w-full">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
