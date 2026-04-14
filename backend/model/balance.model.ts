import mongoose from "mongoose";


const balanceSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    amount : {type : Number, required : true},
    incomeSource : {type : String, required : true},
}, {timestamps : true});

const Balance = mongoose.model("Balance", balanceSchema);
export default Balance;