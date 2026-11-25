'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  Lock,
  Mail,
  User,
  Compass,
  AlertCircle,
  Building,
  GraduationCap,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [academicYear, setAcademicYear] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          department,
          academicYear: Number(academicYear),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      router.push('/profile');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 0 100px 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
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
            Create student profile
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Find compatible teammates and join capstone projects
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

        <div className="card" style={{ padding: '26px' }}>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-primary)' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Taylor"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-primary)' }}>
                University Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-primary)' }}>
                Password (min 6 characters)
              </label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-primary)' }}>
                  Department
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Information Tech">Information Tech</option>
                  <option value="Software Eng">Software Eng</option>
                  <option value="Electrical Eng">Electrical Eng</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-primary)' }}>
                  Academic Year
                </label>
                <select
                  value={academicYear}
                  onChange={e => setAcademicYear(Number(e.target.value))}
                >
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', marginTop: '6px' }}
            >
              <UserPlus size={15} />
              <span>{loading ? 'Creating profile...' : 'Create Account'}</span>
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already registered?{' '}
          <a href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
