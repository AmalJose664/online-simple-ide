const FileTreeNode = ({fileName, nodes, onSelect, path})=>{
    const isDir = !!nodes
    const fileClick = (e)=>{
            e.stopPropagation()
            if(isDir) return
            onSelect(path)

        }
    return (
        <div onClick={(e)=>fileClick(e)} style={{marginLeft: "20px"}}>
            <p className={!isDir ? "file" : "file-node"}>{fileName}</p>
            {nodes && <ul>
                    {Object.keys(nodes).map((child)=>(
                        <li style={{listStyle: "none", lineHeight: "24px"}}>
                            <FileTreeNode path={path+ "/" + child} fileName={child} nodes={nodes[child]} key={Math.random()} onSelect={onSelect}/>
                        </li>
                    ))}
                </ul>}
        </div>
    )
}
export const FileTree = ({tree, onSelect})=>{
    return (
        <FileTreeNode fileName="/" onSelect={onSelect} path='' nodes={tree}/>
    )
}