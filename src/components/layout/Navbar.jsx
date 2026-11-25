'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Users,
  FolderKanban,
  SlidersHorizontal,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Compass,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border-light)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(10px)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Brand Logo & Name */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
          }}>
            <Compass size={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              TeamSync
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Academic
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a
            href="/projects"
            style={{
              fontSize: '0.875rem',
              fontWeight: pathname.startsWith('/projects') && !pathname.includes('/matches') ? '600' : '500',
              color: pathname.startsWith('/projects') && !pathname.includes('/matches') ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color var(--transition-fast)',
            }}
          >
            <FolderKanban size={16} />
            Projects
          </a>

          <a
            href="/projects/proj-teamsync/matches"
            style={{
              fontSize: '0.875rem',
              fontWeight: pathname.includes('/matches') ? '600' : '500',
              color: pathname.includes('/matches') ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color var(--transition-fast)',
            }}
          >
            <SlidersHorizontal size={16} />
            Match Simulator
          </a>

          <a
            href="/teams/team-alpha"
            style={{
              fontSize: '0.875rem',
              fontWeight: pathname.startsWith('/teams') ? '600' : '500',
              color: pathname.startsWith('/teams') ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Users size={16} />
            Team Workspace
          </a>

          {user && (
            <a
              href="/dashboard"
              style={{
                fontSize: '0.875rem',
                fontWeight: pathname === '/dashboard' ? '600' : '500',
                color: pathname === '/dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color var(--transition-fast)',
              }}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </a>
          )}
        </nav>

        {/* Auth Actions / Profile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!loading && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a
                href="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  fontSize: '0.85rem',
                }}
              >
                <User size={15} color="var(--primary)" />
                <span>{user.name.split(' ')[0]}</span>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                  {user.role}
                </span>
              </a>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.825rem' }}
                title="Log Out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : !loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a href="/login" className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: '0.85rem' }}>
                <LogIn size={15} />
                <span>Sign In</span>
              </a>
              <a href="/register" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
                <UserPlus size={15} />
                <span>Join Now</span>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
