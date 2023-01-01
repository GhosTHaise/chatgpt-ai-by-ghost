import  express from "express";
const Router = express.Router();

Router.get("/",(req,res)=>{

});

Router.post("/",(req,res)=>{

})

export const InitRoutes = (app) => {
    app.use(Router);
} 