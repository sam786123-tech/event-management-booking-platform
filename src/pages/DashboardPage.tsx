import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  User as UserIcon,
  MapPin,
  Clock,
  TrendingUp,
  Wallet,
  ArrowRight,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { EventRow, BookingWithEvent } from '@/lib/types';
import { formatPrice, formatDateTime, getMonthAndDay } from '@/lib/format';

type Tab = 'overview' | 'bookings' | 'events' | 'profile';

export default function DashboardPage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [bookingEvent, setBookingEvent] = useState<EventRow | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [editName, setEditName] = useState(profile?.full_name ?? '');
  const [editPhone, setEditPhone] = useState(profile?.phone ?? '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setEditName(profile?.full_name ?? '');
    setEditPhone(profile?.phone ?? '');
  }, [profile]);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoadingBookings(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, events(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setBookings(data as BookingWithEvent[]);
    }
    setLoadingBookings(false);
  }, [user]);

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    if (!error && data) {
      setEvents(data as EventRow[]);
    }
    setLoadingEvents(false);
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchEvents();
  }, [fetchBookings, fetchEvents]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleBookEvent = async () => {
    if (!bookingEvent || !user) return;
    setBookingLoading(true);
    const { error } = await supabase.from('bookings').insert({
      event_id: bookingEvent.id,
      tickets: 1,
      total_price: bookingEvent.price,
    });
    setBookingLoading(false);
    if (error) {
      showToast('error', 'Could not complete booking. Please try again.');
    } else {
      showToast('success', `You're booked for "${bookingEvent.title}"!`);
      setBookingEvent(null);
      fetchBookings();
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
    if (error) {
      showToast('error', 'Could not cancel booking. Please try again.');
    } else {
      showToast('success', 'Booking cancelled successfully.');
      fetchBookings();
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: editName, phone: editPhone })
      .eq('id', user.id);
    setSavingProfile(false);
    if (error) {
      showToast('error', 'Could not save profile changes.');
    } else {
      await refreshProfile();
      showToast('success', 'Profile updated successfully.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const totalSpent = bookings.reduce((sum, b) => sum + Number(b.total_price), 0);
  const upcomingBookings = bookings.filter(
    (b) => b.events && new Date(b.events.event_date) > new Date(),
  );

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Ticket },
    { id: 'events', label: 'Browse Events', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-5 pt-28 pb-16 lg:px-8 lg:pt-32">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink-950">
            Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'}
          </h1>
          <p className="mt-1.5 text-ink-500">Manage your bookings, discover events, and update your profile.</p>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Bookings', value: bookings.length.toString(), icon: Ticket, color: 'bg-brand-600' },
            { label: 'Upcoming Events', value: upcomingBookings.length.toString(), icon: Calendar, color: 'bg-accent-500' },
            { label: 'Total Spent', value: formatPrice(totalSpent), icon: Wallet, color: 'bg-ink-900' },
            { label: 'Member Since', value: profile ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—', icon: Clock, color: 'bg-gold-500' },
          ].map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-500">{stat.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink-900">{stat.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color} shadow-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-ink-100 bg-white p-1 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-ink-600 hover:bg-ink-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in space-y-6">
            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink-900">Upcoming Bookings</h2>
                <button onClick={() => setActiveTab('bookings')} className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700">
                  View all
                </button>
              </div>
              {loadingBookings ? (
                <div className="h-32 animate-pulse rounded-xl bg-ink-100" />
              ) : upcomingBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 py-12 text-center">
                  <Calendar className="h-10 w-10 text-ink-300" />
                  <p className="mt-3 text-sm font-medium text-ink-500">No upcoming events</p>
                  <button onClick={() => setActiveTab('events')} className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700">
                    Browse events
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.slice(0, 3).map((booking) => {
                    if (!booking.events) return null;
                    const { month, day } = getMonthAndDay(booking.events.event_date);
                    return (
                      <div key={booking.id} className="flex items-center gap-4 rounded-xl border border-ink-100 p-3 transition-colors hover:bg-ink-50">
                        <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50">
                          <span className="text-[10px] font-bold text-brand-600">{month}</span>
                          <span className="text-lg font-bold text-ink-900">{day}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-ink-900">{booking.events.title}</p>
                          <p className="flex items-center gap-1.5 text-xs text-ink-500">
                            <MapPin className="h-3 w-3" />
                            {booking.events.venue}, {booking.events.city}
                          </p>
                        </div>
                        <div className="hidden text-right sm:block">
                          <p className="text-sm font-bold text-ink-900">{formatPrice(booking.total_price)}</p>
                          <p className="text-xs text-ink-400">{booking.tickets} ticket{booking.tickets > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink-900">Recommended Events</h2>
                <button onClick={() => setActiveTab('events')} className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700">
                  Browse all
                </button>
              </div>
              {loadingEvents ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-48 animate-pulse rounded-xl bg-ink-100" />
                  <div className="h-48 animate-pulse rounded-xl bg-ink-100" />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {events.slice(0, 2).map((event) => (
                    <EventCard key={event.id} event={event} onBook={setBookingEvent} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="animate-fade-in">
            {loadingBookings ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-28 animate-pulse rounded-xl bg-ink-100" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center">
                <Ticket className="h-12 w-12 text-ink-300" />
                <p className="mt-4 text-lg font-semibold text-ink-700">No bookings yet</p>
                <p className="mt-1 text-sm text-ink-500">Browse events and book your first experience.</p>
                <button onClick={() => setActiveTab('events')} className="btn-primary mt-5">
                  Browse Events
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  if (!booking.events) return null;
                  const { month, day } = getMonthAndDay(booking.events.event_date);
                  const isPast = new Date(booking.events.event_date) < new Date();
                  return (
                    <div key={booking.id} className="card overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-40 sm:h-auto sm:w-48">
                          <img src={booking.events.image_url} alt={booking.events.title} className="h-full w-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent sm:bg-gradient-to-r" />
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="mb-1.5 flex items-center gap-2">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isPast ? 'bg-ink-100 text-ink-500' : 'bg-brand-100 text-brand-700'}`}>
                                  {isPast ? 'Past Event' : 'Confirmed'}
                                </span>
                                <span className="text-xs text-ink-400">Booked on {formatDateTime(booking.created_at)}</span>
                              </div>
                              <h3 className="font-display text-lg font-bold text-ink-900">{booking.events.title}</h3>
                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDateTime(booking.events.event_date)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {booking.events.venue}, {booking.events.city}
                                </span>
                              </div>
                            </div>
                            <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 sm:hidden">
                              <span className="text-[10px] font-bold text-brand-600">{month}</span>
                              <span className="text-lg font-bold text-ink-900">{day}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
                            <div>
                              <p className="text-sm font-bold text-ink-900">{formatPrice(booking.total_price)}</p>
                              <p className="text-xs text-ink-400">{booking.tickets} ticket{booking.tickets > 1 ? 's' : ''}</p>
                            </div>
                            {!isPast && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="animate-fade-in">
            {loadingEvents ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[420px] animate-pulse rounded-2xl bg-ink-100" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} onBook={setBookingEvent} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-fade-in mx-auto max-w-2xl">
            <div className="card p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white shadow-lg">
                  {(profile?.full_name ?? 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-ink-900">{profile?.full_name ?? 'User'}</h2>
                  <p className="text-sm text-ink-500">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="label-text">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Email Address</label>
                  <input
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                    className="input-field cursor-not-allowed bg-ink-50 text-ink-400"
                  />
                </div>
                <div>
                  <label className="label-text">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-primary flex-1">
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={handleSignOut} className="btn-secondary">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Booking modal */}
      {bookingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm animate-fade-in" onClick={() => setBookingEvent(null)} />
          <div className="relative w-full max-w-md animate-scale-in overflow-hidden rounded-2xl bg-white shadow-2xl">
            <button onClick={() => setBookingEvent(null)} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-white/80 text-ink-500 backdrop-blur transition-colors hover:bg-white hover:text-ink-900">
              <X className="h-5 w-5" />
            </button>
            <div className="h-40 overflow-hidden">
              <img src={bookingEvent.image_url} alt={bookingEvent.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold text-ink-900">{bookingEvent.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{formatDateTime(bookingEvent.event_date)}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                <MapPin className="h-3.5 w-3.5" />
                {bookingEvent.venue}, {bookingEvent.city}
              </p>

              <div className="mt-5 rounded-xl bg-ink-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-500">1 General Admission Ticket</span>
                  <span className="font-bold text-ink-900">{formatPrice(bookingEvent.price)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-ink-200 pt-3">
                  <span className="font-semibold text-ink-700">Total</span>
                  <span className="font-display text-xl font-bold text-ink-900">{formatPrice(bookingEvent.price)}</span>
                </div>
              </div>

              <button onClick={handleBookEvent} disabled={bookingLoading} className="btn-primary mt-5 w-full py-3.5">
                {bookingLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </span>
                ) : (
                  <>Confirm Booking</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-up">
          <div className={`flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-xl ${
            toast.type === 'success' ? 'bg-brand-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
