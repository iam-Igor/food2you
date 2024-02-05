import { Container, Navbar, Nav, Button } from "react-bootstrap";
import "../assets/css/custom.css";
import logo from "../assets/img/logo.png";
import RegisterForm from "./RegisterForm";
import { useDispatch, useSelector } from "react-redux";

const MainNavbar = () => {
  const dispatch = useDispatch();

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
            />
          </Navbar.Brand>
          <Nav>
            <Button
              className="rounded-pill py-3 px-4 px-md-5 btn-warning"
              onClick={() => {
                dispatch({ type: "SHOW_LOGIN_MODAL", payload: true });
              }}
            >
              Iniziamo
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <RegisterForm />
    </>
  );
};

export default MainNavbar;
