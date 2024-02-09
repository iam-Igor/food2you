import { Col, Row } from "react-bootstrap";

import chef from "../assets/img/chef.png";
import rider from "../assets/img/rider.png";
import sofa from "../assets/img/sofa.png";

import bottomBg from "../assets/img/wave-bottom.svg";
import topBg from "../assets/img/wave-top.svg";

const InfoSection = () => {
  return (
    <>
      <div className="w-100">
        <img src={topBg} alt="background" style={{ width: "100%" }} />
      </div>
      <Row className="flex-column flex-md-row  align-items-center restaurant-target py-5">
        <Col className="align-self-start">
          <div className="d-flex flex-column align-items-center">
            <img src={chef} alt="chef" style={{ width: "40%" }} />
            <h6 className="text-center">
              <span className="fw-bold">
                Esplora i migliori ristoranti della tua città
              </span>{" "}
              <br></br>
              Scopri una vasta selezione di locali gastronomici e delizia il tuo
              palato con i tuoi piatti preferiti o con nuove scoperte!
            </h6>
          </div>
        </Col>
        <Col>
          <div className="d-flex flex-column align-items-center">
            <img src={rider} alt="chef" style={{ width: "40%" }} />
            <h6 className="text-center">
              <span className="fw-bold">Rapidità di consegna garantita </span>
              <br></br>Ordina ora e ricevi velocemente il tuo cibo! Siamo rapidi
              come il vento: il tuo ordine sarà a casa tua in pochi minuti.
            </h6>
          </div>
        </Col>
        <Col>
          <div className="d-flex flex-column align-items-center">
            <img src={sofa} alt="chef" style={{ width: "55%" }} />
            <h6 className="text-center ">
              <span className="fw-bold">Stai sereno!</span>
              <br></br>
              Con noi, puoi ordinare tutto ciò che desideri e riceverlo
              comodamente a casa tua, zero sbatti!
            </h6>
          </div>
        </Col>
      </Row>
      <div className="w-100">
        <img src={bottomBg} alt="background" style={{ width: "100%" }} />
      </div>
    </>
  );
};

export default InfoSection;
