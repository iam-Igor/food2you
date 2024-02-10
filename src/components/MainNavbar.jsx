import { Container, Navbar, Nav, Button, Dropdown } from "react-bootstrap";
import "../assets/css/custom.css";
import logo from "../assets/img/logo.png";
import RegisterForm from "./RegisterForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
} from "@mui/material";
import { useEffect, useState } from "react";

const MainNavbar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userData = localStorage.getItem("tokenUser");

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
                    className="rounded-circle drop-nav border-0 text-black"
                    id="dropdown-basic"
                  >
                    <i class="bi bi-three-dots fs-4 me-2"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item className="d-flex align-items-center">
                      <i class="bi bi-list-ul fs-4 me-2"></i>Ordini
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex align-items-center">
                      <i class="bi bi-cart4 fs-4 me-2"></i>Carrello
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="d-flex align-items-center"
                      onClick={() => {
                        localStorage.removeItem("tokenUser");
                        navigate("/");
                        window.location.reload();
                      }}
                    >
                      <i class="bi bi-box-arrow-right fs-4 me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <RegisterForm />
    </>
  );
};

export default MainNavbar;
