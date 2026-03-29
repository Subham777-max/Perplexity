import "dotenv/config";
import app from "./src/app.js";
import connectdb from "./src/config/db.js";

connectdb();

app.listen(3000,()=>{
    console.log("Server is running at 3000");
})