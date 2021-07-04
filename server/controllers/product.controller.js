/**
 * Import 3rd party Modules
 */
const slugify = require("slugify");

/**
 * Import Models
 */
const Product = require("../models/product.model");
const User = require("../models/user.model");

/**
 * Create a new Product.
 */
exports.createProduct = async (req, res) => {
  try {
    // console.log(req.body);
    req.body.slug = slugify(req.body.title); // Generate the slug from the title and add it to the req body.
    const product = await new Product(req.body).save();
    res.json(product);
  } catch (error) {
    //   console.log(error);
    // res.status(400).send("Create Product failed - " + error.message);
    res.status(400);
    res.json({
      error: error.message,
    });
  }
};

/**
 * Read Product
 */
exports.readProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("subCategories")
      .exec();
    res.json(product);
  } catch (error) {
    // console.log(error.message);
    res.status(400).send("Product update failed - " + error.message);
  }
};

/**
 * Delete Product
 */
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deletedProduct);
  } catch (error) {
    // console.log(error);
    res.status(400).send("Delete Product failed - " + error.message);
  }
};

/**
 * List all Products
 */
exports.listProducts = async (req, res) => {
  try {
    let products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subCategories")
      .sort({ createdAt: -1 })
      .exec();
    res.json(products);
  } catch (error) {
    // console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

/**
 * If dont want to update slug, skip that below.
 */
exports.submitUpdatedProduct = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updatedProduct);
  } catch (error) {
    console.log("Error in submitting updated product details - ", error);
    return res.status(400).send(error.message);
  }
};

// /**
//  * Method gets the sort order, limit in req
//  * This is the non-pagination suported version
//  */
// exports.getProductsSorted = async (req, res) => {
//   try {
//     // sort: Column that needs to be sorted
//     // order: Ascn or Desc
//     // limit: Qty limit
//     const { sort, order, limit } = req.body;
//     const result = await Product.find({})
//       .populate("category")
//       .populate("subCategories")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     return res.json(result);
//   } catch (error) {
//     console.log("Error in getLatestArrivals(): ", error);
//   }
// };

/**
 * Method gets the sort order, limit in req
 * This is the pagination suported version
 */
exports.getProductsSorted = async (req, res) => {
  try {
    // sort: Column that needs to be sorted
    // order: Ascn or Desc
    // page: page number
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const productsPerPage = 3;

    const result = await Product.find({})
      .skip((currentPage - 1) * productsPerPage)
      .populate("category")
      .populate("subCategories")
      .sort([[sort, order]])
      .limit(productsPerPage)
      .exec();
    return res.json(result);
  } catch (error) {
    console.log("Error in getProductsSorted(): ", error);
  }
};

/**
 * Method for getting the #Products from the DB
 */
exports.getProductCount = async (req, res) => {
  try {
    const totalProducts = await Product.find({})
      .estimatedDocumentCount()
      .exec();
    res.json(totalProducts);
  } catch (error) {
    console.log("Error in getProductCount(): ", error);
  }
};

/**
 * Method for updating star-rating on a product
 * 1. Get the product using ID
 * 2. Get the user using the email
 * 3. Star rating comes from the front end in the req body
 * 4. If the logged-in user has already left a rating, then update; else add a new rating
 */
exports.updateProductStarRating = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { starRating } = req.body;

  let existingRatingObject = product.ratings.find(
    (rating) => rating.postedBy.toString() === user._id.toString()
  );

  if (existingRatingObject === undefined) {
    // User has not left a rating for this product yet..
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: {
          ratings: {
            star: starRating,
            postedBy: user._id,
          },
        },
      },
      { new: true }
    ).exec();
    // console.log("RatingAdded-- ", ratingAdded);
    res.json(ratingAdded);
  } else {
    // User has already left a rating and wants to modify it..
    // 1. Find the rating object that belongs to the user.
    // 2. Use the Mongoose update method to update the DB.
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject },
      },
      { $set: { "ratings.$.star": starRating } },
      { new: true }
    ).exec();
    console.log("Rating Updated-- ", ratingUpdated);
    res.json(ratingUpdated);
  }
};

/**
 * Get Related Products.
 * Not including the current product.
 */
exports.getRelatedProducts = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subCategories")
    .populate("postedBy")
    .exec();
  res.json(relatedProducts);
};

/**
 * Method for getting the products based on the search filter params.
 */
exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, subCategory, shipping, color, brand } =
    req.body;

  // Handle Search Query - this is the token sent from the global searchBox
  if (query) {
    // console.log(query);
    await handleQuery(req, res, query);
  }
  // Handle Price Filter.
  // price [n1, n2]
  if (price !== undefined) {
    console.log("price filter --> :", price);
    await handlePrice(req, res, price);
  }

  // Handle Category Based filter
  if (category) {
    console.log("Category filter -->", category);
    await handleCategory(req, res, category);
  }

  // Handle Star Rating based filter
  if (stars) {
    console.log(stars);
    await handleStars(req, res, stars);
  }

  // Handle Subcategory based filter
  if (subCategory) {
    console.log(subCategory);
    await handleSubCategory(req, res, subCategory);
  }

  // Handle Shipping based filter
  if (shipping) {
    console.log(shipping);
    await handleShipping(req, res, shipping);
  }
  // Handle Color based filter
  if (color) {
    console.log(color);
    await handleColor(req, res, color);
  }
  // Handle Brand based filter
  if (brand) {
    console.log(brand);
    await handleBrand(req, res, brand);
  }
};

/**
 * Helpers
 */
/**
 * Handle Search Query
 */
const handleQuery = async (req, res, query) => {
  // Correlate $text with the text property in the Product model.
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subCategories", "_id, name")
    .populate("postedBy", "_id, name")
    .exec();
  res.json(products);
};

/**
 * Handle Price Filter
 */
const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subCategories", "_id, name")
      .populate("postedBy", "_id, name")
      .exec();
    res.json(products);
  } catch (error) {
    console.log("Error in handlePrice(): ", error);
    res.status(400).json({
      error: error.message,
    });
  }
};

/**
 * Handle Category based filtering.
 */
const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subCategories", "_id, name")
      .populate("postedBy", "_id, name")
      .exec();
    res.json(products);
  } catch (error) {
    console.log("Error in HandleCategory() : ", error);
    res.status(400).json({
      error: error.message,
    });
  }
};

/**
 * Handle Star Rating based filtering.
 */
const handleStars = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: {
            $avg: "$ratings.star",
          },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((error, aggregates) => {
      if (error) {
        console.log("Erorr in calculating Aggreagate star rating", error);
        res.json({
          error: error.message,
        });
      } else {
        Product.find({ _id: aggregates })
          .populate("category", "_id name")
          .populate("subCategories", "_id, name")
          .populate("postedBy", "_id, name")
          .exec((error, products) => {
            if (error) {
              console.log("Error: ", error);
              res.json({
                error: error.message,
              });
            } else {
              res.json(products);
            }
          });
      }
    });
};

/**
 * Handle Sub-category based filtering.
 */
const handleSubCategory = async (req, res, subCategory) => {
  try {
    let products = await Product.find({ subCategories: subCategory })
      .populate("category", "_id name")
      .populate("subCategories", "_id, name")
      .populate("postedBy", "_id, name")
      .exec();
    console.log("PRODUCTS:::--> ", products);
    res.json(products);
  } catch (error) {
    console.log("Error in filtering based on SubCategory. ", error);
    res.json({
      error: error,
    });
  }
};

/**
 * Handle Shipping based filtering.
 */
const handleShipping = async (req, res, shipping) => {
  try {
    let products = await Product.find({ shipping })
      .populate("category", "_id name")
      .populate("subCategories", "_id, name")
      .populate("postedBy", "_id, name")
      .exec();
    console.log("PRODUCTS:::--> ", products);
    res.json(products);
  } catch (error) {
    console.log("Error in filtering based on Shipping. ", error);
    res.json({
      error: error,
    });
  }
};

/**
 * Handle Color based filtering.
 */
const handleColor = async (req, res, color) => {
  try {
    let products = await Product.find({ color })
      .populate("category", "_id name")
      .populate("subCategories", "_id, name")
      .populate("postedBy", "_id, name")
      .exec();
    console.log("PRODUCTS:::--> ", products);
    res.json(products);
  } catch (error) {
    console.log("Error in filtering based on Color. ", error);
    res.json({
      error: error,
    });
  }
};

/**
 * Handle Brand based filtering.
 */
const handleBrand = async (req, res, brand) => {
  try {
    let products = await Product.find({ brand })
      .populate("category", "_id name")
      .populate("subCategories", "_id, name")
      .populate("postedBy", "_id, name")
      .exec();
    console.log("PRODUCTS:::--> ", products);
    res.json(products);
  } catch (error) {
    console.log("Error in filtering based on Brand. ", error);
    res.json({
      error: error,
    });
  }
};
