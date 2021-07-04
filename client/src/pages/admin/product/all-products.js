import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount } from "../../../functions/product.functions";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import { deleteProduct } from "../../../functions/product.functions";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  /**
   * Fetch all the products when component mounts.
   * Set the state after.
   */
  const loadAllProductsByCount = () => {
    setLoading(true);
    getProductsByCount(100)
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

  /**
   * Handle Deleting a product
   */
  const handleDelete = (slug) => {
    if (window.confirm("Delete product?")) {
      // console.log("send delete request - ", slug);
      deleteProduct(slug, user.token)
        .then((res) => {
          loadAllProductsByCount();
          toast.success(`Successfully deleted product: "${res.data.title}"`);
        })
        .catch((error) => {
          console.log("Deleteing Product failed: ", error);
          toast.error("Could not delete the product - " + error.message);
        });
    }
  };

  useEffect(() => {
    loadAllProductsByCount();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-warning">Loading..</h4>
          ) : (
            <h4>All Products</h4>
          )}

          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 pb-3">
                <AdminProductCard
                  product={product}
                  handleDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
