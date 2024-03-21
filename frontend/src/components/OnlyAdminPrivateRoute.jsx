import React from "react";
import { useSelector } from "react-redux";
/* to get the component that is wrapped by another component (for example, in our case, <Dashboard/> is wrapped inside <PrivateRoute/>) then we must use Outlet */
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  /* to get the component that is wrapped by another component (for example, in our case, <Dashboard/> is wrapped inside <PrivateRoute/>) then we must use Outlet */
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default OnlyAdminPrivateRoute;
