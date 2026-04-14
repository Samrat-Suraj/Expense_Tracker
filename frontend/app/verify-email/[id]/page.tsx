"use client";

import { motion } from "framer-motion";
import { BiLoaderAlt } from "react-icons/bi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useVerifyUserMutation } from "@/app/store/api/userApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const { id } = useParams();
    const router = useRouter();

    const [
        verifyUser,
        { data, isLoading, isSuccess, isError, error }
    ] = useVerifyUserMutation();


    useEffect(() => {
        if (id) {
            verifyUser(id);
        }
    }, [id, verifyUser]);

    
    useEffect(() => {
        if (isSuccess && data) {
            toast.success(data.message || "Email Verified Successfully");

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        }

        if (isError) {
            toast.error((error as any)?.data?.message || "Verification Failed");
        }
    }, [isSuccess, isError, data, error, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8 text-center">

                    {isLoading && (
                        <>
                            <div className="flex justify-center mb-4">
                                <BiLoaderAlt className="text-yellow-400 text-5xl animate-spin" />
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-2">
                                Verifying Your Email
                            </h1>

                            <p className="text-gray-400 text-sm">
                                Please wait while we verify your account...
                            </p>
                        </>
                    )}

                    {isSuccess && (
                        <>
                            <div className="flex justify-center mb-4">
                                <FaCheckCircle className="text-green-400 text-5xl" />
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-2">
                                Email Verified
                            </h1>

                            <p className="text-gray-400 text-sm">
                                Redirecting to login...
                            </p>
                        </>
                    )}

                   
                    {isError && (
                        <>
                            <div className="flex justify-center mb-4">
                                <FaTimesCircle className="text-red-400 text-5xl" />
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-2">
                                Verification Failed
                            </h1>

                            <p className="text-gray-400 text-sm mb-4">
                                Link may be expired or invalid.
                            </p>

                            <button
                                onClick={() => router.push("/")}
                                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                            >
                                Go Home
                            </button>
                        </>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

export default Page;