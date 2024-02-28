import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MainNavbar from "./components/MainNavbar";
import Homepage from "./components/HomePage";
import UserProfile from "./components/UserProfile";
import RestaurantDetail from "./components/RestaurantDetail";
import ProductsRestaurant from "./components/ProductsRestaurant";
import CustomFooter from "./components/CustomFooter";
import NewOrderPage from "./components/NewOrderPage";
import GoUpButton from "./components/GoUpButton";
import Cart from "./components/Cart";
import NotFoundPage from "./components/NotFoundPage";
import BadRequestPage from "./components/BadRequestPage";
import OrdersPage from "./components/OrdersPage";
import OrderStatus from "./components/OrderStatus";
import { ParallaxProvider } from "react-scroll-parallax";
import AccessDeniedPage from "./components/AccessDeniedPage";
import ServerErrorPage from "./components/ServerErrorPage";

function App() {
  return (
    <ParallaxProvider>
      <BrowserRouter>
        <MainNavbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/order" element={<NewOrderPage />} />
          <Route path="/restaurants/:summary" element={<RestaurantDetail />} />
          <Route path="/*" element={<NotFoundPage />} />
          <Route path="/orders/me" element={<OrdersPage />} />
          <Route path="/bad_request" element={<BadRequestPage />} />
          <Route path="/access_denied" element={<AccessDeniedPage />} />
          <Route path="/server_error" element={<ServerErrorPage />} />
          <Route path="/order/status/:id" element={<OrderStatus />} />
        </Routes>
        <ProductsRestaurant />
        <Cart />
        <GoUpButton />
        <CustomFooter />
      </BrowserRouter>
    </ParallaxProvider>
  );
}

export default App;
