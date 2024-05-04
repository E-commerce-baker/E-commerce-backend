const multer = require("multer");
const sharp = require("sharp");
const uuid = require("uuid").v4;
const asyncHandler = require("express-async-handler");

const { ErrorHandler } = require("../utils/errorHandler");

const multerOPtions = () => {
  // // multer disk Stor
  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: (req, file, cb) => {
  //     // category-uuid()-Date.new().ext
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `category-${uuid()}-${Date.now()}.${ext}`;
  //     // Add image into req.body
  //     req.body.image = filename;
  //     cb(null, filename);
  //   },
  // });

  const fileFilter = (req, file, cb) => {
    const arr = ["image/png", "image/jpg", "image/jpeg"];
    if (arr.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ErrorHandler("Only Image is allowed", 401), false);
    }
  };

  // Memo Stro
  const storage = multer.memoryStorage();

  return multer({ storage: storage, fileFilter: fileFilter });
};

exports.uploadSingleImage = (fileName) => multerOPtions().single(fileName);

exports.uploadMixOfImage = (arrOfFields) => multerOPtions().fields(arrOfFields);

exports.resizeImage = (arr) =>
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `${arr[1]}-${uuid()}-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .toFormat(arr[2])
        .resize(arr[3], arr[4])
        .jpeg({ quality: arr[5] })
        .toFile(`uploads/${arr[0]}/${filename}`);
      // save image into req.body
      if (arr[0] === "users") {
        req.body.profileImage = `${process.env.HOST}/${arr[0]}/${filename}`;
      } else {
        req.body.image = `${process.env.HOST}/${arr[0]}/${filename}`;
      }
      // console.log(JSON.stringify(arr));
    }
    next();
  });

exports.resizeMixOfImage = (arr) =>
  asyncHandler(async (req, res, next) => {
    // console.log(req.files);
    if (req.files.imageCover) {
      const filename = `${arr[0]}-cover-${uuid()}-${Date.now()}.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .toFormat("jpeg")
        .resize(2000, 1333)
        .jpeg({ quality: 95 })
        .toFile(`uploads/${arr[0]}/${filename}`);
      // save image into req.body
      req.body.imageCover = `${process.env.HOST}/${arr[0]}/${filename}`;
    }
    if (req.files.images) {
      req.body.images = [];

      await Promise.all(
        req.files.images.map(async (image, index) => {
          let filename = `${arr[0]}-${index + 1}-${uuid()}-${Date.now()}.jpeg`;
          await sharp(image.buffer)
            .toFormat("jpeg")
            .resize(800, 700)
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${filename}`);
          // save image into req.body
          filename = `${process.env.HOST}/${arr[0]}/${filename}`;
          req.body.images.push(filename);
        })
      );
    }
    next();
  });
