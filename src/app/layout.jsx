import '../styles/globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const metadata = {
  title: 'TeamSync AI — Student Project Team Formation & Contribution Intelligence',
  description: 'Build Better Teams. Create Better Projects. Explainable algorithmic team formation, skill-gap analysis, Kanban workspace, and evidence-backed contribution analytics for academic projects.',
  keywords: 'team formation, capstone project, student collaboration, skill matching, contribution intelligence, academic teams',
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
