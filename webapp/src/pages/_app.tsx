import type { AppProps } from "next/app";
import Navbar from "../components/layout/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateClient from "./clients/create";
import EditClient from "./clients/edit";
import ListClient from "./clients/list";
import CreatePayment from "./payments/create";
import ListPayment from "./payments/list";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // State to handle client-side rendering
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once the component mounts
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return null or a fallback while waiting for client-side rendering
    return null;
  }

  return (
    <>
      
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index element={<CreateClient />} />
        <Route path="/clients/create" element={<CreateClient />} />
        <Route path="/clients/edit" element={<EditClient />} />
        <Route path="/clients/list" element={<ListClient />} />
        <Route path="/payments/create" element={<CreatePayment />} />
        <Route path="/payments/list" element={<ListPayment />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
