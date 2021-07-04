import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import laptop from "../../images/laptop.png";
import { Link } from "react-router-dom";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { ShowAverageRating } from "../../functions/rating";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import CartActionTypes from "../../reducers/cart/CartActionTypes";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  // Destructure props
  const { title, description, images, slug, ratings, price } = product;

  // Component state
  const [toolTip, setToolTip] = useState();

  // Get access to dispatch.
  let dispatch = useDispatch();

  // Get access to the redux state.
  const { user, cart } = useSelector((state) => ({ ...state }));

  /**
   * 1. Create cart[] in the local storage
   * 2. The 'product' obtained as props is saved in the local storage
   * 3. Update the toolTip to be shown
   * 4. Dispatch the "ADD_TO_CART" action.
   */
  const handleAddToCart = () => {
    let cart = [];

    // Local storage is part of the window object. Hence, check if window is available to access/use local storage
    if (typeof window !== undefined) {
      // If cart[] is already in the local storage, GET it.
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // User adds item for the first time, no cart[] available in the local storage. Push the item to cart.
      // Spread the product so that we get all the properties of the product, plus add the count property.
      cart.push({
        ...product,
        count: 1,
      });

      // Remove Duplicate products.
      let unique = _.uniqWith(cart, _.isEqual);

      // Save to local storage.
      // console.log("UNIQUE: ", unique);
      localStorage.setItem("cart", JSON.stringify(unique));

      // Show toolTip
      setToolTip("Already added to your cart");

      // Add to redux state.
      dispatch({
        type: CartActionTypes.ADD_TO_CART,
        payload: unique,
      });
    }
  };

  return (
    <div>
      {product && ratings && ratings.length > 0 ? (
        <ShowAverageRating product={product} />
      ) : (
        <div className="text-center text-warning pt-1 pb-3">No ratings yet</div>
      )}

      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : laptop}
            alt="Product Info"
            style={{ height: "150px", objectFit: "cover" }}
            className="p-1"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-primary" /> <br />
            View Product
          </Link>,
          <Tooltip title={toolTip}>
            <a onClick={handleAddToCart}>
              <ShoppingCartOutlined className="text-danger" />
              <br />
              Add to Cart
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - $${price}`}
          description={`${description && description.substring(0, 60)}...`}
        />
      </Card>
    </div>
  );
};

export default ProductCard;
