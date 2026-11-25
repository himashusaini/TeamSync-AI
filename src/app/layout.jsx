import '../styles/globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const metadata = {
  title: 'TeamSync — Collaborative Student Project & Capstone Management',
  description: 'Team formation, skill-based matching, Kanban project workspaces, and peer review tracking for university capstone cohorts.',
  keywords: 'team formation, capstone project, student collaboration, skill matching, peer reviews, academic projects',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: '1 0 auto' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
