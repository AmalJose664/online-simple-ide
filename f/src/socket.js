import {io} from "socket.io-client"

const socket = io("https://9000-cs-278630592621-default.cs-asia-southeast1-bool.cloudshell.dev/",{
      transports: ['websocket', 'polling'], 
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
        
      }})
export default socket

