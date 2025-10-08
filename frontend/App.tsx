import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/clerk-react';

// Public pages
import HomePage from './pages/public/HomePage';
import LearnPage from './pages/public/LearnPage';
import AutomatePage from './pages/public/AutomatePage';
import PricingPage from './pages/public/PricingPage';
import PortfolioPage from './pages/public/PortfolioPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import BlogPage from './pages/public/BlogPage';
import BlogPostPage from './pages/public/BlogPostPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminIdeasPage from './pages/admin/AdminIdeasPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminLMSPage from './pages/admin/AdminLMSPage';
import AdminCRMPage from './pages/admin/AdminCRMPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminPricingPage from './pages/admin/AdminPricingPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const CLERK_PUBLISHABLE_KEY = "pk_test_Z29sZGVuLXN0dXJnZW9uLTMzLmNsZXJrLmFjY291bnRzLmRldiQ";

export default function App() {
  return (
    <div className="dark">
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AppInner />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </ClerkProvider>
    </div>
  );
}

function AppInner() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/automate" element={<AutomatePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/ideas" element={<AdminIdeasPage />} />
      <Route path="/admin/content" element={<AdminContentPage />} />
      <Route path="/admin/lms" element={<AdminLMSPage />} />
      <Route path="/admin/pricing" element={<AdminPricingPage />} />
      <Route path="/admin/projects" element={<AdminProjectsPage />} />
      <Route path="/admin/blog" element={<AdminBlogPage />} />
      <Route path="/admin/contacts" element={<AdminCRMPage />} />
      <Route path="/admin/crm" element={<AdminCRMPage />} />
      <Route path="/admin/settings" element={<AdminSettingsPage />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
