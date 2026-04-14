"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { use, useEffect } from "react";
import { IoHomeOutline, IoLogInOutline } from "react-icons/io5";
import { MdOutlineAccountBalanceWallet, MdOutlinePersonAdd } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage } from "../store/slice/userSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  let { user, errorMesaage } = useSelector((state: any) => state.user);
  const router = useRouter();
  let pathname = usePathname();
  let dispatch = useDispatch()

  useEffect(() => {
    const publicRoutes = ["/", "/login", "/signup" , "/ask"];

    if (!user && !publicRoutes.includes(pathname)) {
      router.push("/");
      dispatch(setErrorMessage(true));
      toast.error("Please sign in to access this page")
    }
  }, [user, pathname, router, dispatch]);

  return (
    <div className="bg-black/80 backdrop-blur-md px-4 md:px-8 py-4 flex justify-between items-center border-b border-white/10">

      {/* Logo */}
      <h1
        onClick={() => router.push("/")}
        className="text-xl md:text-3xl font-bold tracking-wide text-white cursor-pointer"
      >
        Expensio<span className="text-yellow-400">.</span>
      </h1>

      {/* Right Side */}
      {user ? (
        <div className="flex items-center gap-3 md:gap-6 text-gray-300 font-medium">

          {/* Home */}
          <div
            onClick={() => !user ? router.push("/") : router.push("/")}
            className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition"
          >
            <IoHomeOutline size={22} />
            <p className="hidden md:block">Home</p>
          </div>

          {/* Balance */}
          <div
            onClick={() => !user ? router.push("/") : router.push("/balance")}
            className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition"
          >
            <MdOutlineAccountBalanceWallet size={22} />
            <p className="hidden md:block">Balance</p>
          </div>

          {/* Add Expense */}
          <div
            onClick={() => !user ? router.push("/") : router.push("/expance")}
            className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-yellow-400 text-black hover:bg-yellow-500 transition"
          >
            <TbMoneybag size={22} />
            <p className="hidden md:block font-semibold">Add</p>
          </div>

        </div>
      ) : (
        <div className="flex items-center gap-2 md:gap-4">

          {/* Login */}
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition text-sm md:text-base"
          >
            <IoLogInOutline size={20} />
            <span className="hidden sm:block">Login</span>
          </button>

          {/* Signup */}
          <button
            onClick={() => router.push("/signup")}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 transition text-sm md:text-base"
          >
            <MdOutlinePersonAdd size={20} />
            <span className="hidden sm:block font-semibold">Sign Up</span>
          </button>

        </div>
      )}
    </div>
  );
};

export default Navbar;