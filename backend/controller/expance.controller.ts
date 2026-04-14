import { Request, Response } from "express";
import DataUri from "../middleware/DataUri";
import cloudinary from "../config/cloudinary";
import Expance from "../model/expance.model";
import Balance from "../model/balance.model";
import { User } from "../model/user.model";

export const createExpance = async (req: Request, res: Response) => {
    try {
        let user = req.user._id;
        let { item, price, expanceCategory, paymentMethod, date, notes } = req.body;
        console.log("Received data in createExpance controller: ", { item, price, expanceCategory, paymentMethod, date, notes });

        if (!item || !price || !expanceCategory || !paymentMethod || !date || !notes) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        let u = await User.findById(req.user._id).select("-password");
        if (!u) {
            return res.status(401).json({ success: false, message: "User not found" });
        }


        if (u.totalBalance < price) {
            return res.status(400).json({ success: false, message: "Insufficient balance" });
        } else {
            u.totalBalance -= price;
            await u.save();
        }

        const image = req.file as Express.Multer.File;
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }


        let file = DataUri(image);
        let cloudinaryResponse = await cloudinary.uploader.upload(file as string);

        let newExpance = new Expance({
            image: cloudinaryResponse.secure_url,
            userId: user,
            item,
            price,
            expanceCategory,
            paymentMethod,
            date: new Date(date),
            notes
        });





        await newExpance.save();

        res.status(201).json({
            success: true,
            message: "Expance created successfully",
            data: newExpance
        });

    } catch (error) {
        console.log("Error in createExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getAllExpances = async (req: Request, res: Response) => {
    try {
        let user = req.user._id;
        let expances = await Expance.find({ userId: user }).sort({ createdAt: -1 });
        if (!expances) {
            return res.status(404).json({
                success: false,
                message: "No expances found for this user"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expances retrieved successfully",
            data: expances
        });

    } catch (error) {
        console.log("Error in getAllExpances controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getExpanceById = async (req: Request, res: Response) => {
    try {
        let expanceId = req.params.id;
        let expance = await Expance.findById(expanceId);
        if (!expance) {
            return res.status(404).json({
                success: false,
                message: "Expance not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expance retrieved successfully",
            data: expance
        });
    } catch (error) {
        console.log("Error in getExpanceById controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const updateExpance = async (req: Request, res: Response) => {
    try {
        let { item, price, expanceCategory, paymentMethod, date, notes } = req.body;
        let expanceId = req.params.id;
        let expance = await Expance.findById(expanceId);
        if (!expance) {
            return res.status(404).json({
                success: false,
                message: "Expance not found"
            });
        }

        const image = req.file as Express.Multer.File;
        if (image) {
            if (expance.image) {
                let oldPublicId = expance.image?.split("/").pop()?.split(".")[0];

                if (oldPublicId) {
                    await cloudinary.uploader.destroy(oldPublicId);
                }

            }

            let file = DataUri(image);
            let cloudinaryResponse = await cloudinary.uploader.upload(file as string);
            expance.image = cloudinaryResponse.secure_url;
        }

        expance.item = item || expance.item;
        expance.price = price || expance.price;
        expance.expanceCategory = expanceCategory || expance.expanceCategory;
        expance.paymentMethod = paymentMethod || expance.paymentMethod;
        expance.date = date ? new Date(date) : expance.date;
        expance.notes = notes || expance.notes;

        await expance.save()
        return res.status(200).json({
            success: true,
            message: "Expance updated successfully",
            data: expance
        });

    } catch (error) {
        console.log("Error in updateExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const deleteExpance = async (req: Request, res: Response) => {
    try {
        let expanceId = req.params.id;
        let expance = await Expance.findById(expanceId);
        if (!expance) {
            return res.status(404).json({
                success: false,
                message: "Expance not found"
            });
        }



        if (expance.image) {
            let oldPublicId = expance.image?.split("/").pop()?.split(".")[0];

            if (oldPublicId) {
                await cloudinary.uploader.destroy(oldPublicId);
            }

        }

        await Expance.findByIdAndDelete(expanceId);
        return res.status(200).json({
            success: true,
            message: "Expance deleted successfully"
        });


    } catch (error) {
        console.log("Error in deleteExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



export const getTotalExpance = async (req: Request, res: Response) => {
    try {
        let user = req.user._id;
        let expances = await Expance.find({ userId: user });
        if (!expances) {
            return res.status(404).json({
                success: false,
                message: "No expances found for this user"
            });
        }

        let total = expances.reduce((sum, expance) => sum + expance.price, 0);

        res.status(200).json({
            success: true,
            message: "Total expance retrieved successfully",
            data: total,
            expances,
        });


    } catch (error) {
        console.log("Error in getTotalExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getMonthlyExpance = async (req: Request, res: Response) => {
    try {
        let user = req.user._id;
        let { month, year } = req.query
        if (!month || !year) {
            return res.status(400).json({ success: false, message: "Month is required and year is required" })
        }

        let expances = await Expance.find({ userId: user });
        if (!expances) {
            return res.status(404).json({
                success: false,
                message: "No expances found for this user"
            });
        }


        // Learning part 
        let monthlyExpances = expances.filter(expance => {
            let expanceDate = new Date(expance.date);
            return expanceDate.getMonth() + 1 === parseInt(month as string) && expanceDate.getFullYear() === parseInt(year as string);
        })

        let total = monthlyExpances.reduce((sum, expance) => sum + expance.price, 0);

        res.status(200).json({
            success: true,
            message: "Monthly expance retrieved successfully",
            data: {
                total,
                expances: monthlyExpances
            }
        });

    } catch (error) {
        console.log("Error in getMonthlyExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const getThisMonthExpance = async (req: Request, res: Response) => {
    try {
        let userId = req.user._id
        let expances = await Expance.find({ userId })
        if (!expances) {
            return res.status(400).json({ success: false, message: "Expance not found" })
        }


        // Learning part   
        let thisMonthExpance = expances.filter((expance) => {
            let expanceData = new Date(expance.date)
            let currentDate = new Date()

            console.log("Expance Date: ", expanceData.getUTCMonth(), expanceData.getFullYear());
            console.log("Current Date: ", currentDate.getUTCMonth(), currentDate.getFullYear());

            return expanceData.getUTCMonth() === currentDate.getUTCMonth() && expanceData.getFullYear() === currentDate.getFullYear()
        })

        let total = thisMonthExpance.reduce((sum, expance) => sum + expance.price, 0)

        res.status(200).json({
            success: true,
            message: "This month expance retrieved successfully",
            data: {
                total,
                expances: thisMonthExpance
            }
        })

    } catch (error) {
        console.log("Error in thisMonthExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const getThisYearExpance = async (req: Request, res: Response) => {
    try {
        let userId = req.user._id
        let expances = await Expance.find({ userId })
        if (!expances) {
            return res.status(400).json({ success: false, message: "Expance not found" })
        }


        // Learning part   
        let thisYearExpance = expances.filter((expance) => {
            let expanceData = new Date(expance.date)
            let currentDate = new Date()
            return expanceData.getFullYear() === currentDate.getFullYear()
        })

        let total = thisYearExpance.reduce((sum, expance) => sum + expance.price, 0)

        res.status(200).json({
            success: true,
            message: "This year expance retrieved successfully",
            data: {
                total,
                expances: thisYearExpance
            }
        })

    } catch (error) {
        console.log("Error in thisYearExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const getTodayExpance = async (req: Request, res: Response) => {
    try {
        let userId = req.user._id
        let expances = await Expance.find({ userId })
        if (!expances) {
            return res.status(400).json({ success: false, message: "Expance not found" })
        }


        // Learning part   
        let todayExpance = expances.filter((expance) => {
            let expanceData = new Date(expance.date)
            let currentDate = new Date()
            return expanceData.getDay() === currentDate.getDay()
        })

        let total = todayExpance.reduce((sum, expance) => sum + expance.price, 0)

        res.status(200).json({
            success: true,
            message: "This year expance retrieved successfully",
            data: {
                total,
                expances: todayExpance
            }
        })

    } catch (error) {
        console.log("Error in getTodayExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}