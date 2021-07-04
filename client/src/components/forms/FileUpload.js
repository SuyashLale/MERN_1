import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const FileUpload = ({ values, setValues, setLoading }) => {
  const { user } = useSelector((state) => ({ ...state }));

  /**
   * resize file, send to server and upload to cloudinary.
   * Set the URLs gotten from clodinary in the images[] state variable
   */
  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let alreadyUploadedFiles = values.images;
    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            // console.log(uri);
            axios
              .post(
                `${process.env.REACT_APP_API}/upload-images`,
                { image: uri },
                {
                  headers: {
                    authtoken: user ? user.token : "",
                  },
                }
              )
              .then((res) => {
                setLoading(false);
                // console.log("IMAGE_UPLOAD_RESPONSE: ", res);
                alreadyUploadedFiles.push(res.data);
                setValues({ ...values, images: alreadyUploadedFiles });
              })
              .catch((error) => {
                setLoading(false);
                console.log("UPLOAD_IMAGE_RESPONSE_ERROR: ", error);
              });
          },
          "base64"
        );
      }
    }
  };

  const handleImageRemove = (id) => {
    setLoading(true);
    // console.log("Image ID: ", id);
    axios
      .post(
        `${process.env.REACT_APP_API}/remove-image`,
        { public_id: id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        const { images } = values;
        const filteredImages = images.filter((image) => image.public_id !== id);
        setValues({ ...values, images: filteredImages });
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error Deleting Image: ", error);
      });
  };

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Badge
              count="X"
              title="Remove"
              key={image.public_id}
              onClick={() => handleImageRemove(image.public_id)}
              style={{ cursor: "pointer" }}
            >
              <Avatar
                src={image.url}
                size={100}
                shape="square"
                className="ml-3 mb-3"
              />
            </Badge>
          ))}
      </div>
      <div className="row">
        <label className="btn btn-sm btn-raised btn-primary">
          Upload Product Images
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};
export default FileUpload;
