import { combineReducers } from "redux";

import UserReducer from "./user/user-reducer";
import SearchReducer from "./search/search.reducer";
import CartReducer from "./cart/cart.reducer";

const RootReducer = combineReducers({
  user: UserReducer,
  search: SearchReducer,
  cart: CartReducer,
});

export default RootReducer;
