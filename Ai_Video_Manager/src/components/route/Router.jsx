import React, { Suspense } from "react";
import styles from "./Router.module.css";
import { Routes, Route, Navigate } from "react-router-dom";

const Home = React.lazy(() => import("../../pages/Home/Home"));
const Login_page = React.lazy(() => import("../../pages/login_page/Login_page"));
const History_page = React.lazy(() => import("../../pages/history_page/History_page"));
const Save = React.lazy(() => import("../../pages/save/Save"));
const VideoDetails = React.lazy(() => import("../../pages/video_details/VideoDetails"));
const Profile = React.lazy(() => import("../../pages/profile/Profile"));
const Not_found = React.lazy(() => import("../../pages/not_found/Not_found"));

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("user");
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
}

function Router() {
  return (
    <>
      <div className={styles.routeContainer}>
        <Suspense
          fallback={
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p className={styles.loadingText}>Loading Page...</p>
            </div>
          }
        >
          <Routes>
  
            <Route
              path="/"
              element={
                
                  <Home />
                
              }
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login_page />
                </PublicRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History_page />
                </ProtectedRoute>
              }
            />

            <Route
              path="/save"
              element={
                <ProtectedRoute>
                  <Save />
                </ProtectedRoute>
              }
            />

            <Route
              path="/video/:id"
              element={
                <ProtectedRoute>
                  <VideoDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Not_found />} />

            

            
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default Router;
