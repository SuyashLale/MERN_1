import React from "react";
import StarRating from "react-star-ratings";

export const ShowAverageRating = ({ product }) => {
  if (product && product.ratings) {
    let ratingsArray = product && product.ratings;
    let totalRatingsValues = [];
    let totalNumberOfRatings = ratingsArray.length;

    product.ratings.map((rating) => totalRatingsValues.push(rating.star));
    let totalReduced = totalRatingsValues.reduce(
      (previousValue, nextValue) => previousValue + nextValue,
      0
    );
    let averageRating = totalReduced / totalNumberOfRatings;
    // console.log(averageRating);
    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRating
            rating={averageRating}
            starDimension="20px"
            starSpacing="2px"
            starRatedColor="red"
            editing={false}
          />{" "}
          ({product.ratings.length})
        </span>
      </div>
    );
  }
};
