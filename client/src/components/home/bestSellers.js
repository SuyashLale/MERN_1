import React, { useEffect, useState } from "react";
import {
  getProductsSorted,
  getProductCount,
} from "../../functions/product.functions";
import ProductCard from "../../components/cards/ProductCard";
import LoadingCard from "../../components/loadingCard";
import { Pagination } from "antd";
import { toast } from "react-toastify";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  /**
   * Load all products
   */
  const loadAllProductsByCount = () => {
    setLoading(true);
    getProductsSorted("sold", "desc", pageNumber)
      .then((res) => {
        // console.log(res.data)
        setLoading(false);
        setProducts(res.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error in getProductsByCount(): ", error);
      });
  };

  useEffect(() => {
    loadAllProductsByCount();
  }, [pageNumber]);

  useEffect(() => {
    getProductCount()
      .then((res) => {
        setProductsCount(res.data);
      })
      .catch((error) => {
        console.log("Error in getProductsCount(): ", error);
        toast.error(
          "Could not get the total product count from the server. " +
            error.message
        );
      });
  }, []);

  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCard count={3} />
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="row">
        <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
          <Pagination
            current={pageNumber}
            total={(productsCount / 3) * 10} // We want to show 3 products in 1 page.
            onChange={(value) => setPageNumber(value)}
          />
        </nav>
      </div>
    </>
  );
};

export default BestSellers;
