"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCreateExpanceMutation } from "../store/api/expanceApi";
import { toast } from "react-toastify";
import { create } from "domain";
import { useGetTotalBalanceQuery } from "../store/api/balanceApi";
import { BiLoader } from "react-icons/bi";
import { useSelector } from "react-redux";


const ExpensioTracker = () => {
  let { user } = useSelector((state: any) => state.user);
  let [imageUrl, setImageUrl] = useState("")
  let [imageFile, setImageFile] = useState<File | null>(null)
  const handelImageChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      let imageUrl = URL.createObjectURL(file)
      setImageUrl(imageUrl)
    }
  }


  let [createExpance, { data: createData, isLoading: createLoading, error: createError }] = useCreateExpanceMutation()
  let {data : totalBalance , refetch} = useGetTotalBalanceQuery({})
 
  let [formData, setFormData] = useState({
    item: "",
    price: "",
    expanceCategory: "",
    paymentMethod: "",
    date: "",
    notes: "",
  })

  let changeHander = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

let submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  let form = new FormData()
  form.append("item", formData.item)
  form.append("price", formData.price)
  form.append("expanceCategory", formData.expanceCategory)
  form.append("paymentMethod", formData.paymentMethod)
  form.append("date", formData.date)
  form.append("notes", formData.notes)

  if (imageFile) {
    form.append("image", imageFile)
  }

  console.log([...form.entries()]);
  await createExpance(form)
}


  useEffect(()=>{
    if(createData){
      refetch()
      toast.success(createData.message || "Expance created successfully")
        setFormData({
          item: "",
          price: "",
          expanceCategory: "",
          paymentMethod: "",
          date: "",
          notes: "",
        })
        setImageUrl("")
    }
    if(createError){
      toast.error((createError as any).data?.message || "Failed to create expance")
    }
  },[createData , createError])



  return (

    <form onSubmit={submitHandler}>
    <section className="relative min-h-screen w-full bg-linear-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center px-4 sm:px-8 md:px-20 py-12">

      <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl p-6 sm:p-8 text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-yellow-400 text-center tracking-wide">
          Add Expense
        </h1>
        
        <div className="bg-linear-to-r from-yellow-400 to-yellow-500 text-black text-center py-6 rounded-2xl mb-10 shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-lg font-semibold opacity-80">Total Balance</h2>
          <p className="text-3xl sm:text-4xl mt-2 font-extrabold">₹ {totalBalance?.balance?.totalBalance}</p>
          <p className="text-xs mt-1 opacity-70">
            Keep track of your expenses effortlessly
          </p>
        </div>


        <label htmlFor="image" className="border-2 flex items-center justify-center border-dashed border-yellow-400/40 hover:border-yellow-400 transition text-black text-center py-8 rounded-2xl mb-10 shadow-md bg-white/5 cursor-pointer">
          <div className="flex items-center justify-center flex-col">
            <div>
              <input
                type="file"
                accept="image/*"
                id="image"
                onChange={handelImageChange}
                className="hidden"
              />
            </div>


            {
              imageUrl ?
                <Image
                  alt="upload image"
                  src={imageUrl}
                  width={200}
                  height={200}
                  className="opacity-80 flex mb-2"
                />
                :

                <div className="flex items-center flex-col">
                  <Image
                    alt="upload image"
                    src="/pngegg.png"
                    width={90}
                    height={90}
                    className="opacity-80 flex mb-2"
                  />
                  <span className="text-gray-300 text-sm">
                    Click to upload receipt
                  </span>
                </div>

            }



          </div>
        </label>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div>
            <label className="block text-gray-400 text-sm mb-2">Item Name</label>
            <input
              type="text"
              placeholder="Enter item name"
              name="item"
              value={formData.item}
              onChange={changeHander}
              className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white transition"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Price</label>
            <input
              type="number"
              name="price"
              placeholder="Enter item price"
              value={formData.price}
              onChange={changeHander}
              className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white transition"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Expense Category</label>
            <select
              name="expanceCategory"
              value={formData.expanceCategory}
              onChange={changeHander}
              className="w-full px-4 py-3 rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white transition"
            >
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
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={changeHander}
              className="w-full px-4 py-3 rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white transition"
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={changeHander}
              className="w-full px-4 py-3 rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white transition"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Notes</label>
            <textarea
              placeholder="Add notes if any"
              name="notes"
              value={formData.notes}
              onChange={changeHander}
              className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white h-24 resize-none transition"
            />
          </div>
        </div>


        <button className="w-full bg-yellow-400 flex items-center justify-center gap-2 hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-500/30 active:scale-[0.98] text-black py-3 rounded-xl font-semibold transition duration-200">
           { createLoading ? <BiLoader  className=" animate-spin" size={22}/> : null }Add Expense
        </button>

      </div>
    </section>
    </form>
  );
};

export default ExpensioTracker;