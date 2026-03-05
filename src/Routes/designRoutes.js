import express from "express";
import multer from "multer";
import { uploadDesign, getAllDesigns, getMyDesigns, downloadDesign, deleteDesign, updateDesign } from "../Controller/designController.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/designs/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("file"), uploadDesign);
router.get("/", getAllDesigns);
router.get("/my", getMyDesigns);
router.get("/download/:id", downloadDesign);
router.delete("/:id", deleteDesign);
router.put("/:id", updateDesign);

export default router;