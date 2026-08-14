import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    if (file.mimetype === "application/pdf") {
      return cb(null, true);
    }

    return cb(
      new Error("Only PDF files are allowed for resumes"),
      false
    );
  }

  if (file.fieldname === "profilePhoto") {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPG, JPEG and PNG images are allowed"
      ),
      false
    );
  }

  cb(new Error("Invalid file field"), false);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;