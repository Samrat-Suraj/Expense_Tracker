"use client";
import { useEffect } from "react";
import AccessDenied from "./components/AccessDenied";
import HeroPage from "./components/HeroPage";
import ViewHiisab from "./components/ViewHiisab";
import { useLoaderUserQuery } from "./store/api/userApi";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage } from "./store/slice/userSlice";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  let pathname = usePathname();
  let { user ,  errorMesaage } = useSelector((state: any) => state.user);
  let dispatch = useDispatch()
  useEffect(() => {
    if (!user && pathname !== "/") {
      router.push("/");
      dispatch(setErrorMessage(true))
      toast.error("Please sign in to access this page")
    }
  }, [user, pathname, router, dispatch]);



  return (
    <div>
      {errorMesaage ? <AccessDenied /> : null}
      <HeroPage />
      <ViewHiisab />
    </div>
  );
}