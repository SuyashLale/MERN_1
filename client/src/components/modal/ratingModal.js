import React, { useState } from "react";
import { Modal, Button } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";

const RatingModal = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  let history = useHistory();
  let { slug } = useParams();

  const handleClick = () => {
    if (user && user.token) {
      setModalVisible(true);
    } else {
      history.push({
        pathname: "/login",
        state: { from: `/product/${slug}` },
      });
    }
  };

  return (
    <>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        <StarOutlined className="text-danger" />
        <br />
        {user ? "Leave a rating" : "Login to leave a rating"}
      </div>
      <Modal
        title={"Leave your rating here"}
        centered
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          toast.success("Thanks for your feedback!");
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        {children}
      </Modal>
    </>
  );
};

export default RatingModal;
