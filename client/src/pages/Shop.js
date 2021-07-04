import React, { useState, useEffect } from "react";
import {
  getProductsByCount,
  getProductsBasedOnSearchToken,
} from "../functions/product.functions";
import { getCategories } from "../functions/category.functions";
import { getSubCategories } from "../functions/sub-category.functions";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import { toast } from "react-toastify";
import { Menu, Slider } from "antd";
import { Radio } from "antd";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import SearchActionTypes from "../reducers/search/search-action-types";
import { Checkbox } from "antd";
import Star from "../components/star-filter/star";

const { SubMenu, ItemGroup } = Menu;
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [price, setPrice] = useState([0, 99999]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState("");
  const [star, setStar] = useState("");
  const [brands, setBrands] = useState([
    "Apple",
    "Microsoft",
    "Samsung",
    "Lenovo",
    "Asus",
  ]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [selectedColor, setSelectedColor] = useState("");
  const [shipping, setShipping] = useState("");

  let dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state })); // This holds the value of the search token
  const { text } = search;

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(12)
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setProducts(res.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error in getProductsByCount(): ", error);
        toast.error(
          "Problem in getting the products from the DB. " + error.message
        );
      });
  };

  const fetchProductsBasedOnSearchToken = (arg) => {
    getProductsBasedOnSearchToken(arg)
      .then((res) => {
        console.log("FETCH():--> ", res.data);
        setProducts(res.data);
      })
      .catch((error) => {
        console.log("Error in getProductsBasedOnSearchToken(): ", error);
        toast.error(
          "Could not get products based on the search token. " + error.message
        );
      });
  };

  const handleSlider = (value) => {
    dispatch({
      type: SearchActionTypes.SEARCH_QUERY,
      payload: { text: "" },
    });
    setFilterCategories([]);
    setFilteredSubCategory("");
    setStar("");
    setSelectedBrand("");
    setSelectedColor("");

    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  const loadCategories = () => {
    getCategories()
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.log("Error in fetching all categories:", error);
        toast.error(
          "Could not fetch all the categories from the DB. " + error.message
        );
      });
  };

  const loadAllSubCategories = () => {
    getSubCategories()
      .then((res) => setSubCategories(res.data))
      .catch((error) => {
        console.log("Error in getting all sub-categories, ", error);
        toast.error(
          "Could not get all sub-categories from the DB. " + error.message
        );
      });
  };

  /**
   * Handle check for categories check box.
   */
  const handleCheck = (e) => {
    // set the price slider to 0.
    setPrice([0, 0]);

    // set the global search box to empty
    dispatch({
      type: SearchActionTypes.SEARCH_QUERY,
      payload: { text: "" },
    });

    // Reset star filter
    setStar("");

    // Reset the subCategory Filter.
    setFilteredSubCategory("");

    // Reset brand filter
    setSelectedBrand("");

    // Reset color filter
    setSelectedColor("");

    // Reset Shipping filter
    setShipping("");

    // Get all the category IDs that we have in the state.
    let categoriesInState = [...filterCategories];

    // Get the category that the user just checked in the filter options.
    let checkedCategory = e.target.value;

    // Check if the category that the user just checked is in the state or not.
    // If the category is found, it return the index, else returns -1.
    let categoryFoundInState = categoriesInState.indexOf(checkedCategory);

    if (categoryFoundInState === -1) {
      // Category not found
      categoriesInState.push(checkedCategory);
    } else {
      // User already has checked that item before; means now it is unchecked.
      categoriesInState.splice(categoryFoundInState, 1);
    }
    setFilterCategories(categoriesInState);
    // console.log(categoriesInState);

    // Invoke the backend API
    fetchProductsBasedOnSearchToken({ category: categoriesInState });
  };

  const handleStarClick = (num) => {
    // console.log("Num ", num);

    // Reset other filter options
    setPrice([0, 0]);
    dispatch({
      type: SearchActionTypes.SEARCH_QUERY,
      payload: { text: "" },
    });
    setFilterCategories([]);
    setFilteredSubCategory("");
    setSelectedBrand("");
    setSelectedColor("");
    setShipping("");

    // Set the star filter rating in the state.
    setStar(num);

    // Call API
    fetchProductsBasedOnSearchToken({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star numberOfStars={5} starClick={handleStarClick} />
      <Star numberOfStars={4} starClick={handleStarClick} />
      <Star numberOfStars={3} starClick={handleStarClick} />
      <Star numberOfStars={2} starClick={handleStarClick} />
      <Star numberOfStars={1} starClick={handleStarClick} />
    </div>
  );

  const showSubCategories = () =>
    subCategories.map((subC) => (
      <div
        key={subC._id}
        onClick={() => handleSubCategoryFilter(subC)}
        className="p-1 m-1 badge badge-secondary"
        style={{ cursor: "pointer" }}
      >
        {subC.name}
      </div>
    ));

  const handleSubCategoryFilter = (subC) => {
    console.log(subC);

    //set the subCategories in the state
    setFilteredSubCategory(subC);

    // Reset other filter options
    setPrice([0, 0]);
    dispatch({
      type: SearchActionTypes.SEARCH_QUERY,
      payload: { text: "" },
    });
    setFilterCategories([]);
    setStar("");
    setSelectedBrand("");
    setSelectedColor("");
    setShipping("");

    // Invoke API
    fetchProductsBasedOnSearchToken({ subCategory: subC });
  };

  /**
   * Show products based on the brand filter
   */
  const showBrands = () => {
    // console.log(brands);
    return brands.map((b) => (
      <Radio
        key={b}
        value={b}
        name={b}
        checked={b === selectedBrand}
        onChange={handleBrand}
        className="pb-1 pl-4 pr-4"
      >
        {b}
      </Radio>
    ));
  };

  const handleBrand = (e) => {
    // Reset other filter options
    setPrice([0, 0]);
    dispatch({
      type: SearchActionTypes.SEARCH_QUERY,
      payload: { text: "" },
    });
    setFilterCategories([]);
    setStar("");
    setSelectedColor("");
    setShipping("");

    // Set the selected brand in the state
    setSelectedBrand(e.target.value);

    // Invoke API
    fetchProductsBasedOnSearchToken({ brand: e.target.value });
  };

  /**
   * Show products based on the color filter
   */
  const showColors = () => {
    // console.log(brands);
    return colors.map((c) => (
      <Radio
        key={c}
        value={c}
        name={c}
        checked={c === selectedColor}
        onChange={handleColor}
        className="pb-1 pl-4 pr-4"
      >
        {c}
      </Radio>
    ));
  };

  const handleColor = (e) => {
    // Reset other filter options
    setPrice([0, 0]);
    dispatch({
      type: SearchActionTypes.SEARCH_QUERY,
      payload: { text: "" },
    });
    setFilterCategories([]);
    setStar("");
    setSelectedBrand("");
    setShipping("");

    // Set the selected brand in the state
    setSelectedColor(e.target.value);

    // Invoke API
    fetchProductsBasedOnSearchToken({ color: e.target.value });
  };

  /**
   * Handle Shipping options
   */
  const showShipping = () => {
    return (
      <>
        <Checkbox
          onChange={handleShippingChange}
          className="pb-2 pl-4 r-4"
          value="Yes"
          checked={shipping === "Yes"}
        >
          Yes
        </Checkbox>
        <Checkbox
          onChange={handleShippingChange}
          className="pb-2 pl-4 r-4"
          value="No"
          checked={shipping === "No"}
        >
          No
        </Checkbox>
      </>
    );
  };

  const handleShippingChange = (e) => {
    // Reset other filter options
    setPrice([0, 0]);
    dispatch({
      type: SearchActionTypes.SEARCH_QUERY,
      payload: { text: "" },
    });
    setFilterCategories([]);
    setStar("");
    setSelectedBrand("");
    setSelectedColor("");

    // Set the selected brand in the state
    setShipping(e.target.value);

    // Invoke API
    fetchProductsBasedOnSearchToken({ shipping: e.target.value });
  };

  useEffect(() => {
    loadAllProducts();
    loadCategories();
    loadAllSubCategories();
  }, []);

  /**
   * Run this effect when the user searches using global search box.
   */
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProductsBasedOnSearchToken({ query: text });
    }, 300);
    return () => {
      clearTimeout(delayed);
    };
  }, [text]);

  /**
   * Run this effect when the price changes.
   */
  useEffect(() => {
    // console.log("OK to request API");
    fetchProductsBasedOnSearchToken({ price });
  }, [ok]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 pt-2">
          <h4>Filter Options</h4>
          <hr />

          <Menu
            mode="inline"
            defaultOpenKeys={[
              "slider",
              "category",
              "star",
              "subCategory",
              "brands",
              "colors",
              "shipping",
            ]}
          >
            {/* Price Filter */}
            <SubMenu
              key="slider"
              title={
                <span className="h6">
                  <DollarOutlined className="text-info" />
                  Price Range
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(value) => `$${value}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="9999"
                />
              </div>
            </SubMenu>
            {/* Category Filter */}
            <SubMenu
              key="category"
              title={
                <span className="h6">
                  <DownSquareOutlined className="text-info" />
                  Category
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="pl-1">
                {categories.map((c) => (
                  <div key={c._id}>
                    <Checkbox
                      className="pb-2 pl-4 pr-4"
                      value={c._id}
                      name="category"
                      checked={filterCategories.includes(c._id)}
                      onChange={handleCheck}
                    >
                      {c.name}
                    </Checkbox>
                    <br />
                  </div>
                ))}
              </div>
            </SubMenu>
            {/* Star Filter */}
            <SubMenu
              key="star"
              title={
                <span className="h6">
                  <StarOutlined className="text-info" />
                  Rating
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }}>{showStars()}</div>
            </SubMenu>
            {/* Sub-Category Filter */}
            <SubMenu
              key="subCategory"
              title={
                <span className="h6">
                  <DownSquareOutlined className="text-info" />
                  Sub-Category
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="pl-4 pr-4">
                {showSubCategories()}
              </div>
            </SubMenu>
            {/* Brand Filter */}
            <SubMenu
              key="brands"
              title={
                <span className="h6">
                  <DownSquareOutlined className="text-info" />
                  Brands
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="pr-4 pl-1">
                {showBrands()}
              </div>
            </SubMenu>
            {/* Color Filter */}
            <SubMenu
              key="colors"
              title={
                <span className="h6">
                  <DownSquareOutlined className="text-info" />
                  Colors
                </span>
              }
            >
              <div
                style={{
                  marginTop: "-10px",
                }}
                className="pr-4 pl-1"
              >
                {showColors()}
              </div>
            </SubMenu>
            {/* Shipping Filter */}
            <SubMenu
              key="shipping"
              title={
                <span className="h6">
                  <DownSquareOutlined className="text-info" />
                  Shipping
                </span>
              }
            >
              <div
                style={{
                  marginTop: "-10px",
                }}
                className="pr-4 pl-1"
              >
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger text-center">Loading...</h4>
          ) : (
            <h4 className="text-center text-secondary jumbotron display-4 p-3 mt-5 mb-5">
              Products
            </h4>
          )}
          {!products.length ? (
            <p>No Products found..</p>
          ) : (
            <div className="row pb-5">
              {products.map((product) => (
                <div className="col-md-4 mt-3" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
