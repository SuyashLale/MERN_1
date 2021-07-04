import axios from "axios";

/**
 * Function to get all sub-categories from the DB.
 */
export const getSubCategories = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/sub-categories`);
};

/**
 * Function to get a sub-category from the DB.
 */
export const getSubCategory = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/sub-category/${slug}`);
};

/**
 * Function to delete/remove a sub-category from the DB.
 */
export const deleteSubCategory = async (slug, authtoken) => {
  return await axios.delete(`${process.env.REACT_APP_API}/sub-category/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

/**
 * Function to update a sub-category in the DB.
 * name: is the updated sub-category name.
 */
export const updateSubCategory = async (slug, name, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/sub-category/${slug}`,
    name,
    {
      headers: {
        authtoken,
      },
    }
  );
};

/**
 * Function to create a new sub-category in the DB.
 */
export const createSubCategory = async (name, authtoken) => {
  return await axios.post(`${process.env.REACT_APP_API}/sub-category/`, name, {
    headers: {
      authtoken,
    },
  });
};
