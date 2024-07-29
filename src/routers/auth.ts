import express from "express";

import { login, register } from "../controllers/auth";
import {
  validateUserRegister,
  validateUserLogin,
} from "../middlewares/userValidation";

const router = express.Router();

router.post("/register", validateUserRegister, register);

router.post("/login", validateUserLogin, login);

module.exports = router;
