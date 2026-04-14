"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/app/store/api/userApi";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
    const { id } = useParams();
    const router = useRouter();

    const [password, setPassword] = useState("");

    const [
        resetPassword,
        { data, isLoading, error: resetError, isSuccess }
    ] = useResetPasswordMutation();


    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!password) {
            return toast.error("Password is required");
        }

        await resetPassword({newPassword : password , token : id});
    };


    useEffect(() => {
        if (isSuccess && data) {
            toast.success(data.message || "Password Reset Successfully");

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        }

        if (resetError) {
            toast.error((resetError as any)?.data?.message || "Something went wrong");
        }
    }, [isSuccess, data, resetError, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6">
                    <h1 className="text-2xl font-bold text-center text-white mb-6">
                        Reset Your Password
                    </h1>


                    <form onSubmit={handleResetPassword}>
                        <div className="mb-4">
                            <label className="text-gray-400 text-sm mb-2 block">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/10 text-white placeholder:text-gray-400 border border-white/10 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>


                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-xl hover:bg-yellow-500 transition disabled:opacity-50"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>


                    <p className="text-xs text-gray-500 text-center mt-4">
                        Make sure your password is strong and secure.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}