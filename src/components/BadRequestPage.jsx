import { Col, Container, Row } from "react-bootstrap";
import badReq from "../assets/img/badrequest401.jpg";

const BadRequestPage = () => {
  return (
    <Container>
      <Row>
        <Col className="d-flex justify-content-center align-items-center">
          <img alt="not-found-img" src={badReq} style={{ width: "50%" }} />
          <h1>400-Qualcosa è andato storto.</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default BadRequestPage;
