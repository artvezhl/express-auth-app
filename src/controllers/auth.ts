import { NextFunction, Request, Response } from "express";
const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";

import { Types } from "mongoose";
import { User } from "../models";
import {
  DataStoredInToken,
  EResponseStatus,
  IResponse,
  ITokenData,
  IUser,
} from "../types";
import { userErrors, userMessages } from "../constants";
import { isUserExist } from "../utils";
import {
  UserCreateException,
  WrongCredentialsException,
} from "../exceptions/userExceptions";
import { plainToClass } from "class-transformer";
import { UserResponseDTO } from "../dto";

export const register = async (
  req: Request<{}, {}, IUser>,
  res: Response<IResponse<Pick<IUser, "email">>>,
  next: NextFunction
) => {
  try {
    const { email, password, ...otherData } = req.body;

    // Check if the email is already registered
    const userExists = await isUserExist(email);
    if (userExists) {
      return res.status(400).json({
        status: EResponseStatus.ERROR,
        message: userErrors.EMAIL_ALREADY_REGISTERED,
      });
    }

    // Encrypt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new User({ ...otherData, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: EResponseStatus.OK,
      message: userMessages.USER_REGISTERED,
      data: { email },
    });
  } catch (error: any) {
    console.error("Error registering user:", error);
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, Pick<IUser, "email" | "password">>,
  res: Response<IResponse<UserResponseDTO>>,
  next: NextFunction
) => {
  try {
    const { email, password: bodyPassword } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        bodyPassword,
        user.password
      );
      if (isPasswordMatching) {
        const expiresIn = 60 * 60; // an hour
        const secret: string = process.env.JWT_SECRET as string;
        const dataStoredInToken: DataStoredInToken = {
          _id: String(user._id),
        };
        const token = jwt.sign(dataStoredInToken, secret, { expiresIn });
        res.setHeader("Set-Cookie", [
          `Authorization=${token}; HttpOnly; Max-Age=${expiresIn}`,
        ]);
        const data = plainToClass(UserResponseDTO, user, {
          excludeExtraneousValues: true,
        });
        res.status(200).json({
          status: EResponseStatus.OK,
          message: userMessages.USER_LOGED_IN,
          data,
        });
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  } catch (error: any) {
    console.error("Error login user:", error);
    next(error);
  }
};
