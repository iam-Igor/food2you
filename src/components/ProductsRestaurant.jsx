import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import createMobilePhoneNumber from "random-mobile-numbers-extended";
import { useEffect, useState } from "react";
import { Accordion, Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { generateRandomMobileNumber } from "../functions";

const ProductsRestaurant = () => {
  const darkMode = useSelector((state) => state.darkModeEnabled);

  const location = useLocation();
  const show = useSelector((state) => state.showOffCanvas);
  const dispatch = useDispatch();
  const restaurantData = useSelector((state) => state.restaurantSelected);

  const navigate = useNavigate();

  const [showProducts, setShowproducts] = useState(false);

  const [food, setFood] = useState([]);
  const [drinks, setDrinks] = useState([]);

  const setCategoryOfproducts = (param) => {
    const newFood = [];
    const newDrinks = [];

    for (let i = 0; i < param.length; i++) {
      if (param[i].productType === "DRINK") {
        newDrinks.push(param[i]);
      } else {
        newFood.push(param[i]);
      }
    }

    setDrinks(newDrinks);
    setFood(newFood);
  };

  const getProductsList = () => {
    fetch(
      "http://localhost:3030/restaurants/" + restaurantData.id + "/products"
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then((data) => {
        setCategoryOfproducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (show) {
      getProductsList();
    }
  }, [restaurantData]);

  return (
    <>
      {restaurantData && (
        <Offcanvas
          data-bs-theme={darkMode ? "dark" : "light"}
          show={show}
          placement="end"
          onHide={() => dispatch({ type: "SHOW_OFF_CANVAS", payload: false })}
        >
          <Offcanvas.Header closeButton></Offcanvas.Header>
          <Offcanvas.Body>
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={<Avatar aria-label="recipe">F2Y</Avatar>}
                action={<IconButton aria-label="settings"></IconButton>}
                title={restaurantData.name}
              />
              <CardMedia
                component="img"
                height="194"
                image={restaurantData.imageUrl}
                alt="restayrant-image"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  {restaurantData.streetAddress}, {restaurantData.city}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="mt-2"
                >
                  Aperto dalle 08:00 alle 23:00
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="mt-2"
                >
                  <i className="bi bi-telephone-fill me-2"></i>
                  {generateRandomMobileNumber()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    navigate("/order");
                    dispatch({ type: "SHOW_OFF_CANVAS", payload: false });
                  }}
                >
                  Ordina
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    setShowproducts(!showProducts);
                  }}
                >
                  Prodotti
                </Button>
              </CardActions>
            </Card>
            <Card sx={{ maxWidth: 345 }} className="mt-3">
              {showProducts && (
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Cibo</Accordion.Header>
                    <Accordion.Body>
                      {food.map((food, i) => {
                        return (
                          <Card sx={{ maxWidth: 345 }} className="mt-3">
                            <CardActionArea>
                              <CardMedia
                                component="img"
                                height="140"
                                image={food.imageUrl}
                                alt="food"
                              />
                              <CardContent>
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  {food.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {food.description}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  className="mt-2"
                                >
                                  Ingredienti: {food.ingredients}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  className="mt-2"
                                >
                                  {food.price}€
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Drinks</Accordion.Header>
                    <Accordion.Body>
                      {drinks.map((food, i) => {
                        return (
                          <Card sx={{ maxWidth: 345 }} className="mt-3">
                            <CardActionArea>
                              <CardMedia
                                component="img"
                                height="140"
                                image={food.imageUrl}
                                alt="drink"
                              />
                              <CardContent>
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  {food.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {food.description}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  className="mt-2"
                                >
                                  Ingredienti: {food.ingredients}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  className="mt-2"
                                >
                                  {food.price}€
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </Card>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </>
  );
};
export default ProductsRestaurant;
