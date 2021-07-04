import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getSubCategories } from "../../functions/sub-category.functions";
import { SyncOutlined } from "@ant-design/icons";
import { Button } from "antd";

const SubCategoryList = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubCategories()
      .then((c) => {
        setLoading(false);
        // console.log("API Response ", c);
        setSubCategories(c.data);
      })
      .catch((error) => {
        setLoading(false);
        // console.log("Error in getSubCategories(): ", error);
        toast.error(
          "Could not get all sub-categories from the DB. " + error.message
        );
      });
  }, []);

  const displaySubCategories = () =>
    subCategories.map((subCategory) => (
      <Button
        key={subCategory._id}
        className="col btn btn-raised btn-outline-primary m-3"
        shape="round"
        size="middle"
      >
        <Link to={`/sub-category/${subCategory.slug}`}>{subCategory.name}</Link>
      </Button>
    ));

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <SyncOutlined spin className="text-warning" />
        ) : (
          displaySubCategories()
        )}
      </div>
    </div>
  );
};

export default SubCategoryList;
