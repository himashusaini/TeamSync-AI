'use client';

import {
  Users,
  Sparkles,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  Award,
  Layers,
  Scale,
  Calendar,
  CheckSquare,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        padding: '80px 0 60px 0',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(67, 56, 202, 0.12), transparent)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '24px',
          }}>
            <Sparkles size={16} />
            <span>Intelligent Team Formation & Contribution Platform</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            fontWeight: '800',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            color: 'var(--text-primary)',
          }}>
            Build Better Teams. <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Create Better Projects.
            </span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '36px',
          }}>
            Say goodbye to random capstone teams and unfair workload disputes.
            TeamSync AI utilizes explainable algorithmic matching to balance skills, availability, and interests—then tracks verified contribution evidence.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '50px' }}>
            <a href="/register" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </a>
            <a href="/projects/proj-teamsync/matches" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}>
              <Sliders size={18} />
              <span>Explore Team Simulator</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            textAlign: 'left',
          }}>
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Core Formula</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', marginTop: '4px' }}>5-Factor Scoring</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Skills, Avail, Roles, Load, Int.</div>
            </div>
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Fairness Engine</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)', marginTop: '4px' }}>Verified Evidence</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Reviews & Dispute resolution</div>
            </div>
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Simulation</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--success)', marginTop: '4px' }}>What-If Sandbox</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Interactive weight tuning</div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section style={{ padding: '70px 0', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <span className="badge badge-accent" style={{ marginBottom: '12px' }}>Real Platform Preview</span>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Designed for High-Performing Student Teams
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.95rem' }}>
              A live preview of the actual TeamSync workspace showing algorithmic recommendations, workload alerts, and verified deliverables.
            </p>
          </div>

          {/* Custom SaaS Dashboard Preview Card */}
          <div style={{
            background: 'var(--bg-page)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-lg)',
            padding: '24px',
            overflow: 'hidden',
          }}>
            {/* Mock Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '18px', borderBottom: '1px solid var(--border-light)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                  Project: TeamSync AI — Active Capstone Team Alpha
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-success">Match Score: 94%</span>
                <span className="badge badge-primary">Sprint 4 Active</span>
              </div>
            </div>

            {/* Dashboard Inner Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Team Synergy Card */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Algorithmic Team Compatibility</span>
                  <Brain size={18} color="var(--primary)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--primary)' }}>94%</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '600' }}>Optimal Synergy</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Skill Coverage (S)</span>
                      <span style={{ fontWeight: '600' }}>96%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '96%', height: '100%', background: 'var(--primary)' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Availability Overlap (A)</span>
                      <span style={{ fontWeight: '600' }}>90% (8 shared hrs/wk)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '90%', height: '100%', background: 'var(--accent)' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Workload Feasibility (W)</span>
                      <span style={{ fontWeight: '600' }}>92%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '92%', height: '100%', background: 'var(--success)' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workload Distribution Card */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Workload Distribution</span>
                  <Scale size={18} color="var(--accent)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>AC</div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Alex Chen</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project Lead & Full-Stack</div>
                      </div>
                    </div>
                    <span className="badge badge-success">25% (Balanced)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent)' }}>MV</div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Marcus Vance</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UI/UX & Frontend</div>
                      </div>
                    </div>
                    <span className="badge badge-success">27% (Balanced)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>PS</div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Priya Sharma</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DevOps & Systems</div>
                      </div>
                    </div>
                    <span className="badge badge-success">24% (Balanced)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent)' }}>DK</div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>David Kim</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Backend & Testing</div>
                      </div>
                    </div>
                    <span className="badge badge-success">24% (Balanced)</span>
                  </div>
                </div>
              </div>

              {/* Verified Contribution Evidence */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Recent Contribution Evidence</span>
                  <Award size={18} color="var(--success)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                      <span>PR #14 Approved</span>
                      <span style={{ color: 'var(--success)' }}>+1.5 pts</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>Verified peer review by Priya Sharma</div>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                      <span>Simulator UI Delivered</span>
                      <span style={{ color: 'var(--success)' }}>+1.4 pts</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>Verified deliverable by Marcus Vance</div>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                      <span>Deliverable Review PR #32</span>
                      <span style={{ color: 'var(--accent)' }}>Under Review</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>Submitted by David Kim (Independent Reviewer Required)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTELLIGENT MATCHING EXPLAINED */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Core Differentiator</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Transparent, Explainable Matching Engine
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '1rem', lineHeight: 1.6 }}>
              No opaque black-box magic. TeamSync AI uses a mathematically sound, 5-factor normalized model where every score has a verifiable explanation.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}>
            <div className="card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <CheckCircle2 size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>40% Skill Coverage (S)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Compares required skills and minimum proficiencies. Identifies missing critical skills, skill redundancy, and peer mentoring opportunities.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Calendar size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>25% Availability (A)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Aggregates 7x24 weekly schedules. Determines common meeting windows and explicitly penalizes unknown or missing schedules.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <TrendingUp size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>15% Project Interest (I)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Aligns project category and description with student passions (AI, IoT, FinTech, Web) for higher engagement.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>10% Role Coverage (R)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Verifies that critical functions—Frontend, Backend, Design, Lead, QA—are filled without duplicate roles.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Scale size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>10% Workload Capacity (W)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Compares project workload requirements against member commitments to prevent mid-semester burnout.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href="/projects/proj-teamsync/matches" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              <span>Try What-If Simulator with Live Candidates</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* CONTRIBUTION FAIRNESS & DISPUTE WORKFLOW */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '14px' }}>Evidence-Based Evaluation</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '18px' }}>
                No More &ldquo;Free-Riders&rdquo; or Undeserved Blame
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
                College evaluations should be based on real project evidence, not subjective opinion or superficial commit counts.
                TeamSync tracks authentic deliverables, peer review sign-offs, and provides a formal dispute resolution channel.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ marginTop: '2px', color: 'var(--primary)' }}><CheckCircle2 size={20} /></div>
                  <div>
                    <h4 style={{ fontWeight: '600', fontSize: '0.95rem' }}>Independent Deliverable Review</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Code submissions require peer approval; author self-approval is strictly prevented by server authorization.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ marginTop: '2px', color: 'var(--accent)' }}><Scale size={20} /></div>
                  <div>
                    <h4 style={{ fontWeight: '600', fontSize: '0.95rem' }}>Formal Dispute Channel</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Students can contest missing credits or unreviewed bottlenecks with recorded resolution notes by team leads or faculty.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ marginTop: '2px', color: 'var(--success)' }}><CheckSquare size={20} /></div>
                  <div>
                    <h4 style={{ fontWeight: '600', fontSize: '0.95rem' }}>Immutable Audit Events</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>All task transitions, deliverable reviews, and member changes generate structured, timestamped audit events.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Visual Box */}
            <div style={{
              background: 'var(--bg-page)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color="var(--primary)" />
                <span>Fairness & Dispute Resolution Life-Cycle</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>Step 1: Event Logged</span>
                    <span className="badge badge-primary">Task / Deliverable</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    User submits deliverable with artifact link and acceptance checklist.
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>Step 2: Peer Review Signed</span>
                    <span className="badge badge-success">Approved (+1.2 pts)</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Independent reviewer validates code against acceptance criteria.
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>Step 3: Dispute Mediation</span>
                    <span className="badge badge-warning">Resolution Recorded</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Unrecorded work can be petitioned and resolved with documented explanations.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a href="/teams/team-alpha/feedback" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.875rem' }}>
                  <span>View Live Dispute & Feedback Workspace</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={{
        padding: '70px 0',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        color: '#ffffff',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '16px' }}>
            Ready to Form Your Capstone Team?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '32px' }}>
            Join 20+ pre-populated students or create your custom profile to test the intelligent matching algorithm right now.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a href="/register" className="btn" style={{
              backgroundColor: '#ffffff',
              color: 'var(--primary)',
              fontWeight: '700',
              padding: '14px 28px',
              borderRadius: 'var(--radius-md)',
            }}>
              <span>Create Student Account</span>
              <ArrowRight size={18} />
            </a>
            <a href="/projects" className="btn" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              padding: '14px 28px',
              borderRadius: 'var(--radius-md)',
            }}>
              <span>Browse Projects</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
