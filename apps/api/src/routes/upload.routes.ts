import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/async-handler";
import { cloudinary } from "../config/cloudinary";
import { Attachment } from "../models/attachment.model";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

router.use(requireAuth);

router.post(
  "/signature",
  (req, res) => {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: `flowforge/${req.body.workspaceId}`
      },
      cloudinary.config().api_secret ?? "dev"
    );
    res.json({ timestamp, signature, folder: `flowforge/${req.body.workspaceId}` });
  }
);

router.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "File is required" });

    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `flowforge/${req.body.workspaceId}`,
      resource_type: "auto"
    });

    const attachment = await Attachment.create({
      workspace: req.body.workspaceId,
      task: req.body.taskId,
      uploader: req.user!.id,
      url: result.secure_url,
      publicId: result.public_id,
      mimeType: file.mimetype,
      size: file.size,
      kind: file.mimetype.startsWith("audio/") ? "voice-note" : file.mimetype.startsWith("image/") ? "image" : "file"
    });
    res.status(201).json({ attachment });
  })
);

export { router as uploadRouter };
