import * as express from "express";
import { verifyToken } from "../middleware/authentication";
import { checkProductOwnership } from "../middleware/authorization";

const productsController = require("../controllers/product")

export const productRouter = express.Router();
productRouter.use(express.json());

productRouter.get("/", productsController.getAll);

productRouter.get("/:id", productsController.getById);

productRouter.post("/", verifyToken(), productsController.create);

productRouter.put("/:id", verifyToken(), checkProductOwnership, productsController.update);

productRouter.delete("/:id", verifyToken(), checkProductOwnership, productsController.deleteProduct);