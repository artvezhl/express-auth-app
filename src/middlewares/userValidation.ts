import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { EGender, IUser } from "../types";
import HttpException from "../exceptions/HttpException";

const userSchema = Joi.object<IUser>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  birthDate: Joi.date().required(),
  gender: Joi.string()
    .valid(...Object.values(EGender))
    .required(),
  avatar: Joi.string(),
});

const userLoginSchema = Joi.object<IUser>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validateUserRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    next(new HttpException(400, error.details[0].message));
  } else {
    next();
  }
};

export const validateUserLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    next(new HttpException(400, error.details[0].message));
  } else {
    next();
  }
};
