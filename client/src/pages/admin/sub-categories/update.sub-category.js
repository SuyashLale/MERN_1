import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import {
  getSubCategory,
  updateSubCategory,
} from "../../../functions/sub-category.functions";
import { getCategories } from "../../../functions/category.functions";
import AdminNav from "../../../components/nav/AdminNav";
import CategoryFrom from "../../../components/forms/CategoryForm";

const UpdateSubCategory = ({ match, history }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState("");

  /**
   * Executing this function will get all the categories
   * from the DB, and the data will be available in the state to use.
   */
  const loadAllCategories = () => {
    getCategories().then((category) => {
      setCategories(category.data);
    });
  };

  /**
   * Executing this function will get the sub-category
   * from the DB which is being edited
   * The data will be available in the state to use.
   */
  const loadSubCategory = () => {
    getSubCategory(match.params.slug).then((subCategory) => {
      //   console.log(subcategory.data);
      setName(subCategory.data.name);
      setParent(subCategory.data.parent);
    });
  };

  /**
   * Load all categories to be displayed in the Parent Category Dropdown.
   */
  useEffect(() => {
    loadAllCategories();
    loadSubCategory();
  }, []);

  const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await updateSubCategory(match.params.slug, { name, parent }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`Successfully edited sub-category: "${res.data.name}"`);
        history.push("/admin/sub-category");
      })
      .catch((error) => {
        console.log("ERROR_UPDATING_SUBCATEGORY- " + error);
        setLoading(false);
        if (error.response.status === 400)
          toast.error(`Error editing sub-category. ${error.message}`);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-4">
          <h4>Update a Product Sub-Category</h4>
          <div className="form-group">
            <label>Parent Category</label>
            <select
              name="category"
              style={{ width: 220 }}
              className="browser-default custom-select ml-2"
              onChange={(event) => setParent(event.target.value)}
            >
              <option>Select</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                    selected={category._id === parent}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <CategoryFrom
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            loading={loading}
            buttonText="Update"
          />
          <hr style={{ width: "100vw" }} />
          <br />
        </div>
      </div>
    </div>
  );
};

export default UpdateSubCategory;
