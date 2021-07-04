import React, { useState, useEffect } from "react";
import { getCategory } from "../../functions/category.functions";
import ProductCard from "../../components/cards/ProductCard";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";

const CategoryHome = ({ match }) => {
  const { slug } = match.params;
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategory(slug)
      .then((res) => {
        setLoading(false);
        // console.log(JSON.stringify(res.data, null, 4));
        setCategory(res.data.category);
        setProducts(res.data.products);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error in getCategory(): ", error);
        toast.error("Could not get the Category from the DB: " + error.message);
      });
  }, [slug]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          {loading ? (
            <SyncOutlined
              spin
              className="text-warning text-center p-3 mt-5 mb-3 display-4 jumbotron"
            />
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              {products.length} products found in the "{category.name}" category
            </h4>
          )}
        </div>
      </div>
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryHome;
