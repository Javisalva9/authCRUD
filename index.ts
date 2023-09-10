import dotenv from "dotenv";
import { connectToDatabase } from "./config/database";
import fs from 'fs';
import https from 'https';
const { API_PORT, HTTPS_PORT } = process.env;
const port = process.env.PORT || API_PORT;
dotenv.config();

const app = require('./app')

// start the Express server
/* app.listen(port, async () => {
	try {
	console.log(`Server running at https://localhost:${port}`);

		await connectToDatabase();
	} catch (error) {
		console.log(error)
	}
}); */


const server = https.createServer({
	cert: fs.readFileSync('certificate.crt'),
	key: fs.readFileSync('privateKey.key')
}, app).listen(HTTPS_PORT, async function () {
	console.log(`Server running at https://localhost:${HTTPS_PORT}`);

	try {
		await connectToDatabase();
	} catch (error) {
		console.log(error)
	}
});
