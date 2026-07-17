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
import CoworkingAdmin from "@/pages/admin/CoworkingAdmin";
import DocumentationAdmin from "@/pages/admin/DocumentationAdmin";
import DocumentsManagement from "@/pages/admin/DocumentsManagement";

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
      <Routes>
        {/* Public routes with Layout (Header + Footer) */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/a-propos" element={<Layout><About /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/services/:slug" element={<Layout><ServiceDetail /></Layout>} />
        <Route path="/solutions" element={<Layout><SolutionsPage /></Layout>} />
        <Route path="/documentation" element={<Layout><Documentation /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
        <Route path="/rendez-vous" element={<Layout><Appointment /></Layout>} />
        <Route path="/co-working" element={<Layout><Coworking /></Layout>} />
        <Route path="/sondages" element={<Layout><Surveys /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />

        {/* Auth routes without Layout */}
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Signup />} />
        <Route path="/super-admin" element={<SuperAdminLogin />} />

        {/* Protected routes with Layout */}
        <Route path="/mon-compte" element={
          <Layout>
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          </Layout>
        } />

        {/* Admin routes WITHOUT Layout (AdminLayout handles everything) */}
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

        <Route path="/admin/coworking" element={
          <ProtectedRoute allowedRoles="admin">
            <CoworkingAdmin />
          </ProtectedRoute>
        } />

        <Route path="/admin/docs" element={
          <ProtectedRoute allowedRoles="admin">
            <DocumentationAdmin />
          </ProtectedRoute>
        } />

        <Route path="/admin/documents" element={
          <ProtectedRoute allowedRoles="admin">
            <DocumentsManagement />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Layout><Home /></Layout>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
