import path from "path"
import fs from "fs/promises"

export const generateFileTree = async (directory)=>{
    const tree = {}
    async function buildTree(currentDir, currentTree){
        const files = await fs.readdir(currentDir)
        console.log(files, "<<<")
        
        for(const file of files){
            const filePath = path.join(currentDir, file)
            const stat = await fs.stat(filePath)
 
            if(stat.isDirectory()){
				currentTree[file] = {}
				await buildTree(filePath, currentTree[file])
            }else{
				currentTree[file] = null
			}
        }
    }
	await buildTree(directory, tree)
    console.log(tree, "tree<<<");
    
	return tree
}