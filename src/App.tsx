import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import Services from "@/pages/public/Services";
import ServiceDetail from "@/pages/public/ServiceDetail";
import SolutionsPage from "@/pages/public/Solutions";
import Documentation from "@/pages/public/Documentation";
import Blog from "@/pages/public/Blog";
import BlogPost from "@/pages/public/BlogPost";
import Appointment from "@/pages/public/Appointment";
import Coworking from "@/pages/public/Coworking";
import Surveys from "@/pages/public/Surveys";
import Contact from "@/pages/public/Contact";
import Login from "@/pages/admin/Login";
import Signup from "@/pages/admin/Signup";
import SuperAdminLogin from "@/pages/admin/SuperAdminLogin";
import MyAccount from "@/pages/public/MyAccount";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import BlogAdmin from "@/pages/admin/BlogAdmin";
import BlogEditor from "@/pages/admin/BlogEditor";
import UsersAdmin from "@/pages/admin/UsersAdmin";
import AppointmentsAdmin from "@/pages/admin/AppointmentsAdmin";
import MessagesAdmin from "@/pages/admin/MessagesAdmin";
import Settings from "@/pages/admin/Settings";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/rendez-vous" element={<Appointment />} />
          <Route path="/co-working" element={<Coworking />} />
          <Route path="/sondages" element={<Surveys />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth routes */}
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Signup />} />
          <Route path="/super-admin" element={<SuperAdminLogin />} />

          {/* Protected routes */}
          <Route path="/mon-compte" element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/blog" element={
            <ProtectedRoute allowedRoles="admin">
              <BlogAdmin />
            </ProtectedRoute>
          } />

          <Route path="/admin/blog/new" element={
            <ProtectedRoute allowedRoles="admin">
              <BlogEditor />
            </ProtectedRoute>
          } />

          <Route path="/admin/blog/edit/:id" element={
            <ProtectedRoute allowedRoles="admin">
              <BlogEditor />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles="admin">
              <UsersAdmin />
            </ProtectedRoute>
          } />

          <Route path="/admin/appointments" element={
            <ProtectedRoute allowedRoles="admin">
              <AppointmentsAdmin />
            </ProtectedRoute>
          } />

          <Route path="/admin/messages" element={
            <ProtectedRoute allowedRoles="admin">
              <MessagesAdmin />
            </ProtectedRoute>
          } />

          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles="admin">
              <Settings />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
