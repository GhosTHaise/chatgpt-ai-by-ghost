import  express from "express";
const Router = express.Router();

Router.get("/",(req,res)=>{
    res.status(200).json({
        "message" : "Hello , from GhosT !"
    });
});

Router.post("/",async (req,res)=>{
    
})

export const InitRoutes = (app) => {
    app.use(Router);
} 