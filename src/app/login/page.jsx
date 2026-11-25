'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogIn,
  Lock,
  Mail,
  AlertCircle,
  Compass,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('alex.chen@university.edu');
  const [password, setPassword] = useState('TeamSync2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('TeamSync2026!');
  };

  return (
    <div style={{ padding: '60px 0 100px 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '11px',
            backgroundColor: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '12px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
          }}>
            <Compass size={22} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sign in to your capstone project workspace
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '18px',
            fontSize: '0.85rem',
          }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form Card */}
        <div className="card" style={{ padding: '26px' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-primary)' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Password
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', marginTop: '4px' }}
            >
              <LogIn size={15} />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '18px' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              Quick Evaluation Profiles
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setDemoAccount('alex.chen@university.edu')}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.775rem' }}
              >
                <UserCheck size={14} color="var(--primary)" />
                <span>Alex Chen — Project Lead & Full-Stack</span>
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('sarah.miller@university.edu')}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.775rem' }}
              >
                <UserCheck size={14} color="var(--primary)" />
                <span>Sarah Miller — Data Science & Modeling</span>
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('priya.sharma@university.edu')}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.775rem' }}
              >
                <UserCheck size={14} color="var(--primary)" />
                <span>Priya Sharma — Cloud & Infrastructure</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don&apos;t have an account?{' '}
          <a href="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
}
