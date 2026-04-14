import mongoose from "mongoose";
import EnvVars from "./EnvVars";


const mongoDb = async () => {
    try {
        let conn = await mongoose.connect(EnvVars.MONGO_URL as string)
        console.log("MongoDb Connected On" , conn.connection.host)
    } catch (error : any) {
        console.log("Error In MongoDB" , error.message)
        process.exit(1)
    }
}

export default mongoDb