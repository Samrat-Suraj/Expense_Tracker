"use client";
import React, { useState } from "react";
import { IoMailOutline, IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { useForgetUserMutation } from "../store/api/userApi";

const ForgotPassword = () => {
  const [forgetUser, { data, isLoading, isError, error, isSuccess }] =
    useForgetUserMutation();

  const router = useRouter();

  const [isForgetPasswordSend, setIsForgetPasswordSend] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const res = await forgetUser(email).unwrap();
      console.log(res);

      setIsForgetPasswordSend(true);
    } catch (err: any) {
      console.log(err);
      alert(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-gray-800 px-4">
      {!isForgetPasswordSend ? (
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          
          {/* Back Button */}
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm"
          >
            <IoArrowBack /> Back to Login
          </button>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-400 text-center mb-6 text-sm">
            Enter your email to receive a reset link
          </p>

          {/* FORM */}
          <form onSubmit={handleForgetPassword} className="flex flex-col gap-4">

            {/* Email Input */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2">
              <IoMailOutline className="text-gray-400" size={20} />
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="bg-transparent outline-none text-white w-full placeholder-gray-400 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={isLoading}
              className="bg-linear-to-r from-yellow-400 to-orange-500 text-black py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Error Message */}
          {isError && (
            <p className="text-red-400 text-xs mt-3 text-center">
              {(error as any)?.data?.message || "Failed to send email"}
            </p>
          )}

          {/* Login Link */}
          <p className="text-center text-gray-400 text-xs mt-5">
            Remember your password?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-yellow-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      ) : (
        /* SUCCESS UI */
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl text-center">
          
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <FaCheckCircle size={70} className="text-green-500" />
          </div>

          {/* Text */}
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
            Email Sent ✅
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            We’ve sent a password reset link to your email.  
            Please check your inbox.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">

            <button
              onClick={() => router.push("/login")}
              className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              Back to Login
            </button>

            <button
              onClick={() => setIsForgetPasswordSend(false)}
              className="w-full border border-white/20 text-white py-2 rounded-lg hover:bg-white/10 transition"
            >
              Resend
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;