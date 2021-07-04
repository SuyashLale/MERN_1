import SearchActionTypes from "./search-action-types";

const SearchReducer = (state = { text: "" }, action) => {
  switch (action.type) {
    case SearchActionTypes.SEARCH_QUERY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default SearchReducer;
