import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@app/home/HomePage";
import ProductPage from "@app/product/ProductPage";
import CartPage from "@app/cart/CartPage";
import { Header } from "@app/components/Header";
import { Footer } from "@app/components/Footer";

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-full flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/p/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
