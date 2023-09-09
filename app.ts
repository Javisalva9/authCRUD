import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./config/database";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";
const { API_PORT, ALLOWED_ORIGINS } = process.env;
const port = process.env.PORT || API_PORT;
const origins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(';') : [];
dotenv.config();

connectToDatabase()
	.then(() => {
		const app = express();
		
		app.use(cors({ origin: origins }));

		// start the Express server
		app.listen(port, () => {
			console.log(`Server running at http://localhost:${port}`);

			app.use("/users", userRouter);
			app.use("/products", productRouter);

		});

	})
	.catch(error => console.error(error));