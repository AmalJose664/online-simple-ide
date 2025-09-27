import http from "http"
import express from "express"
import {Server as SocketServer} from "socket.io"
import pty from "node-pty"
import cors from "cors"
import { generateFileTree } from "./utils/func.js"
import chokidar from "chokidar"
import fs  from "fs"

const app =express()

app.use((req, res, next) => {
    console.log(">>>>",req.path);
    next();
});
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://5173-cs-278630592621-default.cs-asia-southeast1-bool.cloudshell.dev');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
})
chokidar.watch("./user").on("all", (event, path)=>{
    io.emit("file:refresh", path)
})


app.use(express.json());

const server = http.createServer(app)

const ptyProcess = pty.spawn("bash", [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: '/home/amal446446/ide/b/user/',
    env: process.env
})


const io = new SocketServer({
	cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:5173", 
            "https://5173-cs-278630592621-default.cs-asia-southeast1-bool.cloudshell.dev/",
        ],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
})

io.attach(server)




app.get("/", (req, res)=>{
    res.json({message: "ok..."})
})


app.get("/files", async(req, res)=>{
    const fileTree = await generateFileTree("./user")
    return res.json({tree: fileTree})
})

app.get("/files/content", async(req, res)=>{
    const path = req.query.path
    await fs.readFile(`./user${path}`, "utf-8",(err, data)=>{
        console.log(path, err, data);
        if(err){
            return res.status(404).json({error: "File not found"})
        }
        return res.json({content: data})
    })
})





io.on("connection", (socket) => {
  console.log("Socket connected hihi", socket.id);

  socket.on("file:change", (data)=>{
    fs.writeFile(`./user${data.path}`, data.content, ()=>{})
  })

  socket.on("terminal:write", (data) => {
    console.log("executing data", data);
    // const command = data.endsWith('\n') ? data : data + '\n';
    if(data){
      ptyProcess.write(data);
    }
  });
});

ptyProcess.onData((data)=>{
    console.log("data from terminal sending....");
    io.emit("terminal:data", data)
})
server.listen(9000, ()=>{
	console.log("Running 🎉🎉 .....")
})