import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import SessionWarning from "@/components/auth/SessionWarning";
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
import LegalNotice from "@/pages/public/LegalNotice";
import PrivacyPolicy from "@/pages/public/PrivacyPolicy";
import NotFound from "@/pages/public/NotFound";

// Espace admin et authentification : chargés à la demande, seulement quand on les ouvre.
// Les visiteurs du site public ne téléchargent plus le code de l'admin.
const Login = lazy(() => import("@/pages/admin/Login"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const AuthCallback = lazy(() => import("@/pages/auth/AuthCallback"));
const MyAccount = lazy(() => import("@/pages/public/MyAccount"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const BlogAdmin = lazy(() => import("@/pages/admin/BlogAdmin"));
const BlogEditor = lazy(() => import("@/pages/admin/BlogEditor"));
const UsersAdmin = lazy(() => import("@/pages/admin/UsersAdmin"));
const AppointmentsAdmin = lazy(() => import("@/pages/admin/AppointmentsAdmin"));
const MessagesAdmin = lazy(() => import("@/pages/admin/MessagesAdmin"));
const SurveysAdmin = lazy(() => import("@/pages/admin/SurveysAdmin"));
const Settings = lazy(() => import("@/pages/admin/Settings"));
const CoworkingAdmin = lazy(() => import("@/pages/admin/CoworkingAdmin"));
const DocumentationAdmin = lazy(() => import("@/pages/admin/DocumentationAdmin"));
const DocumentsManagement = lazy(() => import("@/pages/admin/DocumentsManagement"));
const CMSEditor = lazy(() => import("@/pages/admin/CMSEditor"));
const ServiceImagesAdmin = lazy(() => import("@/pages/admin/ServiceImagesAdmin"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Chargement">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AutoLogoutManager() {
  const [showWarning, setShowWarning] = useState(false);

  const { resetTimer } = useAutoLogout({
    enabled: true,
    onWarning: () => {
      setShowWarning(true);
    },
    onLogout: () => {
      setShowWarning(false);
      // Redirect to home with message
      window.location.href = '/?session_expired=true';
    },
  });

  const handleExtendSession = () => {
    setShowWarning(false);
    resetTimer();
  };

  const handleDismissWarning = () => {
    setShowWarning(false);
  };

  return (
    <SessionWarning
      show={showWarning}
      onDismiss={handleDismissWarning}
      onExtend={handleExtendSession}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AutoLogoutManager />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
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
        <Route path="/demande-service" element={<Layout><Surveys /></Layout>} />
        <Route path="/sondages" element={<Layout><Surveys /></Layout>} /> {/* Redirect ancien lien */}
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/mentions-legales" element={<Layout><LegalNotice /></Layout>} />
        <Route path="/politique-confidentialite" element={<Layout><PrivacyPolicy /></Layout>} />

        {/* Auth routes without Layout */}
        {/* /connexion : entrée de l'espace admin, aucun lien public n'y mène */}
        <Route path="/connexion" element={<Login />} />
        {/* Inscription publique désactivée : les comptes sont créés par un administrateur */}
        <Route path="/inscription" element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

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

        <Route path="/admin/surveys" element={
          <ProtectedRoute allowedRoles="admin">
            <SurveysAdmin />
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


        <Route path="/admin/cms" element={
          <ProtectedRoute allowedRoles="admin">
            <CMSEditor />
          </ProtectedRoute>
        } />

        <Route path="/admin/services" element={
          <ProtectedRoute allowedRoles="admin">
            <ServiceImagesAdmin />
          </ProtectedRoute>
        } />

        {/* 404 - Page not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
