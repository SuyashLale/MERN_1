import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { auth } from "../../firebase";
import { toast } from "react-toastify";

export const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  /*
   * Need to redirect the user away from the Forgot-Password
   * page if they are already logged. Thus, need to check this if
   * the user returned from Firebase changes.
   */
  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
      handleCodeInApp: true,
    };
    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast.success(
          "Please check your email address for a password reset link."
        );
        history.push("/login");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error(error.message);
      });
  };

  return (
    <div className="col-md-6 offset-md-3 p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Forgot Password</h4>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          placeholder="Your email address"
        />
         <br />
        <Button
          onClick={handleSubmit}
          disabled={!email}
          type="primary"
          shape="round"
        >
          Get password reset link
        </Button>
      </form>
    </div>
  );
};
