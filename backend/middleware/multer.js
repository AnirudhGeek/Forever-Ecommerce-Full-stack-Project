import multer from "multer";

//creating storage configuration
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

//using this diskstorage we will create one upload middleware
const upload = multer({ storage });

export default upload;