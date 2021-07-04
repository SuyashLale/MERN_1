import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { toast } from "react-toastify";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { auth, googleAuthProvider } from "../../firebase";
import UserActionTypes from "../../reducers/user/user-action-types";
import { createOrUpdateUser } from "../../functions/auth.functions";

const Login = ({ history }) => {
  // State will store the email entered. Default value is nothing.
  const [email, setEmail] = useState("suyash.lale1990@gmail.com");
  const [password, setPassword] = useState("111111");
  const [loading, setLoading] = useState(false);

  /*
   * Need to redirect the user away from the Forgot-Password
   * page if they are already logged. Thus, need to check this if
   * the user returned from Firebase changes.
   */
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    let intendedPath = history.location.state;
    if (intendedPath) return;
    if (user && user.token) history.push("/");
  }, [user, history]);

  let dispatch = useDispatch();

  /**
   * Role-Based redirect.
   * Admin      -> Dashboard
   * Subscriber -> Purchase History
   */
  const roleBasedRedirect = (res) => {
    //Check for intended path
    let intendedPath = history.location.state;
    if (intendedPath) {
      history.push(intendedPath.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }
  };

  /* Handle Email/Password sign-in.
   * Sign the user in using the Firebase method
   * Dispatch the Action to redux store to update
   * Redirect the user
   */
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      createOrUpdateUser(idTokenResult.token)
        .then((res) => {
          console.log("NODE_SERVER_CREATE_OR_UPDATE_USER: ", res);
          dispatch({
            type: UserActionTypes.LOGGED_IN_USER,
            payload: {
              email: res.data.email,
              name: res.data.name,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });
          roleBasedRedirect(res);
        })
        .catch((error) => console.log(error.message));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  /* Handle Google sign-in.
   *
   */
  const handleGoogleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            console.log("NODE_SERVER_CREATE_OR_UPDATE_USER: ", res);
            dispatch({
              type: UserActionTypes.LOGGED_IN_USER,
              payload: {
                email: res.data.email,
                name: res.data.name,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
            roleBasedRedirect(res);
          })
          .catch((error) => console.log(error.message));
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  // Login Form
  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control mb-4 p-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          autoFocus
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          className="form-control mb-4 p-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </div>
      <br />
      <Button
        type="primary"
        onClick={handleSubmit}
        className="mb-1 col-md-6"
        shape="round"
        icon={<MailOutlined />}
        size="large"
        block
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-1">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {loginForm()}
          <Button
            type="danger"
            onClick={handleGoogleLogin}
            className="mb-3 col-md-6"
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
            block
          >
            Login with Google
          </Button>
          <Link to="/forgot-password" className="float-right text-danger">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
