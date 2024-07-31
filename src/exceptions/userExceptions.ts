import { userErrors } from "../constants";
import HttpException from "./HttpException";

export class NotValidException extends HttpException {
  constructor(error?: string) {
    super(400, error ?? userErrors.INPUT_DATA_IS_NOT_VALID);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(error?: string) {
    super(401, error ?? "Unauthorized");
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super(404, userErrors.USER_NOT_FOUND);
  }
}

export class UserCreateException extends HttpException {
  constructor(error?: string) {
    super(500, error ?? userErrors.REGISTER_ERROR);
  }
}
