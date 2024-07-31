import { Request } from "express";
import { UserResponseDTO } from "../dto";

export interface AuthorizedRequest<T> extends Request<{}, {}, T> {
  user: UserResponseDTO;
}
