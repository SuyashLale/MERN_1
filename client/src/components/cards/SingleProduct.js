import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Tabs, Tooltip } from "antd";
import { HeartFilled, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Laptop from "../../images/laptop.png";
import ProductListItems from "./ProductListItems";
import StarRating from "react-star-ratings";
import RatingModal from "../modal/ratingModal";
import { ShowAverageRating } from "../../functions/rating";
import _, { uniq } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import CartActionTypes from "../../reducers/cart/CartActionTypes";

const { TabPane } = Tabs;

const SingleProduct = ({ product, onRatingClick, starRating }) => {
  const { title, images, description, _id, ratings } = product;

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
    <>
      <div className="col-md-6">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images.map((image) => (
              <img key={image.public_id} src={image.url} alt={title} />
            ))}
          </Carousel>
        ) : (
          <Card
            cover={
              <img
                src={Laptop}
                alt="Product Info"
                className="card-image mb-3"
              />
            }
          ></Card>
        )}
        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description ? description : null}
          </TabPane>
          <TabPane tab="More" key="2">
            Additional Information
          </TabPane>
        </Tabs>
      </div>
      <div className="col-md-5">
        <h1 className="bg-primary p-3">{title}</h1>
        {product && ratings && ratings.length > 0 ? (
          <ShowAverageRating product={product} />
        ) : (
          <div className="text-center text-warning pt-1 pb-3">
            No ratings yet
          </div>
        )}
        <Card
          actions={[
            <Tooltip title={toolTip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-success" /> <br />
                Add to Cart
              </a>
            </Tooltip>,
            <Link to={"/"}>
              <HeartFilled className="text-danger" />
              <br /> Add to Wishlist
            </Link>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                size={10}
                rating={starRating}
                changeRating={onRatingClick}
                isSelectable={false}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
