import React from "react";
import { Button, Select } from "antd";

const CreateProductForm = ({
  handleChange,
  handleSubmit,
  handleCategoryChange,
  values,
  setValues,
  subCategoriesOptions,
  enableSubCategoryDropdown,
}) => {
  // Destructure Props...
  const {
    title,
    description,
    price,
    category,
    categories,
    subCategories,
    shipping,
    quantity,
    images,
    colors,
    color,
    brands,
    brand,
  } = values;

  const { Option } = Select;

  return (
    <form className="col-md-6">
      <div className="form-group ">
        <label>Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={title}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          className="form-control"
          value={description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={price}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Shipping</label>
        <select
          name="shipping"
          className="form-control"
          onChange={handleChange}
        >
          <option>Please Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input
          type="Number"
          name="quantity"
          className="form-control"
          value={quantity}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label className="col-md-3">Color</label>
        <select
          name="color"
          className="browser-default custom-select ml-2"
          style={{ width: 220 }}
          onChange={handleChange}
        >
          <option>Please Select</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="col-md-3">Brand</label>
        <select
          name="brand"
          className="browser-default custom-select ml-2"
          style={{ width: 220 }}
          onChange={handleChange}
        >
          <option>Please Select</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="col-md-3">Category</label>
        <select
          name="category"
          style={{ width: 220 }}
          className="browser-default custom-select ml-2"
          onChange={handleCategoryChange}
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
      <div className="form-group">
        <label className="col-md-3">Sub-Categories</label>
        <Select
          mode="multiple"
          style={{ width: 250 }}
          placeholder="Select 1 or more sub-categories"
          value={subCategories}
          className="ml-2"
          onChange={(value) => setValues({ ...values, subCategories: value })}
          disabled={!enableSubCategoryDropdown}
        >
          {subCategoriesOptions.length &&
            subCategoriesOptions.map((subCategory) => (
              <Option key={subCategory._id} value={subCategory._id}>
                {subCategory.name}
              </Option>
            ))}
        </Select>
      </div>
      <div className="form-group">
        <Button
          onClick={handleSubmit}
          disabled={!title || !description || !quantity || !price}
          className="btn btn-outline-primary"
          shape="round"
          size="middle"
        >
          Create Product
        </Button>
      </div>
    </form>
  );
};

export default CreateProductForm;
