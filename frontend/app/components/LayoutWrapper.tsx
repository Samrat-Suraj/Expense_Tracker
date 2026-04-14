"use client";
import React, { useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import store from '../store/store'
import { useLoaderUserQuery } from '../store/api/userApi';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';


const Custom = ({ children }: { children: React.ReactNode }) => {
    let { isLoading, data } = useLoaderUserQuery({})
    if (isLoading) {
        return <div className='flex items-center justify-center h-screen'>
            <p className='text-lg'>Loading...</p>
        </div>
    }

    return <>{children}</>
}



const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Provider store={store}>
                <Custom>
                    <ToastContainer />
                    {children}
                </Custom>
            </Provider>
        </div>
    )
}

export default LayoutWrapper