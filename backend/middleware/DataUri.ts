import path from "path"
import DataURIParser from "datauri/parser"

const parser = new DataURIParser()
const DataUri = (file : any) => {
    
    let extName = path.extname(file.originalname).toString()
    return parser.format(extName , file.buffer).content
}


export default DataUri