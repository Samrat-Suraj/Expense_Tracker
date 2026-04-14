"use client";
import React, { use, useEffect, useState } from "react";
import {
  FaHome,
  FaCalendarDay,
  FaCalendarAlt,
  FaCalendar,
  FaPlus,
} from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useLoaderUserQuery, useLogoutUserMutation } from "../store/api/userApi";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage, setUser } from "../store/slice/userSlice";
import { useGetThisMonthExpanceQuery, useGetThisYearExpanceQuery, useGetTodayExpanceQuery, useGetTotalExpanceQuery } from "../store/api/expanceApi";
import AccessDenied from "../components/AccessDenied";

const HiisabDashboard = () => {
  let { data } = useLoaderUserQuery({})
  const navigate = useRouter();
  const dispatch = useDispatch()
  const { refetch } = useLoaderUserQuery({})
  let [text, setText] = useState("All")
  let [searchText, setSearchText] = useState("")
  let [totalExpanceFilter, setTotalExpanceFilter] = useState<any>([])
  let [thisYearFilter, setThisYear] = useState<any>([])
  let [todayExpance, setTodayExpance] = useState<any>([])
  let [logoutUser, { data: logoutData, isLoading: isLogoutLoading, isSuccess: isLogoutSuccess, isError: isLogoutError, error: logoutError }] = useLogoutUserMutation()
  let { data: ThisMonthData, refetch: refetchThisMonth } = useGetThisMonthExpanceQuery({})
  let { data: ThisYearData, refetch: refetchThisYear } = useGetThisYearExpanceQuery({})
  let { data: totalExpanceData, refetch: refetchTotalExpance } = useGetTotalExpanceQuery({})
  let { data: todayExpanceData, refetch: refetchTodayExpance } = useGetTodayExpanceQuery({})


    let { user, errorMesaage } = useSelector((state: any) => state.user);
    const router = useRouter();
    let pathname = usePathname();
  
    useEffect(() => {
      const publicRoutes = ["/", "/login", "/signup" , "/ask"];
      if (!user && !publicRoutes.includes(pathname)) {
        router.push("/");
        dispatch(setErrorMessage(true));
        toast.error("Please sign in to access this page")
      }
    }, [user, pathname, router, dispatch]);
  

  const onClickLogoutHander = async (text: string) => {
    if (text === "Logout") {
      await logoutUser({})
      dispatch(setUser({ user: null }))
      toast.success("Logged Out successfully")
    }
  }

  useEffect(() => {
    if (logoutData) {
      console.log("Logout Success", logoutData)
    }
    if (isLogoutError) {
      console.log("Logout Error", logoutError)
    }

    if (isLogoutSuccess) {
      navigate.push("/login");
    }

  }, [logoutData, isLogoutError, logoutError])

  useEffect(() => {
    const expances = totalExpanceData?.expances?.filter((expance: any) => {
      if (!searchText || searchText.length === 0) {
        return true
      }
      return (
        expance?.item?.toLowerCase().includes(searchText.toLowerCase()) ||
        expance?.expanceCategory?.toLowerCase().includes(searchText.toLowerCase()) ||
        expance?.paymentMethod?.toLowerCase().includes(searchText.toLowerCase()) ||
        expance?.date?.includes(searchText)
      )
    })

    setTotalExpanceFilter(expances)
  }, [searchText, totalExpanceData?.expances])


  useEffect(() => {
    const expances = ThisMonthData?.data?.expances?.filter((expance: any) => {
      if (!searchText || searchText?.length === 0) {
        return true
      }
      return (
        expance?.item?.toLowerCase().includes(searchText.toLowerCase()) ||
        expance?.expanceCategory?.toLowerCase().includes(searchText.toLowerCase()) ||
        expance?.paymentMethod?.toLowerCase().includes(searchText.toLowerCase()) ||
        expance?.date?.includes(searchText)
      )
    })

    setThisYear(expances)
  }, [searchText, ThisMonthData?.data?.expances])


  useEffect(() => {
    const expances = todayExpanceData?.data.expances?.filter((expance: any) => {
      if (!searchText || searchText?.length === 0) {
        return true
      }
      return (
        expance?.item?.toLowerCase().includes(searchText.toLowerCase()) ||
        expance?.expanceCategory?.toLowerCase().includes(searchText.toLowerCase()) ||
        expance?.paymentMethod?.toLowerCase().includes(searchText.toLowerCase()) ||
        expance?.date?.includes(searchText)
      )
    })

    setTodayExpance(expances)
  }, [searchText, todayExpanceData?.data.expances])


  console.log(data?.user, "user data from loader query")

  return (
    !data?.user ? (
      <AccessDenied />
    ) : (
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">

        {/* Sidebar */}
        <div className="w-full md:w-1/5 bg-black text-white p-3 flex md:flex-col justify-between md:justify-start gap-2 md:gap-3">
          <h1 className="text-lg md:text-2xl font-bold hidden md:block mb-4">
            Hiisab
          </h1>

          {[
            { icon: <FaHome />, label: "All" },
            { icon: <FaCalendarDay />, label: "Today" },
            { icon: <FaCalendarAlt />, label: "This Monthly" },
            { icon: <FaCalendar />, label: "This Yearly" },
            { icon: <LuLogOut />, label: "Logout" },
          ].map((item, i) => (
            <button
              onClick={() => {
                setText(item?.label);
                item.label === "Logout" && onClickLogoutHander(item?.label);
                item.label === "Today" && refetchTodayExpance();
                item.label === "This Monthly" && refetchThisMonth();
                item.label === "This Yearly" && refetchThisYear();
                item.label === "All" && refetchTotalExpance();
              }}

              key={i}
              className="flex items-center justify-center md:justify-start gap-2 bg-gray-800 p-2 rounded hover:bg-gray-700 text-xs md:text-base w-full"
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}


        </div>

        {/* Main Content */}
        <div className="w-full md:w-4/5 p-3 md:p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-4 rounded shadow">
              <h2 className="text-gray-500 text-xs md:text-sm">Total Expense</h2>
              <p className="text-lg md:text-2xl font-bold text-red-500">₹{totalExpanceData?.data || 0}</p>
            </div>

            <div className="bg-white p-3 md:p-4 rounded shadow">
              <h2 className="text-gray-500 text-xs md:text-sm">This Month</h2>
              <p className="text-lg md:text-2xl font-bold text-blue-500">₹{ThisMonthData?.data?.total || 0}</p>
            </div>

            <div className="bg-white p-3 md:p-4 rounded shadow">
              <h2 className="text-gray-500 text-xs md:text-sm">Today</h2>
              <p className="text-lg md:text-2xl font-bold text-green-500">₹{todayExpanceData?.data?.total || 0}</p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row justify-between gap-3">

            <h2 className="text-lg md:text-xl font-semibold">
              Recent Expenses
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <select onChange={(e) => setSearchText(e.target.value)} className="px-3 py-2 rounded bg-black text-white text-sm w-full sm:w-auto">
                <option value="">Select Category</option>
                <option value="food">Food</option>
                <option value="fruits">Fruits</option>
                <option value="donations">Donations</option>
                <option value="movies">Movies</option>
                <option value="fast_foods">Fast Foods</option>
                <option value="EMIs">EMIs</option>
                <option value="transport">Transport</option>
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="shopping">Shopping</option>
                <option value="shopping">Cloths</option>
                <option value="bills">Bills</option>
              </select>

              {/* Search */}
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 rounded border w-full sm:w-auto"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              {/* Button */}
              <button onClick={() => navigate.push("/expance")} className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm w-full sm:w-auto">
                <FaPlus /> Add
              </button>

            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <div className="min-w-[650px]">

              {/* Header */}
              <div className="grid grid-cols-6 bg-gray-200 p-2 md:p-3 font-semibold text-xs md:text-sm">
                <div>Item</div>
                <div>Price</div>
                <div>Category</div>
                <div>Payment</div>
                <div>Date</div>
                <div>Notes</div>
              </div>

              {
                text === "Today" ? (
                  todayExpance?.map((row: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-6 p-2 md:p-3 border-t text-xs md:text-sm hover:bg-gray-50"
                    >
                      <div>{row.item}</div>
                      <div>{row.price}</div>
                      <div>{row.expanceCategory}</div>
                      <div>{row.paymentMethod}</div>
                      <div>{row.date}</div>
                      <div className="truncate">{row.notes}</div>
                    </div>
                  ))
                ) : text === "This Monthly" ? (
                  thisYearFilter?.map((row: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-6 p-2 md:p-3 border-t text-xs md:text-sm hover:bg-gray-50"
                    >
                      <div>{row.item}</div>
                      <div>{row.price}</div>
                      <div>{row.expanceCategory}</div>
                      <div>{row.paymentMethod}</div>
                      <div>{row.date}</div>
                      <div className="truncate">{row.notes}</div>
                    </div>
                  ))
                ) : text === "This Yearly" ? (
                  ThisYearData?.data?.expances?.map((row: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-6 p-2 md:p-3 border-t text-xs md:text-sm hover:bg-gray-50"
                    >
                      <div>{row.item}</div>
                      <div>{row.price}</div>
                      <div>{row.expanceCategory}</div>
                      <div>{row.paymentMethod}</div>
                      <div>{row.date}</div>
                      <div className="truncate">{row.notes}</div>
                    </div>
                  ))
                ) : text === "All" ? (
                  totalExpanceFilter?.map((row: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-6 p-2 md:p-3 border-t text-xs md:text-sm hover:bg-gray-50"
                    >
                      <div>{row?.item}</div>
                      <div>{row?.price}</div>
                      <div>{row?.expanceCategory}</div>
                      <div>{row?.paymentMethod}</div>
                      <div>{row?.date}</div>
                      <div className="truncate">{row?.notes}</div>
                    </div>
                  ))
                ) : null
              }
            </div>
          </div>

        </div>
      </div>
    )



  );
};

export default HiisabDashboard;