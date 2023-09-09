import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./config/database";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";
import fs from 'fs';
import https from 'https';
const { API_PORT, ALLOWED_ORIGINS, HTTPS_PORT } = process.env;
const port = process.env.PORT || API_PORT;
const origins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(';') : [];
dotenv.config();

connectToDatabase()
	.then(() => {
		const app = express();

		app.use(cors({ origin: origins }));

		// start the Express server
		/* 		app.listen(port, () => {
					console.log(`Server running at http://localhost:${port}`);
		
					app.use("/users", userRouter);
					app.use("/products", productRouter);
		
				}); */


		https.createServer({
			cert: fs.readFileSync('certificate.crt'),
			key: fs.readFileSync('privateKey.key')
		}, app).listen(HTTPS_PORT, function () {
			console.log(`Server running at https://localhost:${HTTPS_PORT}`);

			app.use("/users", userRouter);
			app.use("/products", productRouter);
		});

	})
	.catch(error => console.error(error));