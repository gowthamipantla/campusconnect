import { Routes, Route, Link } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Button from './components/common/Button';
import SealBadge from './components/common/SealBadge';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateEvent from './pages/admin/CreateEvent';
import EditEvent from './pages/admin/EditEvent';
import EventRegistrants from './pages/admin/EventRegistrants';

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-72px)] bg-ivory text-ink flex flex-col font-body">
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 sm:py-16">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <SealBadge status="open" size="md" />
            <span className="text-xs uppercase tracking-widest font-semibold text-stone">
              University Community Platform
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-tight">
            Connect, Collaborate & <br className="hidden sm:inline" />
            <span className="text-gold">Shape Campus Life</span>
          </h1>

          <p className="text-lg sm:text-xl text-charcoal/80 leading-relaxed max-w-3xl">
            Welcome to CampusConnect, the central hub for university events, student
            organizations, and academic community gatherings. Discover upcoming
            symposiums, hackathons, and social mixers, or manage your student club with
            seamless registration seals and official campus credentials.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link to="/events">
              <Button variant="primary">Explore Events</Button>
            </Link>
            {!user ? (
              <Link to="/signup">
                <Button variant="secondary">Join CampusConnect</Button>
              </Link>
            ) : user.role === 'ADMIN' || user.role === 'CLUB_COORDINATOR' ? (
              <Link to="/admin">
                <Button variant="secondary">Go to Admin Dashboard</Button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <Button variant="secondary">Go to Dashboard</Button>
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-ink flex flex-col">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/new"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/:id/edit"
              element={
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/:id/registrants"
              element={
                <ProtectedRoute>
                  <EventRegistrants />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}