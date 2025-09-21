import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@app/home/HomePage";
import ProductPage from "@app/vinyl/VinylPage";
import CartPage from "@app/cart/CartPage";
import { Header } from "@app/components/Header";
import { Footer } from "@app/components/Footer";
import LoginPage from "./login/LoginPage";
import RolePage from "./login/role/rolePage";
import SignUp from "./login/SingUp";
import VerifyEmailPage from "./email/VerifyEmailPage";
import NotFoundPage from "./NotFound";
import TokenActionCard from "./ui/TokenAction";
import ArtistsPage from "./home/ArtistPage";
import HistoryPage from "./home/DisksPage";
import { LocationPage } from "./home/LocationPage";
import UserPanel from "./login/role/UserPanel";

export function AppRouter() {
  return (
    <BrowserRouter>
      <main className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/orders" element={<UserPanel />} />
            <Route path="/login/:role" element={<RolePage />} />
            <Route path="/email-verification" element={<VerifyEmailPage />} />
            <Route path="/verify-email" element={<TokenActionCard mode="verify" />} />
            <Route path="/reset-password" element={<TokenActionCard mode="reset"/>} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path ="/location" element={<LocationPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </BrowserRouter>
  );
}


