import React from "react";

const LocalSearch = ({ keyword, setKeyword, placeholder }) => {
  const handleSearchChange = (event) => {
    event.preventDefault();
    setKeyword(event.target.value.toLowerCase());
  };

  return (
    <input
      type="search"
      placeholder={placeholder}
      value={keyword}
      onChange={handleSearchChange}
      className="form-control mb-4"
    />
  );
};

export default LocalSearch;
