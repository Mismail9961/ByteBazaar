"use client";

import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const ClientProviders = ({ children }) => {
  return (
    <SessionProvider>
      <AppContextProvider>
        <Toaster />
        {children}
      </AppContextProvider>
    </SessionProvider>
  );
};

export default ClientProviders;
