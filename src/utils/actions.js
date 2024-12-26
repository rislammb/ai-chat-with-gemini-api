import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const interactWithAI = async (history, message) => {
    const model = genAI.getGenerativeModel({model: "gemini-pro"});

    const chat = model.startChat({history});

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
}
