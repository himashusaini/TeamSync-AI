'use client';

import { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [disputeNotifications, setDisputeNotifications] = useState(true);
  const [reviewReminders, setReviewReminders] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>Account</span>
            <span>/</span>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Preferences</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Account & Collaboration Settings
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage notification preferences and team communication protocols.
          </p>
        </div>

        {saved && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.9rem',
          }}>
            <CheckCircle2 size={18} />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Notification Controls */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Bell size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Team Notifications</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Deliverable Review Requests</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Get notified when a teammate requests code verification</div>
                </div>
                <input
                  type="checkbox"
                  checked={reviewReminders}
                  onChange={e => setReviewReminders(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Dispute Mediation Alerts</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alerts when a contribution dispute or mediation note is recorded</div>
                </div>
                <input
                  type="checkbox"
                  checked={disputeNotifications}
                  onChange={e => setDisputeNotifications(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Weekly Milestone Summaries</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weekly progress digests sent to your registered university email</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>
            </div>
          </div>

          {/* Security Information */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Shield size={20} color="var(--accent)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Security & Authorization</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Your session is authenticated via HTTP-only cryptographic cookies with HS256 JWT tokens. Sensitive database operations require verified authorization headers.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
