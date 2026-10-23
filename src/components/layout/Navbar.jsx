'use client';

import { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { useRouter, usePathname } from 'next/navigation';
import { Users, Layers, Shield, Sparkles, LogIn, UserPlus, LogOut, User, FolderKanban, Sliders } from 'lucide-react';

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
      backgroundColor: 'var(--bg-card)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(8px)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Brand Logo & Name */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              TeamSync <span style={{ color: 'var(--accent)' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Build Better Teams. Create Better Projects.
            </div>
          </div>
        </a>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a
            href="/projects"
            style={{
              fontSize: '0.925rem',
              fontWeight: pathname.startsWith('/projects') ? '600' : '500',
              color: pathname.startsWith('/projects') ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FolderKanban size={17} />
            Projects
          </a>

          <a
            href="/projects/proj-teamsync/matches"
            style={{
              fontSize: '0.925rem',
              fontWeight: pathname.includes('/matches') ? '600' : '500',
              color: pathname.includes('/matches') ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sliders size={17} />
            Team Simulator
          </a>

          <a
            href="/teams/team-alpha"
            style={{
              fontSize: '0.925rem',
              fontWeight: pathname.startsWith('/teams') ? '600' : '500',
              color: pathname.startsWith('/teams') ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={17} />
            Workspace
          </a>

          {user && (
            <a
              href="/dashboard"
              style={{
                fontSize: '0.925rem',
                fontWeight: pathname === '/dashboard' ? '600' : '500',
                color: pathname === '/dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Layers size={17} />
              Dashboard
            </a>
          )}
        </nav>

        {/* Auth Actions / Profile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!loading && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <a
                href="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                }}
              >
                <User size={16} color="var(--primary)" />
                <span>{user.name.split(' ')[0]}</span>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                  {user.role}
                </span>
              </a>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                title="Log Out"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : !loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a href="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                <LogIn size={16} />
                <span>Log In</span>
              </a>
              <a href="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                <UserPlus size={16} />
                <span>Get Started</span>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
