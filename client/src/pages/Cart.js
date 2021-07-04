import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";

const Cart = () => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  let dispatch = useDispatch();

  /**
   * Get the total cart value
   */
  const getTotalPrice = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const saveOrderToDB = () => {};

  const showCartItems = () => (
    <table className="table table-bordered mt-2">
      <thead className="thead-dark">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Item Count</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove Item</th>
        </tr>
      </thead>
      {cart.map((item) => (
        <ProductCardInCheckout key={item._id} product={item} />
      ))}
    </table>
  );

  return (
    <div className="container-fluid pt-2 m-3">
      <div className="row">
        <h4>Your Cart: Number of items: {cart.length}</h4>
      </div>
      {/* Table to show the products */}
      <div className="row">
        <div className="col-md-8">
          {!cart.length ? (
            <p>
              No items added in the cart yet.{" "}
              <Link to={"/shop"}>Continue Shopping</Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((item, index) => (
            <div key={index}>
              <p>
                {item.title} x {item.count} = ${item.price * item.count}{" "}
              </p>
            </div>
          ))}
          <hr />
          <b>Grand Total: ${getTotalPrice()}</b>
          <hr />
          {user && user.token ? (
            <button
              type="button"
              className="btn btn-sm btn-raised btn-success mt-2"
              onClick={saveOrderToDB}
              disabled={!cart.length}
            >
              Proceed to Checkout
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-raised btn-success mt-2"
            >
              <Link
                to={{
                  pathname: "/login",
                  state: { from: "cart" },
                }}
                className="text-light"
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
