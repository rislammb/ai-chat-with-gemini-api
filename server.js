const PORT = 8000;
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import log from "eslint-plugin-react/lib/util/log.js";
// import('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyDAzugFCychYu2hYIcunEU12BxiT88Q4Us");

app.post("/gemini", async (req, res) => {
    console.log(req.body.history);
    console.log(req.body.message);
})

app.listen(PORT, () => log(`Server listening on port ${PORT}`));