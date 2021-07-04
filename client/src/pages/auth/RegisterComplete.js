import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { auth } from "../../firebase";
import UserActionTypes from "../../reducers/user/user-action-types";
import { createOrUpdateUser } from "../../functions/auth.functions";

const RegisterComplete = ({ history }) => {
  // State will store the email and password entered. Default value is nothing.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let dispatch = useDispatch();

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, []);

  /* Handle Form Submit.
   * Input Validations
   * Prevent the page from reloading.
   * Sign the user in through firebase's auth obj using sign in with Email link method.
   * Once the user verifies email,
   * Remove Email from Local Storage.
   * Get the User Token.
   * Update the password using the updataPassword method on firebase.
   * Dispatch information to the Redux Store
   * Redirect the user
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Both email and password are required");
      return;
    }
    if (password.length < 6) {
      toast.error("The password needs to be at least 6 characters long.");
      return;
    }
    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.localStorage.href
      );
      if (result.user.emailVerified) {
        window.localStorage.removeItem("emailForRegistration");
        let user = auth.currentUser; // Firebase tracks the current user who is logged in..
        user.updatePassword(password);
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
          })
          .catch((error) => console.log(error.message));

        history.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Compelte-Registration Form
  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control m b-4"
        value={email}
        disabled
      />
      <input
        type="password"
        className="form-control m b-4"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        autoFocus
        placeholder="Enter Password"
      />
      <br />
      <button type="submit" className="btn btn-raised btn-dark">
        Finish Registration
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-1">
          <h4>Complete Registration</h4>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
