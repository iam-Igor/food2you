import { Col, Container, Row } from "react-bootstrap";

import mainImg from "../assets/img/access_denied.jpg";

const AccessDeniedPage = () => {
  return (
    <Container>
      <Row className="mt-5">
        <Col className="d-flex align-items-center">
          <img
            alt="access-denied-logo"
            src={mainImg}
            style={{ width: "40%" }}
          />
          <h2 className="ms-3">403 - Accesso non autorizzato</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default AccessDeniedPage;
