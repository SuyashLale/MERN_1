import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAdminUser } from "../../functions/auth.functions";
import LoadingToRedirect from "./LoadingToRedirect";

const AdminRoute = ({ children, ...rest }) => {
  const [ok, setOk] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    if (user && user.token) {
      getAdminUser(user.token)
        .then((res) => {
          setOk(true);
          console.log("NODE_SERVER_GET_ADMIN_USER_SUCCESS-->", res);
        })
        .catch((err) => {
          setOk(false);
          console.log("NODE_SERVER_GET_ADMIN_USER_FAILURE-->", err);
        });
    }
  }, [user]);
  return ok ? <Route {...rest} /> : <LoadingToRedirect />;
};

export default AdminRoute;
