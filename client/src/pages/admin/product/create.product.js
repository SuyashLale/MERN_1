import React, { useState, useEffect } from "react";

import { createProduct } from "../../../functions/product.functions";
import AdminNav from "../../../components/nav/AdminNav";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CreateProductForm from "../../../components/forms/CreateProductForm";
import {
  getCategories,
  getAllSubCategories,
} from "../../../functions/category.functions";
import FileUpload from "../../../components/forms/FileUpload";
import { SyncOutlined } from "@ant-design/icons";

const INITIAL_STATE = {
  title: "",
  description: "",
  price: "",
  category: "", // The selected category in the form.
  categories: [], // To show the options in the dropdown.
  subCategories: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"], // Color Options.
  brands: ["Apple", "Microsoft", "Samsung", "Lenovo", "Asus"],
  color: "", // Color that is picked,
  brand: "",
};

const CreateProduct = () => {
  const [values, setValues] = useState(INITIAL_STATE);
  const [subCategoriesOptions, setSubCategoriesOptions] = useState([]);
  const [enableSubCategoryDropdown, setEnableSubCategoryDropdown] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  /**
   * Load all categories,
   * set the state.
   */
  const loadAllCategories = () => {
    getCategories().then((category) => {
      //   console.log(category.data);
      setValues({ ...values, categories: category.data });
    });
  };

  /**
   * Load all categories to be displayed on the UI.
   */
  useEffect(() => {
    loadAllCategories();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        console.log(res);
        window.alert(`Successfully created product "${values.title}"`);
        window.location.reload();
      })
      .catch((error) => {
        console.log("Create Product Failed-->", error);
        toast.error(error.response.data.error);
      });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setEnableSubCategoryDropdown(true);
    console.log("CLICKED CATEGORY: ", e.target.value);
    setValues({ ...values, category: e.target.value, subCategories: [] });
    getAllSubCategories(e.target.value)
      .then((res) => {
        console.log("SUB CATEGORY OPTIONS ON CATEGORY CLICK--> ", res.data);
        setSubCategoriesOptions(res.data);
      })
      .catch((error) => {
        console.log("FAILED--SUB CATEGORY OPTIONS ON CATEGORY CLICK-- ", error);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Create a Product</h4>
          <hr />
          <div className="p-3">
            {loading ? (
              <h1>
                <SyncOutlined spin className="text-warning" />
              </h1>
            ) : (
              <FileUpload
                values={values}
                setValues={setValues}
                setLoading={setLoading}
              />
            )}
          </div>
          <CreateProductForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCategoryChange={handleCategoryChange}
            values={values}
            setValues={setValues}
            subCategoriesOptions={subCategoriesOptions}
            enableSubCategoryDropdown={enableSubCategoryDropdown}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
