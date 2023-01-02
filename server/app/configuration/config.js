import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
import {Configuration,OpenAIApi} from "openai"
dotenv.config();
export const Initialization = (app) => {
    app.use(cors());
    app.use(express.json());
}

const configurattion = new Configuration({
    apiKey : process.env.OPENAI_API_KEY
})

export const openai = new OpenAIApi(configurattion);