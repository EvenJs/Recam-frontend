import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/queryClient";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import RoleGuard from "@/components/guards/RoleGuard";
import RootLayout from "@/components/layout/RootLayout";

import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateListingPage from "@/pages/CreateListingPage";
import ListingDetailPage from "@/pages/ListingDetailPage";
import EditListingPage from "@/pages/EditListingPage";
import PreviewPage from "@/pages/PreviewPage";
import AgentsPage from "@/pages/AgentsPage";
import ProfilePage from "@/pages/ProfilePage";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RootLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Admin only */}
              <Route
                element={<RoleGuard allowedRoles={["PhotographyCompany"]} />}
              >
                <Route path="/listings/new" element={<CreateListingPage />} />
                <Route
                  path="/listings/:id/edit"
                  element={<EditListingPage />}
                />
                <Route path="/agents" element={<AgentsPage />} />
              </Route>

              {/* All roles */}
              <Route path="/listings/:id" element={<ListingDetailPage />} />
              <Route path="/listings/:id/preview" element={<PreviewPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
