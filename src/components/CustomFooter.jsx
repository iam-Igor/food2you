import { Col, Container, Row } from "react-bootstrap";

import logo from "../assets/img/logo.png";
import footerBg from "../assets/img/footer-top.svg";

const CustomFooter = () => {
  const now = new Date();
  const year = now.getFullYear();

  return (
    <>
      <div className="w-100">
        <img src={footerBg} alt="background" style={{ width: "100%" }} />
      </div>
      <Container fluid className="bg-black text-white py-5">
        <Row className="justify-content-center mb-3 ">
          <Col className="d-flex justify-content-center col-12 col-md-6">
            <img
              src={logo}
              alt="logo"
              style={{ width: "30%" }}
              className="rounded-circle"
            />
          </Col>
        </Row>
        <Row className="d-flex justify-content-around flex-column flex-md-row">
          <Col className="text-center">
            <ul className="list-unstyled">
              <li>Chi siamo</li>
              <li>Contattaci</li>
              <li>FAQ</li>
            </ul>
          </Col>
          <Col className="text-center">
            {" "}
            <ul className="list-unstyled">
              <li>Lavora con noi</li>
              <li>Pagamenti</li>
              <li>ToC</li>
            </ul>
          </Col>
          <Col className="text-center">
            <ul className="list-unstyled">
              <li>Diventa partner</li>
              <li>Cookie policy</li>
              <li>Privacy policy</li>
            </ul>
          </Col>
        </Row>
        <Row className="flex-column mt-3">
          <p className="text-center">Seguici</p>
          <div className="d-flex flex-row justify-content-center">
            {" "}
            <i className="bi bi-facebook fs-2"></i>
            <i className="bi bi-instagram fs-2 mx-3"></i>
            <i className="bi bi-twitter-x fs-2"></i>
          </div>
          <p className="text-center mt-4">Food2You © {year}</p>
        </Row>
      </Container>
    </>
  );
};

export default CustomFooter;
