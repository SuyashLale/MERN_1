import React from "react";
import Jumbotron from "../components/jumbotron";
import NewArrivals from "../components/home/newArrivals";
import BestSellers from "../components/home/bestSellers";
import CategoryList from "../components/category/category-list";
import SubCategoryList from "../components/subCategory/sub-category-list";

const Home = () => {
  return (
    <>
      <div className="jumbotron text-warning text-center h1 font-weight-bold">
        <Jumbotron text={["Latest Products", "New Arrivals", "Best Sellers"]} />
      </div>
      <h4 className="text-center text-secondary jumbotron display-4 p-3 mt-5 mb-5">
        New Arrivals
      </h4>
      <NewArrivals />
      <h4 className="text-center text-secondary jumbotron display-4 p-3 mt-5 mb-5">
        Best Sellers
      </h4>
      <BestSellers />
      <h4 className="text-center text-secondary jumbotron display-4 p-3 mt-5 mb-5">
        Categories
      </h4>
      <CategoryList />
      <h4 className="text-center text-secondary jumbotron display-4 p-3 mt-5 mb-5">
        Sub-Categories
      </h4>
      <SubCategoryList />
      <br />
      <br />
    </>
  );
};

export default Home;
