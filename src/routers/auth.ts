import express from "express";

import { login, register, updatePassword } from "../controllers/auth";
import {
  validateUserRegister,
  validateUserLogin,
} from "../middlewares/userValidation";
import { AuthorizedRequest } from "../types";
import { authenticate } from "../middlewares";
import { UserPasswordUpdateDTO } from "../dto";

const router = express.Router();

router.post("/register", validateUserRegister, register);
router.post("/login", validateUserLogin, login);
router.patch("/update-password", authenticate, (req, res, next) =>
  updatePassword(req as AuthorizedRequest<UserPasswordUpdateDTO>, res, next)
);

module.exports = router;
