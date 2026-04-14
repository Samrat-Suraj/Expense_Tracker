"use client"
import React, { useEffect, useState } from "react";
import {
    IoMailOutline,
    IoLockClosedOutline,
    IoPersonOutline,
} from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useRegisterUserMutation } from "../store/api/userApi";
import { toast } from "react-toastify";
import { BiLoader } from "react-icons/bi";

const Signup = () => {
    let navigate = useRouter()
    let [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    let changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    let [registerUser, { data: registerData, isLoading: registerIsLoading, error: registerError, isError: registerIsError, isSuccess: registerIsSuccess }] = useRegisterUserMutation()
    let submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await registerUser({ formData })
        console.log(registerData)
    }

    useEffect(() => {
        if (registerIsSuccess) {
            toast.success(registerData?.message || "User Register Successfully Please check your email Address for varification")
        }
        if (registerIsError) {
            toast.error(
                (registerError as any)?.data?.message ||
                "Registration failed"
            );
        }

    }, [registerIsSuccess, registerIsError, registerData])

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-gray-800 px-4">


            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">


                <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                    Create Account
                </h1>
                <p className="text-gray-400 text-center mb-6 text-sm">
                    Start managing your expenses easily
                </p>


                <button className="flex items-center justify-center gap-3 w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                    <FcGoogle size={22} />
                    Continue with Google
                </button>


                <div className="flex items-center gap-2 my-5">
                    <div className="flex-1 h-px bg-gray-600"></div>
                    <p className="text-gray-400 text-xs">OR</p>
                    <div className="flex-1 h-px bg-gray-600"></div>
                </div>


                <form className="flex flex-col gap-4" onSubmit={submitHandler}>


                    <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2">
                        <IoPersonOutline className="text-gray-400" size={20} />
                        <input
                            type="text"
                            name="fullName"
                            onChange={changeHandler}
                            placeholder="Full Name"
                            className="bg-transparent outline-none text-white w-full placeholder-gray-400 text-sm"
                        />
                    </div>


                    <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2">
                        <IoMailOutline className="text-gray-400" size={20} />
                        <input
                            type="email"
                            name="email"
                            onChange={changeHandler}
                            placeholder="Email Address"
                            className="bg-transparent outline-none text-white w-full placeholder-gray-400 text-sm"
                        />
                    </div>


                    <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2">
                        <IoLockClosedOutline className="text-gray-400" size={20} />
                        <input
                            type="password"
                            name="password"
                            onChange={changeHandler}
                            placeholder="Password"
                            className="bg-transparent outline-none text-white w-full placeholder-gray-400 text-sm"
                        />
                    </div>


                    <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2">
                        <IoLockClosedOutline className="text-gray-400" size={20} />
                        <input
                            type="password"
                            name="confirmPassword"
                            onChange={changeHandler}
                            placeholder="Confirm Password"
                            className="bg-transparent outline-none text-white w-full placeholder-gray-400 text-sm"
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={registerIsLoading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {registerIsLoading && (
                            <BiLoader className="animate-spin text-lg" />
                        )}
                        {registerIsLoading ? "Signing Up..." : "Sign Up"}
                    </button>

                </form>


                <p className="text-center text-gray-400 text-sm mt-5">
                    Already have an account?{" "}
                    <span onClick={() => navigate.push("/login")} className="text-yellow-400 cursor-pointer hover:underline">
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Signup;