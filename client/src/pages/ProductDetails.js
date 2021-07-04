import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getProductBySlug,
  updateProductStarRating,
  getRelatedProducts,
} from "../functions/product.functions";
import SingleProduct from "../components/cards/SingleProduct";
import { useSelector } from "react-redux";
import ProductCard from "../components/cards/ProductCard";

const ProductDetails = ({ match }) => {
  const [product, setProduct] = useState({});
  const [starRating, setStarRating] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { slug } = match.params;
  const { user } = useSelector((state) => ({ ...state }));

  const loadProductDetails = () => {
    getProductBySlug(slug)
      .then((res) => {
        setProduct(res.data);
        //Load Related Products
        getRelatedProducts(res.data._id)
          .then((response) => setRelatedProducts(response.data))
          .catch((error) => {
            console.log("Error in getRelatedProducts(): ", error);
            toast.error("Problem loading related products. " + error.message);
          });
      })
      .catch((error) => {
        console.log("Error in loadProductDetails(): ", error);
        toast.error("Could not get product details: " + error.messge);
      });
  };

  useEffect(() => {
    loadProductDetails();
  }, [slug]);

  /**
   * Populate the user's rating from the DB
   */
  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (rating) => rating.postedBy.toString() === user._id.toString()
      );
      if (existingRatingObject) {
        setStarRating(existingRatingObject.star);
      } else {
        setStarRating(0);
      }
    }
  }, [product.ratings, user]);

  const onRatingClick = (newRating, productId) => {
    // console.table(newRating, productId);
    setStarRating(newRating);
    updateProductStarRating(productId, newRating, user.token)
      .then((res) => {
        // console.log(res.data);
        loadProductDetails(); // This is to show the rating update in real time.
      })
      .catch((error) => {
        console.log("Error in updateProductStarRating(): ", error);
        toast.error(
          "Problem updating the rating on the product. " + error.message
        );
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <SingleProduct
          product={product}
          onRatingClick={onRatingClick}
          starRating={starRating}
        />
      </div>
      <div className="row p-5">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
      <div className="row pb-5">
        {relatedProducts.length ? (
          relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct._id} className="col-md-4">
              <ProductCard product={relatedProduct} />
            </div>
          ))
        ) : (
          <h4 className="text-center text-warning col">
            No Related Products found
          </h4>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
