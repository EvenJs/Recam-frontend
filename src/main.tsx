import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/queryClient";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import RoleGuard from "@/components/guards/RoleGuard";
import AdminLayout from "@/components/layout/AdminLayout";
import AgentLayout from "@/components/layout/AgentLayout";

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
            {/* Admin */}
            <Route
              element={<RoleGuard allowedRoles={["PhotographyCompany"]} />}
            >
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/listings/new" element={<CreateListingPage />} />
                <Route
                  path="/listings/:id/edit"
                  element={<EditListingPage />}
                />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route path="/listings/:id/preview" element={<PreviewPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Agent */}
            <Route element={<RoleGuard allowedRoles={["Agent"]} />}>
              <Route element={<AgentLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route path="/listings/:id/preview" element={<PreviewPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
