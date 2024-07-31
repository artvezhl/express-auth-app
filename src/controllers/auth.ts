import { NextFunction, Request, Response } from "express";
const bcrypt = require("bcrypt");

import { User } from "../models";
import { AuthorizedRequest, EResponseStatus, IResponse, IUser } from "../types";
import { TOKEN_EXPIRATION, userErrors, userMessages } from "../constants";
import { createJWTToken, isUserExist } from "../utils";
import {
  NotValidException,
  UnauthorizedException,
  UserNotFoundException,
} from "../exceptions/userExceptions";
import { plainToClass, plainToInstance } from "class-transformer";
import {
  UserCreateDTO,
  UserLoginDTO,
  UserPasswordUpdateDTO,
  UserResponseDTO,
} from "../dto";

export const register = async (
  req: Request<{}, {}, UserCreateDTO>,
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
  req: Request<{}, {}, UserLoginDTO>,
  res: Response<IResponse<UserResponseDTO>>,
  next: NextFunction
) => {
  try {
    const { email, password: bodyPassword } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      const token = await createJWTToken(user, bodyPassword);
      if (!token) {
        next(
          new UnauthorizedException(userErrors.INVALID_EMAIL_OR_PASSWORD_ERROR)
        );
      }
      res.setHeader("Set-Cookie", [
        `Authorization=Bearer ${token}; HttpOnly; Max-Age=${TOKEN_EXPIRATION}`,
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
      next(
        new UnauthorizedException(userErrors.INVALID_EMAIL_OR_PASSWORD_ERROR)
      );
    }
  } catch (error: any) {
    console.error("Error login user:", error);
    next(error);
  }
};

export const updatePassword = async (
  req: AuthorizedRequest<UserPasswordUpdateDTO>,
  res: Response<IResponse<UserResponseDTO>>,
  next: NextFunction
) => {
  const user = req.user as UserResponseDTO;
  const { new_password, prev_password } = req.body;

  try {
    const dbUser = await User.findOne({ _id: user.id });
    if (dbUser) {
      const isNewPasswordSame = await bcrypt.compare(
        new_password,
        dbUser.password
      );
      if (isNewPasswordSame) {
        next(new NotValidException(userErrors.PASSWORD_SAME));
        return;
      }
      const token = await createJWTToken(dbUser, prev_password);
      if (!token) {
        next(
          new UnauthorizedException(userErrors.INVALID_EMAIL_OR_PASSWORD_ERROR)
        );
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(new_password, salt);

      const updatedUser = await User.findOneAndUpdate(
        { _id: user.id },
        { password: newHashedPassword },
        {
          new: true,
        }
      );
      res.setHeader("Set-Cookie", [
        `Authorization=Bearer ${token}; HttpOnly; Max-Age=${TOKEN_EXPIRATION}`,
      ]);
      const data = plainToInstance(UserResponseDTO, updatedUser, {
        excludeExtraneousValues: true,
      });

      res.status(200).json({
        status: EResponseStatus.OK,
        message: userMessages.PASSWORD_UPDATE,
        data,
      });
    } else {
      next(new UserNotFoundException());
    }
  } catch (error: any) {
    console.error("Error login user:", error);
    next(error);
  }
};
