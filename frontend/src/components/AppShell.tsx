'use client';

import clsx from 'clsx';
import {
  BarChart3,
  Bell,
  ChevronDown,
  Home,
  Menu,
  Megaphone,
  PlusCircle,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';

const navigation = [
  {href: '/', label: 'Dashboard', icon: Home},
  {href: '/campaigns', label: 'Campaigns', icon: Megaphone},
  {href: '/campaigns/new', label: 'Create Campaign', icon: PlusCircle},
  {href: '/shopping', label: 'Shopping', icon: ShoppingBag},
  {href: '/analytics', label: 'Analytics', icon: BarChart3},
];

export function AppShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-surface text-ink">
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-white px-4 py-5 transition-transform duration-200 lg:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-white shadow-button">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-4">Perfect Plants SKU</p>
                <p className="text-xs font-medium text-muted">Revenue Engine</p>
              </div>
            </Link>
            <button
              aria-label="Close navigation"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-8 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : item.href === '/campaigns'
                    ? pathname === '/campaigns'
                    : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition',
                    active
                      ? 'bg-brand-soft text-brand'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-ink',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-line pt-4">
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition',
                pathname.startsWith('/settings')
                  ? 'bg-brand-soft text-brand'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-ink',
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            aria-label="Close navigation backdrop"
            className="fixed inset-0 z-30 bg-gray-950/20 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div className="lg:pl-72">
          <header className="sticky top-0 z-20 border-b border-line bg-surface/92 backdrop-blur">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                aria-label="Open navigation"
                className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="relative hidden flex-1 sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  aria-label="Search"
                  className="h-10 w-full max-w-md rounded-xl border border-line bg-white pl-10 pr-4 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                  placeholder="Search campaigns, products, offers"
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  aria-label="Notifications"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-gray-600 transition hover:text-ink"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <button className="hidden h-10 items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink sm:flex">
                  Perfect Plants SKU
                  <ChevronDown className="h-4 w-4 text-muted" />
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </>
  );
}
