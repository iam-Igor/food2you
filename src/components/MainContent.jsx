import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import userMarker from "../assets/img/pngaaa.com-2702232.png";
import restMarker from "../assets/img/rest_marker.png";

const containerStyle = {
  width: "100%",
  height: "350px",
};

const MainContent = () => {
  const long = useSelector((state) => state.lon);
  const lat = useSelector((state) => state.lat);
  const dispatch = useDispatch();
  const city = useSelector((state) => state.userPosition);

  const [restaurants, setRestaurants] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const getRestaurants = () => {
    fetch("http://localhost:3030/restaurants/city/" + city)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nel caricamento della città selezionata");
        }
      })
      .then((data) => {
        setRestaurants(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (city !== "") {
      getRestaurants();
    }
  }, [city]);

  return (
    <Row className="justify-content-center py-5">
      <h3 className="text-center">
        {restaurants ? " Clicca su uno dei punti evidenziati nella mappa" : ""}
      </h3>
      {restaurants && (
        <Col className="col-12 col-md-8 border border-2 p-0 shadow-btm">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={15}
              center={{ lat: lat, lng: long }}
            >
              <Marker
                position={{ lat: lat, lng: long }}
                icon={{
                  url: userMarker,
                  anchor: new window.google.maps.Point(32, 32),
                  scaledSize: new window.google.maps.Size(38, 50),
                }}
              />
              {restaurants.map((rest, i) => {
                return (
                  <Marker
                    key={i}
                    position={{ lat: rest.longitude, lng: rest.latitude }}
                    onClick={() => {
                      dispatch({ type: "SHOW_OFF_CANVAS", payload: true });
                      dispatch({ type: "SET_REST_SELECTED", payload: rest });
                    }}
                    icon={{
                      url: restMarker,
                      anchor: new window.google.maps.Point(32, 32),
                      scaledSize: new window.google.maps.Size(50, 50),
                    }}
                  />
                );
              })}
            </GoogleMap>
          )}
        </Col>
      )}
    </Row>
  );
};

export default MainContent;
