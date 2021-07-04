import CartActionTypes from "./CartActionTypes";

let INITIAL_STATE = [];

// Update INITIAL_STATE to whatever is in the local storage, if at all.
if (typeof window !== undefined) {
  if (localStorage.getItem("cart")) {
    INITIAL_STATE = JSON.parse(localStorage.getItem("cart"));
  } else {
    INITIAL_STATE = [];
  }
}

const CartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CartActionTypes.ADD_TO_CART:
      return action.payload;
    default:
      return state;
  }
};

export default CartReducer;
