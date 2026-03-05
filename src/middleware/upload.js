import multer from "multer";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// design upload storage and filter
const designStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/designs/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const DESIGN_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"];

const designFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (DESIGN_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for designs"), false);
  }
};

export const uploadDesign = multer({
  storage: designStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: designFileFilter,
});
