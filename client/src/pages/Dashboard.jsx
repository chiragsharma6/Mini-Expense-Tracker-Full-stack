import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/dashboard/Hero";
import DashboardContent from "../components/dashboard/DashboardContent";

function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />

      <main className="app-shell">
        <Hero
          user={user}
          onLogout={logout}
        />

        <DashboardContent />
      </main>

      <Footer />
    </>
  );
}

export default Dashboard;