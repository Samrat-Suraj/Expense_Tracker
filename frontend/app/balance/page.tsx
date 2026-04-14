"use client"
import React, { useEffect } from "react";
import { useAddBalanceMutation, useGetRecentBalanceQuery, useGetTotalBalanceQuery } from "../store/api/balanceApi";
import { toast } from "react-toastify";
import { BiLoader } from "react-icons/bi";

const Hiissab = () => {
  let [addBalance, { data: balanceData, isError: isError, isLoading: isLoading, error: balanceError }] = useAddBalanceMutation();
  let { data: recentData, refetch: reactRetch } = useGetRecentBalanceQuery({})
  let { data: totalBalanceData, refetch, isLoading: totalBananceIsLoading } = useGetTotalBalanceQuery({})
  const [balanceFormData, setBalanceFormData] = React.useState({
    amount: "",
    incomeSource: ""
  })



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalanceFormData({ ...balanceFormData, [e.target.name]: e.target.value })
  }

  const onSubmitHander = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addBalance({ formData: balanceFormData });
  }

  useEffect(() => {
    if (balanceData) {
      toast.success(balanceData?.message)
      setBalanceFormData({
        amount: "",
        incomeSource: ""
      })
    }
    if (balanceError) {
      toast.error((balanceError as any)?.data?.message || "Error In Adding Balance")
    }
  }, [balanceData, balanceError])

  // useEffect(()=>{

  // })

  return (
    <section className="relative min-h-screen w-full bg-linear-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center px-4 sm:px-8 md:px-20 py-12">

      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl w-full max-w-4xl p-8 text-white">

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-yellow-400 text-center tracking-wide">
          Add Balance
        </h1>


        <div className="bg-yellow-400 text-black text-center py-6 rounded-2xl mb-8 shadow-lg">
          <h2 className="text-xl font-semibold">Total Balance</h2>
          <p className="text-3xl sm:text-4xl mt-2 font-bold">₹ {totalBalanceData?.balance?.totalBalance || 0}</p>
          <p className="text-sm text-gray-800 mt-1">Keep track of your finances effortlessly</p>
        </div>


        <form onSubmit={onSubmitHander}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-300 font-medium mb-2">Income Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                name="amount"
                value={balanceFormData.amount}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">Income Source</label>
              <input
                type="text"
                name="incomeSource"
                value={balanceFormData.incomeSource}
                onChange={handleChange}
                placeholder="Job / Parents / Other"
                className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-xl font-semibold transition duration-200 mb-6"
          >
            { isLoading ? <BiLoader  className=" animate-spin" size={22}/> : null }Add Income
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mb-8">
          Tip: Track monthly or yearly balance for better budgeting.
        </p>

        <div className="mb-8" >
          <h2 className="text-2xl font-semibold mb-4 text-yellow-300">Recent Transactions</h2>


          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 space-y-3">
            {
              recentData?.balance?.map((item: any, i: number) => {
                return (

                  <div key={i}  className="flex justify-between py-2 px-3 bg-white/10 rounded-lg">
                    <span>{item?.incomeSource}</span>
                    <span>₹ {item?.amount}</span>
                  </div>


                )
              })
            }

          </div>

        </div>


        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-300">Monthly Overview</h2>
          <div className="w-full h-48 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400">
            [Graph Placeholder]
          </div>
        </div>


        <p className="text-gray-400 text-center mt-6 text-sm">
          💡 Keep tracking your income and expenses consistently. Small steps every day lead to big savings!
        </p>
      </div>
    </section>
  );
};

export default Hiissab;