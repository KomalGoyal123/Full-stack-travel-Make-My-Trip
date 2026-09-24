import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useDispatch } from "react-redux";
import store from "../store";
import { hydrateUser, setUser } from "../store/userSlice";
import { setRefunds } from "../store/refundSlice";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import { useEffect } from "react";
import Footer from "@/components/Fotter";
import { getProfile } from "../api";
import { Toaster } from "react-hot-toast"; 


const MyApp = ({ Component, pageProps }: AppProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          const freshUser = await getProfile(parsedUser.email);

          if (freshUser) {
            dispatch(setUser(freshUser));
            localStorage.setItem("user", JSON.stringify(freshUser));
          } else {
            dispatch(hydrateUser());
          }
        } else {
          dispatch(hydrateUser());
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        dispatch(hydrateUser());
      }
    };

    fetchUser();

    
    const storedRefunds = localStorage.getItem("refunds");
    if (storedRefunds) {
      try {
        const refunds = JSON.parse(storedRefunds);
        if (Array.isArray(refunds)) {
          dispatch(setRefunds(refunds));
        }
      } catch (e) {
        console.error("Failed to parse stored refunds:", e);
      }
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
      <Toaster position="top-right" /> 
    </div>
  );
};


export default function App(props: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>MakeMyTour</title>
      </Head>
      <MyApp {...props} />
    </Provider>
  );
}

