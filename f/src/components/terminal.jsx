import {Terminal as XTerminal} from "@xterm/xterm"
import { useEffect, useRef } from "react"

import {} from "@xterm/xterm/css/xterm.css"
import socket from "../socket"

export const Terminal = ()=>{
    
    const terminalRef = useRef()
    const isRendered = useRef(false)
    useEffect(()=>{
        if(isRendered.current){return}
        isRendered.current = false

        const term = new XTerminal({
            rows: 20
        })
        term.open(terminalRef.current)

        term.onData(data=>{
            console.log("Data receive ",data);
            if(data){
                socket.emit("terminal:write", data)
            }
        })
        socket.on("terminal:data", (data)=>{
            console.log("socket receive frontend");
            term.write(data)
        })

        return ()=>{
            socket.off("terminal:data")
        }
    }, [])
    return (
        <div id="terminal" ref={terminalRef}>

        </div>
    )
}