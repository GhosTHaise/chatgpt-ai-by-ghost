import express from "express"
import { Initialization , openai } from "./configuration/config.js";
import { InitRoutes } from "./route/web.js";

const app = express();
const PORT = 4000 || process.env.PORT_ENV;

//Init my app
Initialization(app);
//Mes routes
InitRoutes(app);
app.listen(
    PORT,
    ()=> console.log(`Your app start on : http://localhost:${PORT}`)
);