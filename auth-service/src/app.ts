import express, { Application, Express, Request, Response, NextFunction } from "express";
import router from "./routes/auth.routes";
import { AppError } from "./utils/AppError";
import { errorHandler } from "./middleware/error.middleware";

const app: Application = express()

app.use(express.json())


app.use("/", router);
// error middleware
app.use(errorHandler);

export default app;