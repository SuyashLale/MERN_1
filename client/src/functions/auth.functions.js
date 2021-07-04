import axios from "axios";

/**
 * Function to send the user Auth token
 * from the front end to the node back end.
 */
export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/create-or-update-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

/**
 * Function to get the current-user from the backend.
 */
export const getCurrentUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/current-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

/**
 * Function to hit the /admin endpoint,
 * to check whether the user has an ADMIN role.
 */
export const getAdminUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/admin`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};
