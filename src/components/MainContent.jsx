import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { googleApikey } from "../apifile";
import { useEffect, useState } from "react";

import userMarker from "../assets/img/pngaaa.com-2702232.png";

const MainContent = ({ google }) => {
  const long = useSelector((state) => state.lon);
  const lat = useSelector((state) => state.lat);

  const city = useSelector((state) => state.userPosition);

  const [restaurants, setRestaurants] = useState(null);
  console.log(restaurants);

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

  const containerStyle = {
    position: "relative",
    width: "100",
    height: "350px",
  };

  useEffect(() => {
    if (city !== "") {
      getRestaurants();
    }
  }, [city]);

  return (
    <Row className="justify-content-center py-5">
      <h3 className="text-center">
        Clicca su uno dei punti evidenziati nella mappa
      </h3>
      <Col className="col-12 col-md-8 border border-2 p-0">
        {restaurants && (
          <Map
            google={google}
            zoom={15}
            containerStyle={containerStyle}
            initialCenter={{ lat: lat, lng: long }}
          >
            <Marker
              position={{ lat: lat, lng: long }}
              icon={{
                url: userMarker,
                anchor: new window.google.maps.Point(32, 32),
                scaledSize: new window.google.maps.Size(38, 50),
              }}
            ></Marker>
            {restaurants.map((rest, i) => {
              return (
                <Marker
                  key={i}
                  position={{ lat: rest.longitude, lng: rest.latitude }}
                ></Marker>
              );
            })}
          </Map>
        )}
      </Col>
    </Row>
  );
};

export default GoogleApiWrapper({
  apiKey: googleApikey,
})(MainContent);
