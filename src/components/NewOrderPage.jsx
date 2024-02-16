import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomMobileNumber } from "../functions";
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const NewOrderPage = () => {
  const restaurantData = useSelector((state) => state.restaurantSelected);
  const cartItems = useSelector((state) => state.cart);

  console.log(cartItems);

  const [food, setFood] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [isFoodSelected, setIsFoodSelected] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(0);

  console.log(typeof quantity, "quantity");

  const [sortBy, setSortBy] = useState("");

  const setCategoryOfproducts = (param) => {
    let newFood = [];
    let newDrinks = [];

    for (let i = 0; i < param.length; i++) {
      if (param[i].productType === "DRINK") {
        newDrinks.push(param[i]);
      } else {
        newFood.push(param[i]);
      }
    }

    setDrinks(newDrinks);
    setFood(newFood);

    setIsChanged(!isChanged);
  };

  const orderArrays = () => {
    let arrayToSort;

    if (isFoodSelected) {
      arrayToSort = [...food];
    } else {
      arrayToSort = [...drinks];
    }

    if (sortBy === "nome") {
      arrayToSort.sort((a, b) => {
        const nomeA = a.name.toLowerCase();
        const nomeB = b.name.toLowerCase();
        if (nomeA < nomeB) {
          return -1;
        }
        if (nomeA > nomeB) {
          return 1;
        }
        return 0;
      });
    } else if (sortBy === "prezzo") {
      arrayToSort.sort((a, b) => a.price - b.price);
    }

    if (isFoodSelected) {
      setFood(arrayToSort);
    } else {
      setDrinks(arrayToSort);
    }
  };

  const addItemsToCart = (item) => {
    let quantityToInt = parseInt(quantity);
    const itemToAdd = { ...item, quantity: quantityToInt };
    dispatch({ type: "ADD_TO_CART", payload: itemToAdd });
  };

  const getProductsList = () => {
    fetch(
      "https://localhost:3030/restaurants/" + restaurantData.id + "/products"
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then((data) => {
        console.log(data);
        setCategoryOfproducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProductsList();
  }, [restaurantData, isFoodSelected]);

  return (
    <Container fluid className="pb-4">
      <Row className="d-flex flex-row justify-content-around pt-4 pb-3 filterHeader scende align-items-center">
        <Col className="col-4 col-md-3">
          <Form.Select
            aria-label="Default select example"
            className="shadow-card"
            onChange={(e) => {
              setSortBy(e.target.value);
              orderArrays();
            }}
          >
            <option value="default">Ordina per</option>
            <option value="prezzo">Nome</option>
            <option value="nome">Prezzo</option>
          </Form.Select>
        </Col>
        <Col className="col-4 col-md-3 ">
          <Form.Select
            aria-label="Default select example"
            className="shadow-card"
            onChange={(e) => {
              setIsFoodSelected(e.target.value === "true");
            }}
          >
            <option value={true}>Cibo</option>
            <option value={false}>Drinks</option>
          </Form.Select>
        </Col>
        <Col className="col-4 col-md-4 text-center">
          <Button
            className="drop-nav border-0 shadow-card"
            onClick={() => {
              dispatch({ type: "SHOW_CART", payload: true });
            }}
          >
            <i className="bi bi-cart4 fs-5 me-2 text-black"></i>{" "}
            <Badge bg="danger">{cartItems.length}</Badge>
          </Button>
        </Col>
      </Row>
      <Row className="py-4">
        {restaurantData && (
          <Col className="mt-4">
            <CardHeader
              avatar={<Avatar aria-label="recipe">F2Y</Avatar>}
              action={<IconButton aria-label="settings"></IconButton>}
              title={restaurantData.name}
            />
            <Card
              sx={{ maxWidth: 745 }}
              className="d-flex flex-column flex-md-row"
            >
              <CardMedia
                component="img"
                height="194"
                image={restaurantData.imageUrl}
                alt="restaurant-image"
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
            </Card>
          </Col>
        )}
      </Row>

      {food && isFoodSelected && (
        <>
          <h4 className="text-center mt-3">
            Seleziona i prodotti da aggiungere al carrello
          </h4>
          <Row className="row-cols-1 row-cols-md-4">
            {food.map((food, i) => {
              return (
                <Col key={i} className="mt-3">
                  <Card sx={{ maxWidth: 345 }} className="mt-3">
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={food.imageUrl}
                        alt="food"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {food.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="truncate"
                        >
                          {food.description}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="mt-2 truncate"
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
                        <CardActions className="ps-0">
                          <Form
                            className="d-flex w-100"
                            onSubmit={(e) => {
                              e.preventDefault();
                              console.log("carrelloooo");
                              addItemsToCart(food);
                            }}
                          >
                            {" "}
                            <Button
                              type="submit"
                              size="small"
                              color="primary"
                              className="drop-nav border-0 shadow-card me-2"
                            >
                              <i className="bi bi-cart4 fs-5 me-2 text-black"></i>
                            </Button>
                            <Form.Select
                              required
                              onChange={(e) => {
                                setQuantity(e.target.value);
                              }}
                            >
                              <option value="">Quantità</option>
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                            </Form.Select>
                          </Form>
                        </CardActions>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}
      {drinks && !isFoodSelected && (
        <>
          <h4 className="text-center mt-3">
            Seleziona i prodotti da aggiungere al carrello
          </h4>
          <Row className="row-cols-1 row-cols-md-4">
            {drinks.map((drink, i) => {
              return (
                <Col key={i} className="mt-3">
                  <Card sx={{ maxWidth: 345 }} className="mt-3 ">
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={drink.imageUrl}
                        alt="food"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {drink.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="truncate"
                        >
                          {drink.description}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="mt-2 truncate"
                        >
                          Ingredienti: {drink.ingredients}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="mt-2"
                        >
                          {drink.price}€
                        </Typography>
                        <CardActions className="ps-0">
                          <Form
                            className="d-flex w-100"
                            onSubmit={(e) => {
                              e.preventDefault();
                              addItemsToCart(drink);
                            }}
                          >
                            {" "}
                            <Button
                              type="submit"
                              size="small"
                              color="primary"
                              className="drop-nav border-0 shadow-card me-2"
                            >
                              <i className="bi bi-cart4 fs-5 me-2 text-black"></i>
                            </Button>
                            <Form.Select
                              required
                              onChange={(e) => {
                                setQuantity(e.target.value);
                              }}
                            >
                              <option value="">Quantità</option>
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                            </Form.Select>
                          </Form>
                        </CardActions>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </Container>
  );
};

export default NewOrderPage;
