import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/queryClient";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import RoleGuard from "@/components/guards/RoleGuard";
import AdminLayout from "@/components/layout/AdminLayout";
import RoleBasedLayout from "./components/layout/RoleBasedLayout";

import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateListingPage from "@/pages/CreateListingPage";
import ListingDetailPage from "@/pages/ListingDetailPage";
import EditListingPage from "@/pages/EditListingPage";
import PreviewPage from "@/pages/PreviewPage";
import AgentsPage from "@/pages/AgentsPage";
import ProfilePage from "@/pages/ProfilePage";
import PublicPreviewPage from "@/pages/PublicPreviewPage";

import "./index.css";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/common/ErrorBoundary";

function withErrorBoundary(element: React.ReactElement) {
  return <ErrorBoundary>{element}</ErrorBoundary>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/p/:token" element={<PublicPreviewPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            {/* Admin only */}
            <Route
              element={<RoleGuard allowedRoles={["PhotographyCompany"]} />}
            >
              <Route element={<AdminLayout />}>
                <Route
                  path="/listings/new"
                  element={withErrorBoundary(<CreateListingPage />)}
                />
                <Route
                  path="/listings/:id/edit"
                  element={withErrorBoundary(<EditListingPage />)}
                />
                <Route
                  path="/agents"
                  element={withErrorBoundary(<AgentsPage />)}
                />
              </Route>
            </Route>
            <Route
              path="/listings/:id/preview"
              element={withErrorBoundary(<PreviewPage />)}
            />
            {/* Shared routes — both roles, layout chosen by role */}
            <Route element={<RoleBasedLayout />}>
              <Route
                path="/dashboard"
                element={withErrorBoundary(<DashboardPage />)}
              />
              <Route
                path="/listings/:id"
                element={withErrorBoundary(<ListingDetailPage />)}
              />

              <Route
                path="/profile"
                element={withErrorBoundary(<ProfilePage />)}
              />
            </Route>
          </Route>
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
