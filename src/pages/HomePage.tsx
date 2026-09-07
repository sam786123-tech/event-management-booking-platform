import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  CalendarCheck,
  Ticket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Star,
  Quote,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { supabase } from '@/lib/supabase';
import type { EventRow } from '@/lib/types';

export default function HomePage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .limit(6)
      .then(({ data, error }) => {
        if (!error && data) setEvents(data as EventRow[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />

      {/* ====== HERO SECTION ====== */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-ink-50 to-ink-50" />
          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
          <div className="absolute -left-32 top-60 h-80 w-80 rounded-full bg-accent-200/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(14,16,23,0.02)_100%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              <Sparkles className="h-4 w-4" />
              Over 12,000 events curated monthly
            </div>

            <h1 className="animate-fade-up font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-950 text-balance sm:text-5xl lg:text-6xl" style={{ animationDelay: '0.05s' }}>
              Discover & book events that
              <span className="gradient-text"> inspire</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-500 text-balance" style={{ animationDelay: '0.1s' }}>
              From music festivals to tech conferences, find and book tickets for the
              experiences that matter — all in one elegant platform.
            </p>

            {/* Search bar */}
            <div className="mx-auto mt-10 flex max-w-2xl animate-fade-up items-center gap-2 rounded-2xl border border-ink-200 bg-white p-2 shadow-lg shadow-ink-900/5" style={{ animationDelay: '0.15s' }}>
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search events, venues, or cities..."
                  className="w-full border-0 bg-transparent py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
                />
              </div>
              <button className="btn-primary rounded-xl">
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-14 grid max-w-2xl animate-fade-up grid-cols-3 gap-8" style={{ animationDelay: '0.2s' }}>
              {[
                { value: '12K+', label: 'Events Listed' },
                { value: '850K', label: 'Tickets Sold' },
                { value: '4.9', label: 'User Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl font-bold text-ink-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURED EVENTS SECTION ====== */}
      <section id="events" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending Now
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
                Featured Events
              </h2>
              <p className="mt-3 text-ink-500">Handpicked experiences you won't want to miss</p>
            </div>
            <Link to="/register" className="btn-secondary whitespace-nowrap">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-[420px] animate-pulse bg-ink-100" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => (
                <div key={event.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <EventCard event={event} onBook={() => {}} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====== HOW IT WORKS SECTION ====== */}
      <section id="how-it-works" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
              <CalendarCheck className="h-3.5 w-3.5" />
              Simple Process
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
              How Eventra Works
            </h2>
            <p className="mt-3 text-ink-500">
              Three simple steps from discovery to your next unforgettable experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Search,
                step: '01',
                title: 'Discover Events',
                description: 'Browse thousands of curated events across music, tech, arts, and more. Filter by category, date, or city to find your perfect match.',
                color: 'bg-brand-600',
              },
              {
                icon: Ticket,
                step: '02',
                title: 'Book Instantly',
                description: 'Secure your spot with a single click. Get instant confirmation, digital tickets, and real-time updates delivered to your dashboard.',
                color: 'bg-accent-500',
              },
              {
                icon: ShieldCheck,
                step: '03',
                title: 'Enjoy & Manage',
                description: 'Track all your bookings in one place. Get reminders, manage cancellations, and access your event history anytime, anywhere.',
                color: 'bg-ink-900',
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="group relative animate-fade-up rounded-2xl border border-ink-100 bg-ink-50/50 p-8 transition-all duration-300 hover:border-brand-200 hover:bg-white hover:shadow-lg hover:shadow-ink-900/5"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} shadow-lg`}>
                    <item.icon className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                  <span className="font-display text-4xl font-bold text-ink-200 transition-colors group-hover:text-brand-200">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-ink-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section id="cta" className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-ink-950" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_50%,rgba(34,178,116,0.15),transparent_50%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.08),transparent_50%)]" />

        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400">
                <Sparkles className="h-4 w-4" />
                For Event Organizers
              </div>
              <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl text-balance">
                Host your event and reach <span className="gradient-text">thousands</span> of attendees
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-400">
                List your event on Eventra and tap into a growing community of experience seekers.
                Powerful tools for ticketing, analytics, and attendee management — all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary">
                  Start Hosting
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#" className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800">
                  Learn More
                </a>
              </div>
            </div>

            {/* Testimonial card */}
            <div className="rounded-3xl border border-ink-800 bg-ink-900/50 p-8 backdrop-blur-sm">
              <Quote className="h-10 w-10 text-brand-500/40" />
              <p className="mt-4 text-lg leading-relaxed text-ink-200">
                "Eventra transformed how we manage our tech conference. The platform handled
                3,000+ ticket sales seamlessly, and the dashboard gave us real-time insights
                we never had before."
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold text-white">
                  SK
                </div>
                <div>
                  <p className="font-semibold text-white">Sarah Kessler</p>
                  <p className="text-sm text-ink-400">Event Director, TechConf SF</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
