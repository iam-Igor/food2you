import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import userMarker from "../assets/img/pngaaa.com-2702232.png";
import { LinearProgress } from "@mui/material";
import ChatBubble from "./ChatBubble";
import ReviewsSection from "./ReviewsSection";
import { evaluateError, getPositionDataSingleString } from "../functions";

const OrderStatus = () => {
  const dispatch = useDispatch();

  const [userLat, setUserLat] = useState(0);
  const [userLon, setUserLon] = useState(0);

  const darkMode = useSelector((state) => state.darkModeEnabled);

  const navigate = useNavigate();

  const urlParams = useParams();

  const [orderStatus, setOrderStatus] = useState("");

  const [showChat, setShowChat] = useState(false);

  const [progressTime, setProgressTime] = useState(0);

  const [restaurantCoords, setRestaurantCoords] = useState({
    lon: null,
    lat: null,
  });

  const [orderReady, setorderReady] = useState(false);
  const [orderDelivered, setDelivered] = useState(false);

  const containerStyle = {
    width: "100%",
    height: "350px",
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  dispatch({ type: "SHOW_NOTIFICATION", payload: false });

  const retrieveOrderData = () => {
    fetch("http://localhost:3030/orders/print?order_id=" + urlParams.id, {
      headers: {
        Authorization: localStorage.getItem("tokenUser"),
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          evaluateError(res.status, navigate, dispatch);
        }
      })
      .then((data) => {
        setRestaurantCoords({
          lat: data.restaurant.longitude,
          lon: data.restaurant.latitude,
        });

        setOrderStatus(data.orderStatus);
        if (data.orderStatus !== "CONSEGNATO") {
          getPositionDataSingleString(data.userPosition).then((res) => {
            if (typeof res !== "number") {
              setUserLat(res.results[0].geometry.location.lat);
              setUserLon(res.results[0].geometry.location.lng);
            } else {
              evaluateError(res.status, navigate, dispatch);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        evaluateError(err.status, navigate, dispatch);
      });
  };

  const updateTimer = () => {
    const duration = 10000;

    const updateProgress = () => {
      setProgressTime((prevProgress) => {
        const newProgress = prevProgress + (100 / duration) * 1000;
        return newProgress < 100 ? newProgress : 100;
      });
    };

    const intervalId = setInterval(updateProgress, 1000);

    return () => clearInterval(intervalId);
  };

  const setOrderDelivered = () => {
    fetch("http://localhost:3030/orders/deliver/" + urlParams.id, {
      method: "PATCH",
      headers: {
        Authorization: localStorage.getItem("tokenUser"),
      },
    })
      .then((res) => {
        if (res.ok) {
        } else {
          evaluateError(res.status, navigate, dispatch);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    retrieveOrderData();

    const duration = 10000;
    const startTime = Date.now();

    if (orderStatus !== "CONSEGNATO") {
      const moveRider = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime < duration) {
          // Calcola la nuova posizione interpolando tra la posizione di partenza e quella di destinazione
          const progress = elapsedTime / duration;
          const newLat =
            restaurantCoords.lat + (userLat - restaurantCoords.lat) * progress;
          const newLng =
            restaurantCoords.lon + (userLon - restaurantCoords.lon) * progress;

          // Aggiorna la posizione
          setRestaurantCoords({ lat: newLat, lon: newLng });

          // Richiama la funzione moveRider al prossimo frame di animazione
          requestAnimationFrame(moveRider);
        } else {
          setOrderDelivered(true);
          setShowChat(true);
          setDelivered(true);
        }
      };

      // Avvia il movimento
      if (userLon !== null && userLat !== null && progressTime === 100) {
        moveRider();
      }
    }

    updateTimer();
  }, [orderReady, progressTime === 100]);

  return (
    <Container
      fluid
      className={
        darkMode
          ? "bg-black text-white p-0 overflow-x-hidden "
          : "p-0 overflow-x-hidden "
      }
    >
      {orderStatus !== "CONSEGNATO" ? (
        <Row className=" py-5 flex-column align-items-center">
          <Col className="mb-4 col-12 col-md-8 px-4 px-md-0">
            <h4>
              {progressTime < 100
                ? "Il tuo ordine è in preparazione.."
                : "Il tuo rider è partito, seguilo sulla mappa!"}
            </h4>
            <LinearProgress variant="determinate" value={progressTime} />
            <div className="d-flex justify-content-between">
              <p>In preparazione</p>
              <p>Pronto</p>
            </div>
          </Col>
          {isLoaded && (
            <Col className="col-10 col-md-8 border border-2 p-0 shadow-btm mt-4">
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={14}
                center={{ lat: userLat, lng: userLon }}
              >
                <Marker
                  position={{ lat: userLat, lng: userLon }}
                  icon={{
                    url: userMarker,
                    anchor: new window.google.maps.Point(32, 32),
                    scaledSize: new window.google.maps.Size(38, 50),
                  }}
                />
                <Marker
                  position={{
                    lat: restaurantCoords.lat,
                    lng: restaurantCoords.lon,
                  }}
                  icon={{
                    url: "https://freeiconshop.com/wp-content/uploads/edd/car-flat.png",
                    anchor: new window.google.maps.Point(32, 32),
                    scaledSize: new window.google.maps.Size(38, 38),
                  }}
                ></Marker>
              </GoogleMap>
            </Col>
          )}
          {orderDelivered && (
            <Col className="mb-4 col-12 col-md-8 mt-5">
              <h4>
                Il rider è arrivato a destinazione, apri la chat per info!
              </h4>
            </Col>
          )}
        </Row>
      ) : (
        <Row className="mt-0">
          <Col>
            <h3
              className={
                darkMode ? "text-center mt-4 text-white" : "text-center mt-4"
              }
            >
              Questo ordine risulta gia consegnato.
            </h3>
          </Col>
        </Row>
      )}
      {showChat && <ChatBubble />}
      <ReviewsSection />
    </Container>
  );
};

export default OrderStatus;
