import { Col, Container, Row } from "react-bootstrap";

import mainImg from "../assets/img/server_error.png";

const ServerErrorPage = () => {
  return (
    <Container fluid style={{ backgroundColor: "#F9F9FA" }}>
      <Row>
        <Col className="text-center p-0">
          <img alt="server_error_logo" src={mainImg} style={{ width: "80%" }} />
        </Col>
      </Row>
    </Container>
  );
};

export default ServerErrorPage;
