import React, { FC } from "react";
import { NavBar } from "./NavBar";
import { ToastProvider } from "./Toast/Toast";

export const Layout: FC = ({ children }) => {
  return (
    <ToastProvider>
      <main className="min-h-screen flex flex-col space-y-12 mx-4 lg:mx-48">
        <NavBar />
        {children}
      </main>
    </ToastProvider>
  )
}