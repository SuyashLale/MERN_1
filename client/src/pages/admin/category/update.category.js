import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import {
  getCategory,
  updateCategory,
} from "../../../functions/category.functions";
import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForm";

const UpdateCategory = ({ history, match }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Executing this function will get the category
   * from the DB based on the slug that is passed,
   * and the data will be available in the state to use.
   */
  const loadCategory = () => {
    getCategory(match.params.slug).then((category) => {
      //   console.log(category.data);
      setName(category.data.name);
    });
  };

  /**
   * Load the category that is being edited,
   * to be displayed on the UI.
   * Extract the slug from the URL and send it to Node to get the data
   */
  useEffect(() => {
    loadCategory();
  }, []);

  const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await updateCategory(match.params.slug, { name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`Successfully updated category: "${res.data.name}"`);
        history.push("/admin/category");
      })
      .catch((error) => {
        console.log("ERROR_UPDATING_CATEGORY- " + error);
        setLoading(false);
        if (error.response.status === 400)
          toast.error(`Error updating category. ${error.message}`);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-4">
          <h4>Update Product Category</h4>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            loading={loading}
            setName={setName}
            buttonText="Update"
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
