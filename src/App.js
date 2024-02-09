import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MainNavbar from "./components/MainNavbar";
import Homepage from "./components/HomePage";
import UserProfile from "./components/UserProfile";
import RestaurantDetail from "./components/RestaurantDetail";
import Products_Restaurant from "./components/ProductsRestaurant";
import ProductsRestaurant from "./components/ProductsRestaurant";

function App() {
  return (
    <BrowserRouter>
      <MainNavbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/restaurants/:summary" element={<RestaurantDetail />} />
      </Routes>
      <ProductsRestaurant />
    </BrowserRouter>
  );
}

export default App;
