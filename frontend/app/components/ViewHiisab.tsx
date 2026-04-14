"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { GiCalendarHalfYear } from 'react-icons/gi'
import { IoTodayOutline } from 'react-icons/io5'
import { MdCalendarMonth } from 'react-icons/md'
import {
  useGetThisMonthExpanceQuery,
  useGetThisYearExpanceQuery,
  useGetTodayExpanceQuery
} from '../store/api/expanceApi'
import { useSelector } from 'react-redux'

const ViewHiisab = () => {

  const navigate = useRouter()
  const { user } = useSelector((state: any) => state.user)

 
  const { data: ThisYearData } = useGetThisYearExpanceQuery({}, { skip: !user })
  const { data: todayExpanceData } = useGetTodayExpanceQuery({}, { skip: !user })
  const { data: ThisMonthData } = useGetThisMonthExpanceQuery({}, { skip: !user })

  
  if (!user) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-br from-gray-500 via-gray-950 to-black flex items-center justify-center px-6">

        <div className="text-center text-white max-w-xl">

          
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center text-3xl shadow-lg">
              💰
            </div>
          </div>

          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Manage Your Money <br /> Like a Pro
          </h1>

         
          <p className="text-white/80 text-sm md:text-base mb-8">
            Track your daily, monthly, and yearly expenses in one place.
            Stay in control of your finances with Hiisab.
          </p>

          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <button
              onClick={() => navigate.push("/login")}
              className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-semibold hover:scale-105 transition shadow-lg"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate.push("/signup")}
              className="px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10 transition"
            >
              Create Account
            </button>

          </div>

          {/* Footer text */}
          <p className="mt-6 text-xs text-white/60">
            No credit card required • Free to use
          </p>

        </div>

      </div>
    )
  }


  const cards = [
    {
      title: "Today",
      subtitle: "Expenses",
      amount: `₹${todayExpanceData?.data?.total || 0}`,
      icon: <IoTodayOutline size={26} />,
      color: "from-blue-500 to-blue-400",
      link: "/hiisabdashboard"
    },
    {
      title: "Monthly",
      subtitle: "Expenses",
      amount: `₹${ThisMonthData?.data?.total || 0}`,
      icon: <MdCalendarMonth size={26} />,
      color: "from-green-500 to-emerald-400",
      link: "/hiisabdashboard"
    },
    {
      title: "Yearly",
      subtitle: "Expenses",
      amount: `₹${ThisYearData?.data?.total || 0}`,
      icon: <GiCalendarHalfYear size={26} />,
      color: "from-purple-500 to-indigo-400",
      link: "/hiisabdashboard"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 min-h-[10vh]">

      <h1 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">
        💰 Hiisab Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate.push(card.link)}
            className="relative rounded-2xl p-[1px] bg-gradient-to-r hover:scale-[1.03] transition duration-300 cursor-pointer"
          >
            <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-md hover:shadow-xl">

              <div className="flex items-center gap-4">
                <div
                  className={`text-white p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-md`}
                >
                  {card.icon}
                </div>

                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">
                    {card.title}
                  </p>
                  <p className="text-gray-600 text-sm">{card.subtitle}</p>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">
                    {card.amount}
                  </h2>
                </div>
              </div>

              
              <button className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                View →
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ViewHiisab