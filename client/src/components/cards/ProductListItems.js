import React from "react";
import { Link } from "react-router-dom";

const ProductListItems = ({
  product: {
    price,
    category,
    subCategories,
    sold,
    slug,
    shipping,
    color,
    brand,
    quantity,
  },
}) => {
  return (
    <ul className="list-group">
      <li className="list-group-item">
        Price{" "}
        <span className="label label-default label-pill pull-xs-right">
          ${price}
        </span>
      </li>
      {category ? (
        <li className="list-group-item">
          Category
          <Link
            to={`/category/${category.slug}`}
            className="label label-default label-pill pull-xs-right"
          >
            {category.name}
          </Link>
        </li>
      ) : null}
      {subCategories ? (
        <li className="list-group-item">
          Sub-Categories
          {subCategories.map((subCategory) => (
            <Link
              key={subCategory._id}
              to={`/sub-category/${subCategory.slug}`}
              className="label label-default label-pill pull-xs-right"
            >
              {subCategory.name}
            </Link>
          ))}
        </li>
      ) : null}
      <li className="list-group-item">
        Shipping
        <span className="label label-default label-pill pull-xs-right">
          {shipping}
        </span>
      </li>
      <li className="list-group-item">
        Color
        <span className="label label-default label-pill pull-xs-right">
          {color}
        </span>
      </li>
      <li className="list-group-item">
        Brand
        <span className="label label-default label-pill pull-xs-right">
          {brand}
        </span>
      </li>
      <li className="list-group-item">
        In Stock
        <span className="label label-default label-pill pull-xs-right">
          {quantity}
        </span>
      </li>
      <li className="list-group-item">
        SKUs Sold
        <span className="label label-default label-pill pull-xs-right">
          {sold}
        </span>
      </li>
    </ul>
  );
};

export default ProductListItems;
