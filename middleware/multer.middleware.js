import multer from "multer";
const { v4: uuidv4 } = require("uuid");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/tmp')
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4() + "-" + file.originalname;
      cb(null, uniqueName);
    }
  })
  
  const upload = multer({ storage })