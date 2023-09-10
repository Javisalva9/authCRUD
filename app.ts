import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";
const { ALLOWED_ORIGINS } = process.env;
const origins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(';') : [];
dotenv.config();

const app = express();
app.use(cors({ origin: origins }));

app.use("/users", userRouter);
app.use("/products", productRouter);

module.exports = app;