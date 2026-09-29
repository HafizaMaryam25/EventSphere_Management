import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  try {
    const mimetype = file.mimetype?.toLowerCase() || "";
    const originalName = file.originalname?.toLowerCase() || "";

    const isImage =
      mimetype.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|jfif|pjpeg)$/i.test(originalName);

    const isPdf =
      mimetype === "application/pdf" ||
      /\.pdf$/i.test(originalName);

    if (isImage || isPdf) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Only images and PDFs are allowed.`
        ),
        false
      );
    }
  } catch (error) {
    cb(error, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 31,
  },
});