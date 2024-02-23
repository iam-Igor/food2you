import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
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
import { Parallax } from "react-scroll-parallax";
import { useNavigate } from "react-router-dom";

const NewOrderPage = () => {
  const restaurantData = useSelector((state) => state.restaurantSelected);
  const cartItems = useSelector((state) => state.cart);

  const [isBouncing, setIsBouncing] = useState(false);

  const [food, setFood] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [isFoodSelected, setIsFoodSelected] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  const darkMode = useSelector((state) => state.darkModeEnabled);

  const [sortBy, setSortBy] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);

  const [showProductDetail, setShowProductDetail] = useState(false);

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
        navigate("/bad_request");
      });
  };

  useEffect(() => {
    getProductsList();
  }, [restaurantData, isFoodSelected]);

  return (
    <Container
      fluid
      className={darkMode ? "pb-4 bg-black" : "pb-4"}
      data-bs-theme={darkMode ? "dark" : "light"}
    >
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
            className="drop-nav border-0 shadow-card rounded-4"
            onClick={() => {
              dispatch({ type: "SHOW_CART", payload: true });
            }}
          >
            <i className="bi bi-cart4 fs-5 me-2 text-black "></i>{" "}
            <Badge bg="success" className={isBouncing ? "bounce" : ""}>
              {cartItems.length}
            </Badge>
          </Button>
        </Col>
      </Row>
      <Parallax speed={10}>
        <Row className="py-4">
          {restaurantData && (
            <Col className="mt-4">
              <CardHeader
                className={darkMode ? "text-white" : ""}
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
      </Parallax>

      {food && isFoodSelected && (
        <>
          <h4
            className={
              darkMode ? "text-center mt-3 text-white" : "text-center mt-3"
            }
          >
            Seleziona i prodotti da aggiungere al carrello
          </h4>

          <Row className="row-cols-1 row-cols-md-4">
            {food.map((food, i) => {
              return (
                <Parallax speed={10}>
                  <Col key={i} className="mt-3">
                    <Card
                      sx={{ maxWidth: 345 }}
                      className="mt-3 rounded-3 shadow-card"
                    >
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={food.imageUrl}
                          alt="food"
                          onClick={() => {
                            setSelectedItem(food);
                            setShowProductDetail(true);
                          }}
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
                                addItemsToCart(food);
                                setIsBouncing(true);
                                setTimeout(() => {
                                  setIsBouncing(false);
                                }, 1000);
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
                </Parallax>
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
                <Parallax key={drink.id} speed={10}>
                  <Col className="mt-3">
                    <Card
                      sx={{ maxWidth: 345 }}
                      className="mt-3 rounded-3 shadow-card"
                    >
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={drink.imageUrl}
                          alt="food"
                          onClick={() => {
                            setSelectedItem(drink);
                            setShowProductDetail(true);
                          }}
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
                                setIsBouncing(true);
                                setTimeout(() => {
                                  setIsBouncing(false);
                                }, 1000);
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
                </Parallax>
              );
            })}
          </Row>
        </>
      )}
      {showProductDetail && selectedItem && (
        <Modal
          show={showProductDetail}
          onHide={() => {
            setShowProductDetail(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Dettagli prodotto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <img
                alt="product-img"
                src={selectedItem.imageUrl}
                style={{ width: "40%" }}
                className="rounded-3 shadow-card"
              />
            </div>
            <div>
              <h6 className="text-center mt-4">{selectedItem.name}</h6>
              <ul>
                <li>Calorie: {selectedItem.calories}</li>
                <li>Ingredienti: {selectedItem.ingredients}</li>
                <li>Prezzo: {selectedItem.price}€</li>
              </ul>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="rounded-3 shadow-card"
              variant="secondary"
              onClick={() => {
                setShowProductDetail(false);
              }}
            >
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default NewOrderPage;
