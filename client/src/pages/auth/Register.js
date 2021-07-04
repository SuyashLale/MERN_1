import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { auth } from "../../firebase";

const Register = ({ history }) => {
  // State will store the email entered. Default value is nothing.
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  /*
   * Need to redirect the user away from the Forgot-Password
   * page if they are already logged. Thus, need to check this if
   * the user returned from Firebase changes.
   */
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

  /* Handle Form Submit.
   ** Prevent the browser from reloading.
   ** Send the confirmation link to the entered email address.
   ** Toast notification for success.
   ** Save the user's email address in the local storage.
   ** Clear the state again.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    await auth.sendSignInLinkToEmail(email, config);
    toast.success(
      `Verification email sent successfully to ${email}. Please click link provided to complete registration.`
    );
    window.localStorage.setItem("emailForRegistration", email);
    setEmail("");
  };

  // Registration Form
  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-control mb-4 p-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoFocus
        />
        <input
          type="email"
          className="form-control mb-4 p-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
        />
      </div>
      <br />
      <button type="submit" className="btn btn-raised btn-dark">
        Register
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-1">
          <h4>Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;
