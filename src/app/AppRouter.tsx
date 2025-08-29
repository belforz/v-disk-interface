import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@app/home/HomePage";
import ProductPage from "@app/product/ProductPage";
import CartPage from "@app/cart/CartPage";
import { Header } from "@app/components/Header";
import { Footer } from "@app/components/Footer";
import LoginPage from "./login/LoginPage";
import RolePage from "./login/role/rolePage";

import SignUp from "./login/SingUp";

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/p/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login/:role" element={<RolePage />} />
            
            <Route path="*" element={<div className="mx-auto max-w-4xl px-4 py-10">Page not found</div>} />
            
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}


