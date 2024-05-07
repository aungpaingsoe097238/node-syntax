const fs = require("fs");

const uploadFile = (req, res, next, dir_path = "temp") => {
  if (req.files) {
    const files = req.files.file;
    const filename = new Date().valueOf() + "_" + files.name;
    const filePath = `./public/uploads/${dir_path}/${filename}`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(`./public/uploads/${dir_path}`)) {
      fs.mkdirSync(`./public/uploads/${dir_path}`, { recursive: true });
    }

    files.mv(filePath); 
    req.filename = `${req.protocol}://${req.get('host')}/public/uploads/${dir_path}/${filename}`; // API URL with filename
    next();
  } else {
    next();
  }
};

const deleteFile = (filename) => {
  fs.unlinkSync(`./public/uploads/${filename}`);
};

module.exports = { deleteFile, uploadFile };