import React from "react";
import { Button } from "antd";

const CategoryForm = ({ handleSubmit, name, setName, loading, buttonText }) => {
  return (
    <form>
      <div className="form-group">
        <label>Name</label>
        <input
          className="form-control mb-4"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </div>
      {loading ? (
        <p className="text-secondary">Loading...</p>
      ) : (
        <Button
          onClick={handleSubmit}
          disabled={!name}
          className="btn btn-outline-primary"
          loading={loading}
          shape="round"
          size="middle"
        >
          {buttonText}
        </Button>
      )}
    </form>
  );
};

export default CategoryForm;
