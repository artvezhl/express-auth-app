import express from "express";

import { getUsers, updateAvatar, updateUser } from "../controllers/user";
import { authenticate } from "../middlewares";
import { AuthorizedRequest } from "../types";
import { UserAvatarUpdateDTO, UserUpdateDTO } from "../dto";

const router = express.Router();

router.get("/", authenticate, getUsers);
router.patch("/update", authenticate, (req, res, next) =>
  updateUser(req as AuthorizedRequest<UserUpdateDTO>, res, next)
);
router.patch("/update-avatar", authenticate, (req, res, next) =>
  updateAvatar(req as AuthorizedRequest<UserAvatarUpdateDTO>, res, next)
);

module.exports = router;
