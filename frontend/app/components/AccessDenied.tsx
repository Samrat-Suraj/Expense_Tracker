"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { FaCross } from 'react-icons/fa'
import { BiX } from 'react-icons/bi'
import { FaX } from 'react-icons/fa6'
import { useDispatch } from 'react-redux'
import { setErrorMessage } from '../store/slice/userSlice'

const AccessDenied = () => {

    const router = useRouter()
    let dispatch = useDispatch()
    let onClickDismiss = ()=>{
        dispatch(setErrorMessage(false))
    }

    return (
        <div className="flex justify-center  ">
            <div className="flex items-center justify-between w-full  bg-red-500/10 border border-red-500/30  px-4 py-2">
                <p className="text-md p-3 text-center text-red-400">
                    Please sign in to access this page
                </p>
                <button
                    onClick={onClickDismiss}
                    className=" p-2 text-lg cursor-pointer rounded-full text-red-500 hover:font-bold transition"
                >
                    <FaX/>
                </button>

            </div>

        </div>
    )
}

export default AccessDenied