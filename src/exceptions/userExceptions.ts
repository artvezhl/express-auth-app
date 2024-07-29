import { userErrors } from "../constants";
import HttpException from "./HttpException";

export class UserCreateException extends HttpException {
  constructor(error?: string) {
    super(500, error ?? userErrors.REGISTER_ERROR);
  }
}

export class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, userErrors.INVALID_EMAIL_OR_PASSWORD_ERROR);
  }
}
