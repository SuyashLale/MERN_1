import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminNav from "../../../components/nav/AdminNav";
import {
  getProductBySlug,
  updateProduct,
} from "../../../functions/product.functions";
import {
  getCategories,
  getAllSubCategories,
} from "../../../functions/category.functions";
import UpdateProductForm from "../../../components/forms/UpdateProductForm";
import FileUpload from "../../../components/forms/FileUpload";
import { SyncOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const INITIAL_STATE = {
  title: "",
  description: "",
  price: "",
  category: "", // The selected category in the form.
  subCategories: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"], // Color Options.
  brands: ["Apple", "Microsoft", "Samsung", "Lenovo", "Asus"], // Brand Options.
  color: "", // Color that is picked,
  brand: "",
};

const UpdateProduct = ({
  match: {
    params: { slug },
  },
  history,
}) => {
  const [values, setValues] = useState(INITIAL_STATE);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [enableSubCategoryDropdown, setEnableSubCategoryDropdown] =
    useState(false);
  const [subCategoriesOptions, setSubCategoriesOptions] = useState([]);
  const [subCategoryIDs, setSubCategoryIDs] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  /**
   * 1. Load all product details.
   * 2. Get the subCategory IDs for the looked-up product.
   * 3. Form the Array of SubCategory IDs to show in the dropdown multi-select.
   * 4. Update the state with the Array.
   */
  const loadProductDetails = () => {
    getProductBySlug(slug)
      .then((product) => {
        // console.log(product);
        setValues({ ...values, ...product.data });
        getAllSubCategories(product.data.category._id).then((res) => {
          setSubCategoriesOptions(res.data); // On first load, show already assigned subCategories.
        });
        let arr = [];
        product.data.subCategories.map((subCategory) => {
          return arr.push(subCategory._id);
        });
        setSubCategoryIDs((prev) => arr);
      })
      .catch((error) => {
        console.log("Error in getProductBySlug(): ", error);
      });
  };

  /**
   * Load all categories for displaying the dropdown.
   */
  const loadAllCategories = () => {
    getCategories().then((category) => {
      //   console.log(category.data);
      setCategories(category.data);
    });
  };

  /**
   * Upon selecting the category,
   * 1. Invoke getAllSubCategories to populate the sub-category dropdown.
   * 2. Set the subCategory options to the data received from server.
   * 3. Set the sub-category multi-select dropdown to [] so that user can pick again.
   * If the user comes back to the same category during edit, we load the product again
   * to populate the originally selected sub-categories.
   */
  const handleCategoryChange = (e) => {
    e.preventDefault();
    // console.log("CLICKED CATEGORY: ", e.target.value);
    setValues({ ...values, subCategories: [] });
    setSelectedCategory(e.target.value);
    getAllSubCategories(e.target.value)
      .then((res) => {
        // console.log("SUB CATEGORY OPTIONS ON CATEGORY CLICK--> ", res.data);
        setSubCategoriesOptions(res.data);
        if (values.category._id === e.target.value) {
          loadProductDetails();
        }
        setSubCategoryIDs([]);
      })
      .catch((error) => {
        console.log("FAILED--SUB CATEGORY OPTIONS ON CATEGORY CLICK-- ", error);
      });
  };

  /**
   * 1. Get the product based on slug and set the state.
   * 2. Load all the categories
   */
  useEffect(() => {
    loadProductDetails();
    loadAllCategories();
  }, []);

  /**
   * Submit the product for update to the back end.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Add updated props to the values
    values.subCategories = subCategoryIDs;
    values.category = selectedCategory ? selectedCategory : values.category;

    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`"${values.title}" is updated successfully.`);
        history.push("/admin/products");
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error in updating product: ", error);
        toast.error(error.message);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4 className="text-primary">Update Product</h4>
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
          <UpdateProductForm
            values={values}
            setValues={setValues}
            categories={categories}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            enableSubCategoryDropdown={enableSubCategoryDropdown}
            handleCategoryChange={handleCategoryChange}
            subCategoriesOptions={subCategoriesOptions}
            subCategoryIDs={subCategoryIDs}
            setSubCategoryIDs={setSubCategoryIDs}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
