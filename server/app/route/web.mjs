import  express from "express";
import { openai } from "../configuration/config.mjs";
const Router = express.Router();

Router.get("/",(req,res)=>{
    res.status(200).json({
        "message" : "Hello , from GhosT !"
    });
});

Router.post("/",async (req,res)=>{
    try{
        const prompt = req.body.prompt;
        console.log(prompt)
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        res.status(200).json({
            bot : response.data.choices[0].text
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            error
        })
    }
});

export const InitRoutes = (app) => {
    app.use(Router);
} 