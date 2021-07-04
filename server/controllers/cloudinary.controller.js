/**
 * Import 3rd party modules.
 */
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload Images to cloudinary.
 * The upload() function takes the actual image file as an arg,
 * which is sent from the front end in the req body.
 * The response conatains the Secure URL from cloudinary to be
 * sent back to the front end.
 */
exports.uploadImages = async (req, res) => {
  let result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`, // Unique name
    resource_type: "auto", // JPEG, PNG, etc..
  });
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};

/**
 * Remove image.
 * To remove, we need the public ID of the image.
 * This is sent by the front end as part of the req body.
 */
exports.removeImage = (req, res) => {
  let image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error)
      return res.json({
        success: false,
        error: error.message,
      });
    res.send("Ok");
  });
};
