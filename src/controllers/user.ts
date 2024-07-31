import { NextFunction, Request, Response } from "express";

import { User } from "../models";
import { AuthorizedRequest, EResponseStatus, IResponse } from "../types";
import { userMessages } from "../constants";
import { plainToInstance } from "class-transformer";
import { UserAvatarUpdateDTO, UserResponseDTO, UserUpdateDTO } from "../dto";

export const getUsers = async (
  req: Request,
  res: Response<IResponse<UserResponseDTO[]>>,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    const data = plainToInstance(UserResponseDTO, users, {
      excludeExtraneousValues: true,
    });

    res.status(200).json({
      status: EResponseStatus.OK,
      message: userMessages.SUCCESS_RESPONSE,
      data,
    });
  } catch (error: any) {
    console.error("Error get users:", error);
    next(error);
  }
};

export const updateUser = async (
  req: AuthorizedRequest<UserUpdateDTO>,
  res: Response<IResponse<UserResponseDTO>>,
  next: NextFunction
) => {
  const user = req.user as UserResponseDTO;
  const { name } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user.id },
      { name },
      {
        new: true,
      }
    );
    const data = plainToInstance(UserResponseDTO, updatedUser, {
      excludeExtraneousValues: true,
    });

    res.status(200).json({
      status: EResponseStatus.OK,
      message: userMessages.SUCCESS_UPDATE,
      data,
    });
  } catch (error: any) {
    console.error("Error update user:", error);
    next(error);
  }
};

export const updateAvatar = async (
  req: AuthorizedRequest<UserAvatarUpdateDTO>,
  res: Response<IResponse<UserResponseDTO>>,
  next: NextFunction
) => {
  const user = req.user as UserResponseDTO;
  const { avatar } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user.id },
      { avatar },
      {
        new: true,
      }
    );
    const data = plainToInstance(UserResponseDTO, updatedUser, {
      excludeExtraneousValues: true,
    });

    res.status(200).json({
      status: EResponseStatus.OK,
      message: userMessages.SUCCESS_UPDATE,
      data,
    });
  } catch (error: any) {
    console.error("Error login user:", error);
    next(error);
  }
};
