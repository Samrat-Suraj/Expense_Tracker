import { Request, Response } from "express";
import Balance from "../model/balance.model";
import { User } from "../model/user.model";


export const addBalance = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        let user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        let { amount, incomeSource } = req.body;
        if (!amount || !incomeSource) {
            return res.status(400).json({ success: false, message: "All Fields Are Required" });
        }


        let amt = Number(amount);
        if (isNaN(amt) || amt <= 0) {
            return res.status(400).json({ success: false, message: "Amount must be a positive number" });
        }

        let existingBalance = await Balance.findOne({ userId })
        if (existingBalance?.incomeSource === incomeSource) {
            user.totalBalance += amt
            await user.save();
        } else {
            let newBalance = new Balance({
                userId,
                amount: amt,
                incomeSource
            });
            user.totalBalance += amt
            await user.save();
            await newBalance.save();
        }

        return res.status(200).json({ success: true, message: "Balance Added Successfully" });
    } catch (error: any) {
        console.log("Error In AddBalance controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getTotalBalance = async (req: Request, res: Response) => {
    try {
        let balance = await User.findOne({ _id: (req.user as any)?._id }, { totalBalance: 1 });
        if (!balance) {
            return res.status(404).json({ success: false, message: "Balance Not Found" })
        }
        return res.status(200).json({ success: true, balance })
    } catch (error: any) {
        console.log("Error In getTotalBalance controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getRecentBalance = async (req: Request, res: Response) => {
    try {
        let balance = await Balance.find({ userId: (req.user as any)?._id }).sort({ createdAt: -1 }).limit(3);
        if (!balance) {
            return res.status(404).json({ success: false, message: "Recent Balance Not Found" })
        }
        return res.status(200).json({ success: true, balance })
    } catch (error: any) {
        console.log("Error In getRecentBalance controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
