import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/userExceptions";
import { User } from "../models";
import { plainToClass } from "class-transformer";
import { UserResponseDTO } from "../dto";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.header("Authorization");
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    next(new UnauthorizedException());
  }
  try {
    const token = (authorizationHeader as string).replace("Bearer ", "");
    const secret: string = process.env.JWT_SECRET as string;

    const decodedToken = jwt.verify(token, secret);

    if (typeof decodedToken == "object" && "_id" in decodedToken) {
      const { _id } = decodedToken;
      const user = await User.findById(_id);
      const userData = plainToClass(UserResponseDTO, user, {
        excludeExtraneousValues: true,
      });
      (req as any).user = userData;
    }

    next();
  } catch (error: any) {
    console.error("Error authenticating user:", error);
    next(new UnauthorizedException());
  }
};
