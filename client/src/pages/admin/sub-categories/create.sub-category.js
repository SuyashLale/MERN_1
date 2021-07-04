import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import {
  getSubCategories,
  createSubCategory,
  deleteSubCategory,
} from "../../../functions/sub-category.functions";
import { getCategories } from "../../../functions/category.functions";
import AdminNav from "../../../components/nav/AdminNav";
import CategoryFrom from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/search/LocalSearch";

const CreateSubCategory = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  /**
   * Executing this function will get all the categories
   * from the DB, and the data will be available in the state to use.
   */
  const loadAllCategories = () => {
    getCategories().then((category) => {
      // console.log(category.data);
      setCategories(category.data);
    });
  };

  /**
   * Executing this function will get all the sub-categories
   * from the DB, and the data will be available in the state to use.
   */
  const loadAllSubCategories = () => {
    getSubCategories().then((subCategory) => {
      //   console.log(subcategory.data);
      setSubCategories(subCategory.data);
    });
  };

  /**
   * Load all categories to be displayed in the Parent Category Dropdown.
   */
  useEffect(() => {
    loadAllCategories();
    loadAllSubCategories();
  }, []);

  const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await createSubCategory({ name, parent: category }, user.token)
      .then((res) => {
        loadAllSubCategories();
        setLoading(false);
        setName("");
        toast.success(`Successfully created category: "${res.data.name}"`);
      })
      .catch((error) => {
        console.log("ERROR_CREATING_CATEGORY- " + error);
        setLoading(false);
        if (error.response.status === 400)
          toast.error(`Error creating category. ${error.message}`);
      });
  };

  const handleDelete = async (slug) => {
    if (window.confirm("Delete category?")) {
      setLoading(true);
      await deleteSubCategory(slug, user.token)
        .then((res) => {
          loadAllSubCategories();
          setLoading(false);
          toast.warning(`"${res.data.name}" deleted successfully.`);
        })
        .catch((error) => {
          console.log("ERROR_DELETING_SUBCATEGORY- " + error);
          setLoading(false);
          if (error.response.status === 400)
            toast.error(`Error deleting sub-category. ${error.message}`);
        });
    }
  };

  const filteredSubCategories = (keyword) => (subCategory) =>
    subCategory.name.toLowerCase().includes(keyword);

  // (keyword) => (
  //   (category => (category.name.includes(keyword)))
  // )

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-4">
          <h4>Create a Product Sub-Category</h4>
          <div className="form-group">
            <label>Parent Category</label>
            <select
              name="category"
              style={{ width: 220 }}
              className="browser-default custom-select ml-2"
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Select</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
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
            buttonText="Create"
          />
          <hr style={{ width: "100vw" }} />
          <br />
          {/* Search field */}
          <LocalSearch
            keyword={keyword}
            setKeyword={setKeyword}
            placeholder="Search Sub Categories"
          />
          {subCategories
            .filter(filteredSubCategories(keyword))
            .map((subCategory) => {
              return (
                <div key={subCategory._id} className="alert alert-secondary">
                  {subCategory.name}
                  <span
                    onClick={() => handleDelete(subCategory.slug)}
                    className="btn btn-md float-right"
                  >
                    {loading ? (
                      <LoadingOutlined className="text-danger" />
                    ) : (
                      <DeleteOutlined className="text-danger" />
                    )}
                  </span>
                  <Link
                    className="btn btn-md float-right"
                    to={`/admin/sub-category/${subCategory.slug}`}
                  >
                    <EditOutlined className="text-primary" />
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CreateSubCategory;
