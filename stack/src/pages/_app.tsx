import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import AuthProvider from "@/lib/AuthContext.js";
import Head from "next/head";
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Code-Quest</title>
      </Head>
      <AuthProvider>
        <ToastContainer />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}
export default App;