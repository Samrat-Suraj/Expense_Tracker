"use client"
import React, { useEffect, useState } from "react";
import {
  IoMailOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useLoaderUserQuery, useLoginUserMutation, USER_ENDPOINT } from "../store/api/userApi";
import { toast } from "react-toastify";

const Login = () => {
  let navigate = useRouter();
  let [loginUser, { data: loginData, isLoading: loginLoading, error: loginError, isSuccess: loginSuccess }] = useLoginUserMutation()
  let [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const onChangeHander = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSumitformHander = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await loginUser({ formData })

  }

  useEffect(() => {
    if (loginSuccess) {
      toast.success(loginData?.message)
      navigate.push("/")
    }
    if (loginError) {
      console.log("Login Error", loginError)
      toast.error((loginError as any)?.data?.message || "Login Failed")
    }
  }, [loginSuccess, loginError, loginData])

  const handelGoogleLogin = async () => {
    try {
      navigate.push(`${USER_ENDPOINT}/google`)
    } catch (error) {
      console.log(error)
      toast.error("Email or Password is Incorrent")
    } finally {
    }
  }

  


  return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-gray-800 px-4">

    {/* Card */}
    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">

      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
        Welcome Back
      </h1>
      <p className="text-gray-400 text-center mb-6 text-sm">
        Login to manage your expenses
      </p>

      {/* Google Login */}
      <button onClick={handelGoogleLogin} className="flex items-center justify-center gap-3 w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition">
        <FcGoogle size={22} />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-2 my-5">
        <div className="flex-1 h-px bg-gray-600"></div>
        <p className="text-gray-400 text-xs">OR</p>
        <div className="flex-1 h-px bg-gray-600"></div>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={onSumitformHander}>

        {/* Email */}
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2">
          <IoMailOutline className="text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            onChange={onChangeHander}
            className="bg-transparent outline-none text-white w-full placeholder-gray-400 text-sm"
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2">
          <IoLockClosedOutline className="text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            onChange={onChangeHander}
            className="bg-transparent outline-none text-white w-full placeholder-gray-400 text-sm"
          />
        </div>

        {/* Forgot Password */}
        <div onClick={() => navigate.push("/forgetpassword")} className="text-right">
          <p className="text-xs text-yellow-400 cursor-pointer hover:underline">
            Forgot Password?
          </p>
        </div>

        {/* Login Button */}
        <button
          className="bg-linear-to-r from-yellow-400 to-orange-500 text-black py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition"
        >
          Login
        </button>
      </form>

      {/* Signup Redirect */}
      <p className="text-center text-gray-400 text-sm mt-5">
        Don’t have an account?{" "}
        <span onClick={() => navigate.push("/signup")} className="text-yellow-400 cursor-pointer hover:underline">
          Sign Up
        </span>
      </p>
    </div>
  </div>
);
};

export default Login;