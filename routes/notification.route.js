import express from "express";
import { delNotif, getNotif, newNotif } from "../controllers/notification.controller.js";
import { validateRequest } from "../validation/validate.middleware.js";
import { 
    newNotificationSchema, 
    delNotificationSchema 
} from "../validation/notification.validation.js";

const router = express.Router();

router.post("/new", validateRequest(newNotificationSchema), newNotif);
router.post("/deleteLike", validateRequest(delNotificationSchema), delNotif);
router.post("/deleteComment", validateRequest(delNotificationSchema), delNotif);
router.get("/:userId", getNotif);

export default router;
