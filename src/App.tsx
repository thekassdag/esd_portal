import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroPage from "@/pages/HeroPage";
import BrowsePage from "@/pages/BrowsePage";
import ProfilePage from "@/pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/browse/:id" element={<ProfilePage />} />
        <Route path="/join" element={<HeroPage />} />
        <Route path="/community" element={<HeroPage />} />
      </Routes>
    </BrowserRouter>
  );
}
