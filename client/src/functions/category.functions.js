import axios from "axios";

/**
 * Function to get all categories from the DB.
 */
export const getCategories = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/categories`);
};

/**
 * Function to get a category from the DB.
 */
export const getCategory = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/category/${slug}`);
};

/**
 * Function to delete/remove a category from the DB.
 */
export const deleteCategory = async (slug, authtoken) => {
  return await axios.delete(`${process.env.REACT_APP_API}/category/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

/**
 * Function to update a category in the DB.
 * name: is the updated category name.
 */
export const updateCategory = async (slug, name, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/category/${slug}`,
    name,
    {
      headers: {
        authtoken,
      },
    }
  );
};

/**
 * Function to create a new category in the DB.
 */
export const createCategory = async (name, authtoken) => {
  return await axios.post(`${process.env.REACT_APP_API}/category/`, name, {
    headers: {
      authtoken,
    },
  });
};

/**
 * Function to get all the sub-categories for a parent category.
 */
export const getAllSubCategories = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/category/sub-categories/${_id}`
  );
};
