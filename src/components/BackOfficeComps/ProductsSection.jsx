import {
  Alert,
  Button,
  Col,
  Form,
  ListGroup,
  Modal,
  Pagination,
} from "react-bootstrap";
import {
  addNewProduct,
  deleteProduct,
  findProdsByName,
  getAllProducts,
  getAllRestaurants,
  updateProduct,
} from "../../functions";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ProductsSection = () => {
  //variabile per i dati di tutti i ristoranti
  const [restaurants, setRestaurants] = useState(null);

  //show del modale per l'aggiunta di un nuovo prodotto
  const [showModalNewProd, setShowModalNewProd] = useState(false);

  //se il prodotto è salvato cambio la variabile
  const [savedProduct, setSavedProduct] = useState(false);

  // se il prodotto è stato modificato cambio la variabile
  const [updatedProduct, setUpdatedProduct] = useState(false);

  //hook per visualizzare errore nel form di aggiunta prodotto
  const [uploadError, setUploadError] = useState(false);

  //gestisco se visualizzare o meno la lista dei prodotti
  const [showProducts, setShowProducts] = useState(false);

  // ottengo tutti i prodotti dalla fetch
  const [products, setProducts] = useState(null);

  //hook per gestire show del modale per dettaglio prodotto
  const [showProdDetail, setShowProdDetails] = useState(false);

  // setto il prodotto scelto
  const [chosenProduct, setChosenProduct] = useState(null);

  // hooks per il payload
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0.0);
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [type, setType] = useState("");
  const [restaurantId, setRestaurantId] = useState(0);

  // hooks per la get dei prodotti

  const [page, setpage] = useState(0);
  const [size, setSize] = useState(15);
  const [order, setorder] = useState("");
  const [searchInput, setSearchInput] = useState("");

  //trigger per il confirmation modal per eliminare un prodotto
  const [showConfirm, setShowConfirm] = useState(false);

  const getProducts = () => {
    getAllProducts(page, size, order).then((data) => {
      setProducts(data);
    });
  };

  const payload = {
    name: name,
    price: price,
    ingredients: ingredients,
    description: description,
    calories: calories,
    type: type,
    restaurantId: restaurantId,
  };

  const updatePayload = {
    name: name,
    price: price,
    ingredients: ingredients,
    description: description,
    calories: calories,
    type: type,
  };

  const getRestaurants = () => {
    getAllRestaurants().then((data) => {
      setRestaurants(data);
    });
  };

  const deleteProd = (id) => {
    deleteProduct(id);
    setShowProdDetails(false);
  };

  useEffect(() => {
    if (!restaurants) {
      getRestaurants();
    }
  }, [products]);

  useEffect(() => {
    getProducts();
    if (searchInput !== "") {
      findProdsByName(page, size, order, searchInput).then((data) => {
        setProducts(data);
      });
    }
  }, [order, page, size, searchInput]);

  return (
    <>
      <Col className="d-flex justify-content-center">
        <Button
          className="btn-success"
          onClick={() => {
            setShowModalNewProd(true);
          }}
        >
          Aggiungi nuovo
        </Button>
        <Button
          className="ms-3"
          onClick={() => {
            getProducts();
            setShowProducts(!showProducts);
          }}
        >
          Visualizza prodotti
        </Button>
        <Modal
          show={showModalNewProd}
          onHide={() => {
            setShowModalNewProd(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Aggiungi nuovo prodotto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {uploadError && (
              <Alert variant="danger">
                Errore nel salvataggio del prodotto!
              </Alert>
            )}

            <Form
              onSubmit={(e) => {
                e.preventDefault();
                addNewProduct(payload).then((res) => {
                  if (res) {
                    setSavedProduct(true);
                    setTimeout(() => {
                      setShowModalNewProd(false);
                      setSavedProduct(false);
                    }, 2000);
                  } else {
                    setUploadError(true);
                  }
                });
              }}
            >
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Nome prodotto"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Prezzo</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Prezzo in euro"
                  onChange={(e) => {
                    setPrice(parseInt(e.target.value));
                  }}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Ingredienti</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Valori separati da una virgola"
                  onChange={(e) => {
                    setIngredients(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Descrizione</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  as="textarea"
                  placeholder="Descrizione del prodotto"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Calorie</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder=""
                  onChange={(e) => {
                    setCalories(parseInt(e.target.value));
                  }}
                />
              </Form.Group>
              <Form.Select
                required
                aria-label="Default select example"
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                <option value="">Tipo</option>
                <option value="DRINK">Drink</option>
                <option value="FOOD">Cibo</option>
              </Form.Select>
              <Form.Group>
                {restaurants && (
                  <Form.Select
                    required
                    aria-label="Default select example"
                    className="mt-3"
                    onChange={(e) => {
                      setRestaurantId(parseInt(e.target.value));
                    }}
                  >
                    <option value="">Ristorante assegnato</option>
                    {restaurants.map((rest, i) => {
                      return (
                        <option key={i} value={rest.id}>
                          {rest.id}, {rest.city},{rest.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                )}
              </Form.Group>
              {savedProduct ? (
                <div className="success-animation d-flex justify-content-center ms-4 mb-3">
                  <svg
                    className="checkmark mt-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark__circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark__check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </div>
              ) : (
                <Button className="mt-2" type="submit" variant="success">
                  Salva
                </Button>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModalNewProd(false);
              }}
            >
              Annulla
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
      {showProducts && products && (
        <Col className="d-flex flex-column">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <Form.Select
              aria-label="Default select example"
              className="my-3"
              onChange={(e) => {
                setorder(e.target.value);
              }}
            >
              <option value="id">Ordina per</option>
              <option value="id">ID</option>
              <option value="name">Nome</option>
              <option value="price">Prezzo</option>
            </Form.Select>
            <Form.Select
              aria-label="Default select example"
              className="my-md-3 mx-md-2"
              onChange={(e) => {
                setSize(e.target.value);
              }}
            >
              <option value="15">Elementi</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </Form.Select>

            <Form.Control
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              type="text"
              placeholder="Cerca per nome"
              size="sm"
              className="search-input-products mt-3 mt-md-0"
            />
          </div>
          {products.content.map((prod, i) => {
            return (
              <ListGroup.Item
                key={prod.id}
                as="li"
                className="mt-2 d-flex pointer"
                onClick={() => {
                  setChosenProduct(prod);
                  setName(prod.name);
                  setCalories(prod.calories);
                  setDescription(prod.description);
                  setIngredients(prod.ingredients);
                  setPrice(prod.price);
                  setShowProdDetails(true);
                }}
              >
                <span className="fw-bold me-2">ID: {prod.id}</span>
                {prod.name}, {prod.price} €
                <i className="bi bi-pencil ms-auto"></i>
              </ListGroup.Item>
            );
          })}
          <Pagination className="align-self-center mt-3">
            <Pagination.Prev
              onClick={() => {
                if (page > 0) {
                  setpage(page - 1);
                }
              }}
            />
            <Pagination.Item
              active={page === 0 ? true : false}
              onClick={() => {
                setpage(0);
              }}
            >
              {1}
            </Pagination.Item>
            <Pagination.Item
              active={page === 1 ? true : false}
              onClick={() => {
                setpage(1);
              }}
            >
              {2}
            </Pagination.Item>
            <Pagination.Item
              active={page === 2 ? true : false}
              onClick={() => {
                setpage(2);
              }}
            >
              {3}
            </Pagination.Item>
            <Pagination.Item
              active={page > 2 && page < products.totalPages - 1 ? true : false}
            >
              {page > 2 && page < products.totalPages - 1 ? page + 1 : 4}
            </Pagination.Item>
            <Pagination.Item
              active={page === products.totalPages - 1 ? true : false}
              onClick={() => {
                setpage(products.totalPages - 1);
              }}
            >
              {products.totalPages - 1}
            </Pagination.Item>
            <Pagination.Next
              onClick={() => {
                if (page < products.totalPages - 1) {
                  setpage(page + 1);
                }
              }}
            />
          </Pagination>
          {chosenProduct && (
            <Modal
              show={showProdDetail}
              onHide={() => {
                setShowProdDetails(false);
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Modifica prodotto: ID: {chosenProduct.id}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProduct(updatePayload, chosenProduct.id).then(
                      (res) => {
                        if (res) {
                          setUpdatedProduct(true);
                          setTimeout(() => {
                            setShowProdDetails(false);
                            setUpdatedProduct(false);
                          }, 2000);
                        } else {
                          setUploadError(true);
                        }
                      }
                    );
                  }}
                >
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      value={name}
                      required
                      type="text"
                      placeholder="Nome prodotto"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Prezzo</Form.Label>
                    <Form.Control
                      value={price}
                      required
                      type="number"
                      placeholder="Prezzo in euro"
                      onChange={(e) => {
                        setPrice(parseInt(e.target.value));
                      }}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Ingredienti</Form.Label>
                    <Form.Control
                      value={ingredients}
                      required
                      type="text"
                      placeholder="Valori separati da una virgola"
                      onChange={(e) => {
                        setIngredients(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Descrizione</Form.Label>
                    <Form.Control
                      value={description}
                      required
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      as="textarea"
                      placeholder="Descrizione del prodotto"
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Calorie</Form.Label>
                    <Form.Control
                      value={calories}
                      required
                      type="number"
                      placeholder=""
                      onChange={(e) => {
                        setCalories(parseInt(e.target.value));
                      }}
                    />
                  </Form.Group>
                  <Form.Select
                    value={type}
                    required
                    aria-label="Default select example"
                    onChange={(e) => {
                      setType(e.target.value);
                    }}
                  >
                    <option value="">Tipo</option>
                    <option value="DRINK">Drink</option>
                    <option value="FOOD">Cibo</option>
                  </Form.Select>
                  {updatedProduct ? (
                    <div className="success-animation d-flex justify-content-center ms-4 mb-3">
                      <svg
                        className="checkmark mt-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 52 52"
                      >
                        <circle
                          className="checkmark__circle"
                          cx="26"
                          cy="26"
                          r="25"
                          fill="none"
                        />
                        <path
                          className="checkmark__check"
                          fill="none"
                          d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        />
                      </svg>
                    </div>
                  ) : (
                    <Button className="mt-2" type="submit" variant="success">
                      Salva
                    </Button>
                  )}
                  <Button
                    className="mt-2 btn-danger ms-2"
                    onClick={() => {
                      setShowConfirm(true);
                    }}
                  >
                    Elimina
                  </Button>
                  <Dialog
                    onClose={() => {
                      setShowConfirm(false);
                    }}
                    open={showConfirm}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Sicuro di volere eliminare il prodotto?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Questa azione sarà irreversibile.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setShowConfirm(false);
                        }}
                      >
                        Annulla
                      </Button>
                      <Button
                        variant="danger"
                        autoFocus
                        onClick={() => {
                          deleteProd(chosenProduct.id);
                          setShowConfirm(false);
                        }}
                      >
                        Elimina
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowProdDetails(false);
                  }}
                >
                  Annulla
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </Col>
      )}
    </>
  );
};

export default ProductsSection;
