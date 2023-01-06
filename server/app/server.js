import express from "express"
import { Initialization} from "./configuration/config.mjs";
import { InitRoutes } from "./route/web.mjs";
import * as dotenv from "dotenv"

dotenv.config();
const app = express();
const PORT =  5000;

//Init my app
Initialization(app);
//Mes routes
InitRoutes(app);
app.listen(
    PORT,
    ()=> console.log(`Server start on : http://localhost:${PORT}`)
);