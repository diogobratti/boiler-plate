const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, "./data/uploads"),
  filename: (req, file, callback) =>
    callback(null, file.fieldname + "-" + Date.now()),
});
const upload = multer({ storage: storage });
module.exports = upload;
