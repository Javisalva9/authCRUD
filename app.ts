import * as dotenv from "dotenv";
import * as cors from "cors";
import * as express from "express";
import { connectToDatabase } from "./config/database";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";
dotenv.config();
const { API_PORT, ALLOWED_ORIGINS } = process.env;
const port = process.env.PORT || API_PORT;
const origins = process.env.ALLOWED_ORIGINS.split['\;'] || ALLOWED_ORIGINS.split['\;'];

connectToDatabase()
	.then(() => {
		const app = express();
		
		app.use(cors({ origins: origins }));

		// start the Express server
		app.listen(port, () => {
			console.log(`Server running at http://localhost:${port}`);

			app.use("/users", userRouter);
			app.use("/products", productRouter);

		});

	})
	.catch(error => console.error(error));