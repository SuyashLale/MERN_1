import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Header from "./components/nav/Header";
import RegisterComplete from "./pages/auth/RegisterComplete";
import History from "./pages/user/History";
import UpdatePassword from "./pages/user/UpdatePassword";
import Wishlist from "./pages/user/Wishlist";
import UserRoute from "./components/routes/UserRoutes";
import AdminRoute from "./components/routes/AdminRoutes";
import AdminDashboard from "./pages/admin/AdminDahboard";
import CreateCategory from "./pages/admin/category/create.category";
import UpdateCategory from "./pages/admin/category/update.category";
import CreateSubCategory from "./pages/admin/sub-categories/create.sub-category";
import UpdateSubCategory from "./pages/admin/sub-categories/update.sub-category";
import SubCategoryHome from "./pages/user/sub-category-home";
import CategoryHome from "./pages/user/category-home";
import CreateProduct from "./pages/admin/product/create.product";
import UpdateProduct from "./pages/admin/product/update.product";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { auth } from "./firebase";
import UserActionTypes from "./reducers/user/user-action-types";
import { getCurrentUser } from "./functions/auth.functions";
import AllProducts from "./pages/admin/product/all-products";
import ProductDetails from "./pages/ProductDetails";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";

const App = () => {
  let dispatch = useDispatch();

  /*
   * Subscribing to Firebase for User Auth state change
   * within the useEffect hook so that we can dispatch action on changes
   * onAuthStateChanged - gives back the user object (will be null when user logs out)
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        getCurrentUser(idTokenResult.token)
          .then((res) => {
            console.log("NODE_SERVER_GET_CURRENT_USER: ", res);
            dispatch({
              type: UserActionTypes.LOGGED_IN_USER,
              payload: {
                email: res.data.email,
                name: res.data.name,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((error) => console.log(error.message));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div>
      <Header />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/sub-category/:slug" component={SubCategoryHome} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/cart" component={Cart} />
        <UserRoute exact path="/user/history" component={History} />
        <UserRoute
          exact
          path="/user/update-password"
          component={UpdatePassword}
        />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/category" component={CreateCategory} />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={UpdateCategory}
        />
        <AdminRoute
          exact
          path="/admin/sub-category"
          component={CreateSubCategory}
        />
        <AdminRoute
          exact
          path="/admin/sub-category/:slug"
          component={UpdateSubCategory}
        />
        <AdminRoute exact path="/admin/product" component={CreateProduct} />
        <AdminRoute exact path="/admin/products/" component={AllProducts} />
        <Route exact path="/product/:slug" component={ProductDetails} />
        <AdminRoute
          exact
          path="/admin/product/:slug"
          component={UpdateProduct}
        />
      </Switch>
    </div>
  );
};

export default App;
