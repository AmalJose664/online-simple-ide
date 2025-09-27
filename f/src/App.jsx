import { useEffect, useState } from 'react'
import { Terminal } from './components/terminal'
import AceEditor from "react-ace"


import "./App.css"
import { FileTree } from './components/tree'
import socket from './socket'
import { useCallback } from 'react'






function App() {
  const [selectedFile, setSelectedFile] = useState(0)
  const [selectedFileContent, setSelectedFileContent] = useState("")
  const [code, setCode] = useState("")

  const isSaved = selectedFileContent === code
  const [fileTree, setFileTree] = useState({})


  const getFileTree = async () => {
    // if(fileTree) return
    const response = await fetch('https://9000-cs-278630592621-default.cs-asia-southeast1-bool.cloudshell.dev/files', {
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    const data = await response.json()
    console.log(data, "<<")
    setFileTree(data.tree)
  }

  const getFileContents = useCallback(async () => {
      if (!selectedFile) return
      const response = await fetch("https://9000-cs-278630592621-default.cs-asia-southeast1-bool.cloudshell.dev/files/content?path="+selectedFile, {
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      const result = await response.json()
      setSelectedFileContent(result.content)
    }, [selectedFile])

 

   useEffect(() => {
    getFileTree()
  }, [])
  useEffect(() => {
    socket.on("file:refresh", getFileTree)
    return () => {
      socket.off("file:refresh", getFileTree)
    }
  }, [])

  useEffect(() => {
    if (code && !isSaved) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code
        })
      }, 4 * 1000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [code, selectedFile, isSaved])

  

    useEffect(()=>{
      if(selectedFile && selectedFileContent){
        setCode(selectedFileContent)
      }
    },[selectedFile, selectedFileContent])
  
  useEffect(() => {
    setCode("")
    getFileContents()
  }, [selectedFile])

  return (
    <>
      <div className='playground-container'>

        <div className='editor-container'>
          <div className='files'>
            <FileTree tree={fileTree} onSelect={(path) => setSelectedFile(path)} />
          </div>
          <div className='editor'>
            {selectedFile && <p>{selectedFile.replaceAll("/", " > ")} {isSaved ? "" : "Unsaved"} </p>}
            <AceEditor width='100%' value={code} onChange={e => setCode(e)} />
          </div>
        </div>
        <div className='terminal-container'>
          <Terminal />
        </div>
      </div>
    </>
  )
}

export default App
