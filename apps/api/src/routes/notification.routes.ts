import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/async-handler";
import { Notification } from "../models/notification.model";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user!.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ notifications });
  })
);

router.patch(
  "/:notificationId/read",
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, user: req.user!.id },
      { readAt: new Date() },
      { new: true }
    );
    res.json({ notification });
  })
);

router.post(
  "/read-all",
  asyncHandler(async (req, res) => {
    await Notification.updateMany({ user: req.user!.id, readAt: { $exists: false } }, { readAt: new Date() });
    res.status(204).send();
  })
);

export { router as notificationRouter };
