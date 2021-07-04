import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import SearchActionTypes from "../../reducers/search/search-action-types";

const SearchBox = () => {
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;
  let dispatch = useDispatch();
  const history = useHistory();

  const handleChange = (e) => {
    // console.log(text);
    dispatch({
      type: SearchActionTypes.SEARCH_QUERY,
      payload: { text: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/shop/?${text}`);
  };

  return (
    <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
      <input
        type="search"
        value={text}
        onChange={handleChange}
        className="form-control mr-sm-2 input-lg"
        placeholder="Search for your favorite products"
        style={{ width: "250px" }}
      />
      <SearchOutlined onClick={handleSubmit} style={{ cursor: "pointer" }} />
    </form>
  );
};

export default SearchBox;
