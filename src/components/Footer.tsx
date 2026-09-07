import { Link } from 'react-router-dom';
import { CalendarHeart, Mail, MapPin, Phone, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
                <CalendarHeart className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-bold text-white">Eventra</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
              The modern platform for discovering, booking, and managing unforgettable events.
              From intimate gatherings to large-scale festivals, we make every experience seamless.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Facebook, label: 'Facebook' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-800 text-ink-400 transition-all hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Platform</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="/#events" className="text-ink-400 transition-colors hover:text-white">Browse Events</a></li>
              <li><a href="/#how-it-works" className="text-ink-400 transition-colors hover:text-white">How It Works</a></li>
              <li><a href="/#cta" className="text-ink-400 transition-colors hover:text-white">Host an Event</a></li>
              <li><Link to="/dashboard" className="text-ink-400 transition-colors hover:text-white">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#" className="text-ink-400 transition-colors hover:text-white">About Us</a></li>
              <li><a href="#" className="text-ink-400 transition-colors hover:text-white">Careers</a></li>
              <li><a href="#" className="text-ink-400 transition-colors hover:text-white">Press Kit</a></li>
              <li><a href="#" className="text-ink-400 transition-colors hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-ink-400">
                <Mail className="h-4 w-4 text-brand-500" /> hello@eventra.com
              </li>
              <li className="flex items-center gap-2.5 text-ink-400">
                <Phone className="h-4 w-4 text-brand-500" /> +1 (555) 234-7890
              </li>
              <li className="flex items-center gap-2.5 text-ink-400">
                <MapPin className="h-4 w-4 text-brand-500" /> 100 Market St, San Francisco
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-8 text-sm text-ink-500 sm:flex-row">
          <p>&copy; 2026 Eventra. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">Privacy</a>
            <a href="#" className="transition-colors hover:text-white">Terms</a>
            <a href="#" className="transition-colors hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
