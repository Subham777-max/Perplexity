import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectdb from "./src/config/db.js";
import { initSocket } from "./src/sockets/server.socket.js";

const server = http.createServer(app);
initSocket(server);
connectdb();

server.listen(3000,()=>{
    console.log("Server is running at 3000");
})