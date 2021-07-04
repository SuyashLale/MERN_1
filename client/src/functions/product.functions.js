import axios from "axios";

/**
 * Function to create a new product
 */
export const createProduct = async (product, authtoken) => {
  return await axios.post(`${process.env.REACT_APP_API}/product`, product, {
    headers: {
      authtoken,
    },
  });
};

/**
 * Function to get all products..'n' products at a time.
 * 'n' = count.
 */
export const getProductsByCount = async (count) => {
  return await axios.get(`${process.env.REACT_APP_API}/products/${count}`);
};

/**
 * Function to delete a product
 */
export const deleteProduct = async (slug, authtoken) => {
  return await axios.delete(`${process.env.REACT_APP_API}/product/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

/**
 * Get a product based on the slug
 */
export const getProductBySlug = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/product/${slug}`);
};

/**
 * Update a product based on the slug
 */
export const updateProduct = async (slug, product, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/product/${slug}`,
    product,
    {
      headers: {
        authtoken,
      },
    }
  );
};

/**
 * Get sorted list of products
 */
export const getProductsSorted = async (sort, order, page) => {
  return axios.post(`${process.env.REACT_APP_API}/products`, {
    sort,
    order,
    page,
  });
};

/**
 * Get the #Products
 */
export const getProductCount = async () => {
  return axios.get(`${process.env.REACT_APP_API}/products/total`);
};

/**
 * Update the star rating on the product
 */
export const updateProductStarRating = async (
  productId,
  starRating,
  authtoken
) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/product/star/${productId}`,
    { starRating },
    {
      headers: {
        authtoken,
      },
    }
  );
};

/**
 * Get the Related Products
 */
export const getRelatedProducts = async (productId) => {
  return axios.get(`${process.env.REACT_APP_API}/product/related/${productId}`);
};

/**
 * Get the Products based on Search Token (GlobalSearch)
 */
export const getProductsBasedOnSearchToken = async (arg) => {
  return axios.post(`${process.env.REACT_APP_API}/search/filters`, arg);
};
