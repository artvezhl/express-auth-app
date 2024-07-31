import express from "express";
import { validateEnv } from "./utils";
import { errorMiddleware } from "./middlewares";

const auth = require("./routers/auth");
const user = require("./routers/user");

validateEnv();

const app = express();
const port = process.env.PORT ?? 8000;

app.use(express.json());

//calling Database function
require("./config/db").connect();

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
