import React from "react";
import ModalImage from "react-modal-image";
import Laptop from "../../images/laptop.png";
import { useDispatch } from "react-redux";
import CartActionTypes from "../../reducers/cart/CartActionTypes";
import { toast } from "react-toastify";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
} from "@ant-design/icons";

const ProductCardInCheckout = ({ product }) => {
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];
  let dispatch = useDispatch();

  // Update the local storage with the selected color, if changed
  const handleColorChange = (e) => {
    // console.log("Color Changed to ", e.target.value);

    let cart = [];

    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((item, index) => {
        if (item._id === product._id) {
          cart[index].color = e.target.value;
        }
      });

      // Update Local storage.
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update Redux State.
      dispatch({
        type: CartActionTypes.ADD_TO_CART,
        payload: cart,
      });
    }
  };

  const handleQtyChange = (e) => {
    let count = e.target.value < 1 ? 1 : e.target.value;
    if (count > product.quantity) {
      toast.error(
        `Only have ${product.quantity} items in stock for ${product.title}. Please reduce the quantity in the cart.`
      );
      return;
    }
    let cart = [];

    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((item, index) => {
        if (item._id === product._id) {
          cart[index].count = count;
        }
      });

      // Update local storage.
      localStorage.setItem("cart", JSON.stringify(cart));

      //Update Redux state.
      dispatch({
        type: CartActionTypes.ADD_TO_CART,
        payload: cart,
      });
    }
  };

  const handleRemove = () => {
    // console.log("Removing product: ", product._id);

    let cart = [];

    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      // Remove item from the array
      cart.map((item, index) => {
        if (item._id === product._id) {
          cart.splice(index, 1);
        }
      });

      // Update the local storage.
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update the redux store.
      dispatch({
        type: CartActionTypes.ADD_TO_CART,
        payload: cart,
      });
    }
  };

  return (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              width: "100px",
              height: "auto",
            }}
          >
            {product.images.length ? (
              <ModalImage
                small={product.images[0].url}
                large={product.images[0].url}
              />
            ) : (
              <ModalImage small={Laptop} large={Laptop} />
            )}
          </div>
        </td>
        <td>{product.title}</td>
        <td>${product.price}</td>
        <td>{product.brand}</td>
        <td>
          <select
            name="color"
            onChange={handleColorChange}
            className="browser-default custom-select ml-"
          >
            {product.color ? (
              <option>{product.color}</option>
            ) : (
              <option>Please Select</option>
            )}
            {colors
              .filter((color) => color !== product.color)
              .map((color) => (
                <option value={color} key={color}>
                  {color}
                </option>
              ))}
          </select>
        </td>
        <td>
          <input
            className="form-control text-center"
            type="number"
            value={product.count}
            onChange={handleQtyChange}
          />
        </td>
        <td className="text-center">
          {product.shipping === "Yes" ? (
            <CheckCircleFilled className="text-success h5" />
          ) : (
            <CloseCircleFilled className="text-warning h5" />
          )}
        </td>
        <td className="text-center">
          <DeleteOutlined
            className="text-danger h5 pointer"
            onClick={handleRemove}
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
