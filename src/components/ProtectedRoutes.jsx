import React from "react";
import { useSelector } from "react-redux";

import { Navigate, Outlet } from "react-router-dom";

export const RequireAuth = function RequireAuth() {
  const currentUser = useSelector((state) => state.currentUser);
  if (!currentUser?.uid) {
    return <Navigate to="/log-in" />;
  }
  return <Outlet />;
};

export const RequireNotAuth = function RequireNotAuth() {
  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser?.uid) {
    return <Navigate to="/profile" />;
  }
  return <Outlet />;
};
