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
  getCategories,
  createCategory,
  deleteCategory,
} from "../../../functions/category.functions";
import AdminNav from "../../../components/nav/AdminNav";
import CategoryFrom from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/search/LocalSearch";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");

  /**
   * Executing this function will get all the categories
   * from the DB, and the data will be available in the state to use.
   */
  const loadAllCategories = () => {
    getCategories().then((category) => {
      //   console.log(category.data);
      setCategories(category.data);
    });
  };

  /**
   * Load all categories to be displayed on the UI.
   */
  useEffect(() => {
    loadAllCategories();
  }, []);

  const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await createCategory({ name }, user.token)
      .then((res) => {
        loadAllCategories();
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
      await deleteCategory(slug, user.token)
        .then((res) => {
          loadAllCategories();
          setLoading(false);
          toast.warning(`"${res.data.name}" deleted successfully.`);
        })
        .catch((error) => {
          console.log("ERROR_DELETING_CATEGORY- " + error);
          setLoading(false);
          if (error.response.status === 400)
            toast.error(`Error deleting category. ${error.message}`);
        });
    }
  };

  const filteredCategories = (keyword) => (category) =>
    category.name.toLowerCase().includes(keyword);

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
          <h4>Create a Product Category</h4>
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
            placeholder="Search Product Categories"
          />
          {categories.filter(filteredCategories(keyword)).map((category) => {
            return (
              <div key={category._id} className="alert alert-secondary">
                {category.name}
                <span
                  onClick={() => handleDelete(category.slug)}
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
                  to={`/admin/category/${category.slug}`}
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

export default CreateCategory;
