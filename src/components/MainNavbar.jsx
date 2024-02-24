import { Container, Navbar, Nav, Button, Dropdown } from "react-bootstrap";
import "../assets/css/custom.css";
import logo from "../assets/img/logo.png";
import RegisterForm from "./RegisterForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

const MainNavbar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userData = localStorage.getItem("tokenUser");

  const showBadge = useSelector((state) => state.showOrdersBadge);
  const orderSelected = useSelector((state) => state.newestOrder);
  const showNotification = useSelector((state) => state.showNotification);

  const notify = () => {
    toast("🍔  Il tuo ordine è quasi pronto!", {
      position: "top-center",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      toastId: "customId1",
    });
  };

  useEffect(() => {
    if (showNotification) {
      notify();
    }
  });

  return (
    <>
      <Navbar expand="lg" className="bg-custom p-1 sticky-top ">
        <Container className="justify-content-between">
          <Navbar.Brand className="d-flex align-items-center">
            <img
              alt=""
              src={logo}
              width="90"
              height="90"
              className="d-inline-block align-top rounded-circle"
              onClick={() => navigate("/")}
            />
          </Navbar.Brand>
          <Nav className="d-flex flex-row">
            <Button
              className="rounded-pill py-3 px-5 btn-warning"
              onClick={() => {
                if (!userData) {
                  dispatch({ type: "SHOW_LOGIN_MODAL", payload: true });
                } else {
                  navigate("/profile");
                }
              }}
            >
              {userData ? <i className="bi bi-person fs-4"></i> : "Iniziamo"}
            </Button>

            {userData && (
              <>
                <Dropdown className="d-flex ms-2 ">
                  <Dropdown.Toggle
                    className="rounded-circle drop-nav border-0 text-black p-3 px-4 text-center"
                    id="dropdown-basic"
                  >
                    <i className="bi bi-three-dots fs-4"></i>
                    {showBadge && (
                      <i
                        className="bi bi-dot heartbeat"
                        style={{
                          position: "absolute",
                          fontSize: "3.5em",
                          color: "red",
                          top: "-30px",
                          right: "-20px",
                        }}
                      ></i>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      className="d-flex align-items-center"
                      onClick={() => {
                        navigate("/orders/me");
                      }}
                    >
                      <i className="bi bi-list-ul fs-4 me-2"></i>Ordini
                      <Badge
                        className="heartbeat"
                        style={{ top: "-8px", right: "-7px" }}
                        color="error"
                        variant="dot"
                        invisible={!showBadge}
                      ></Badge>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="d-flex align-items-center"
                      onClick={() => {
                        dispatch({ type: "SHOW_CART", payload: true });
                      }}
                    >
                      <i className="bi bi-cart4 fs-4 me-2"></i>Carrello
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="d-flex align-items-center"
                      onClick={() => {
                        localStorage.removeItem("tokenUser");
                        navigate("/");
                        window.location.reload();
                      }}
                    >
                      <i className="bi bi-box-arrow-right fs-4 me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
            <Dropdown className="d-flex ms-2 ">
              <Dropdown.Toggle
                style={{ backgroundColor: "#009688" }}
                className="rounded-circle border-0 text-white text-center p-0"
              >
                <i className="bi bi-brightness-high fs-3"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu className="drop-settings">
                <Dropdown.Item
                  className="d-flex align-items-center"
                  onClick={() => {
                    dispatch({ type: "ENABLE_DARK_MODE", payload: false });
                  }}
                >
                  <i className="bi bi-brightness-high-fill me-1"></i>
                  Light
                </Dropdown.Item>
                <Dropdown.Item
                  className="d-flex align-items-center"
                  onClick={() => {
                    dispatch({ type: "ENABLE_DARK_MODE", payload: true });
                  }}
                >
                  <i className="bi bi-moon-stars-fill me-1"></i>Dark
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
      <RegisterForm />
      {showNotification && (
        <ToastContainer
          onClick={() => {
            navigate("/order/status/" + orderSelected);
          }}
          limit={1}
          position="top-right"
          autoClose={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          theme="light"
        />
      )}
    </>
  );
};

export default MainNavbar;
