import express from "express";
import { verifyToken } from "../middleware/auth";
const userController = require('../controllers/user')

export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/register", userController.register);

userRouter.post("/login", userController.login);

userRouter.put("/:id", verifyToken("admin"), userController.update);

userRouter.delete('/:id', verifyToken('admin'), userController.deleteUser)

userRouter.get('/', verifyToken(), userController.getAll)