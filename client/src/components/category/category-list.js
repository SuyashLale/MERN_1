import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../functions/category.functions";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import { Button } from "antd";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((c) => {
        setLoading(false);
        // console.log("API Response ", c);
        setCategories(c.data);
      })
      .catch((error) => {
        setLoading(false);
        // console.log("Error in getCategories(): ", error);
        toast.error(
          "Could not get all categories from the DB. " + error.message
        );
      });
  }, []);

  const displayCategories = () =>
    categories.map((category) => (
      <Button
        key={category._id}
        className="col btn btn-raised btn-outline-primary m-3"
        shape="round"
        size="middle"
      >
        <Link to={`/category/${category.slug}`}>{category.name}</Link>
      </Button>
    ));

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <SyncOutlined spin className="text-warning" />
        ) : (
          displayCategories()
        )}
      </div>
    </div>
  );
};

export default CategoryList;
