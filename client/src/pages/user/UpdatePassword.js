import React, { useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";

import UserNav from "../../components/nav/UserNav";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    //   console.log("Trying to update password...");
    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        setLoading(false);
        setPassword("");
        toast.success("Password updated succesfully!");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
        console.log("Error in updating password: ", error);
      });
  };

  const updatePasswordForm = () => (
    <form>
      <div className="form-group col-md-4">
        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          disabled={loading}
          autoFocus
        />
        <br />
        <Button
          type="primary"
          className="col-md-4"
          onClick={handleSubmit}
          disabled={!password || password.length < 6 || loading}
          loading={loading}
          shape="round"
          size="middle"
          block
        >
          Update
        </Button>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Update Password</h4>
          {updatePasswordForm()}
        </div>
      </div>
    </div>
  );
};
export default UpdatePassword;
