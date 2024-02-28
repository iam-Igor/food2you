import { useEffect, useState } from "react";
import { Button, Card, Form, Modal, Row } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import { Rating } from "react-simple-star-rating";

import topBg from "../assets/img/reviews_top.svg";
import bottomBg from "../assets/img/reviews_bottom.svg";

import topBgDark from "../assets/img/darkMode/reviews_top-dark.svg";
import bottomBgDark from "../assets/img/darkMode/reviews_bottom-dark.svg";

import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { evaluateError } from "../functions";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const darkMode = useSelector((state) => state.darkModeEnabled);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = localStorage.getItem("tokenUser");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [error, setError] = useState(false);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  const showStarsRating = (obj) => {
    const starsArray = [];

    for (let i = 0; i < obj.rating; i++) {
      starsArray.push(
        <i key={`${obj.id}-${i}`} className="bi bi-star-fill text-warning"></i>
      );
    }

    return starsArray;
  };

  const reviewPayload = {
    message: message,
    rating: rating,
  };

  const saveReview = () => {
    if (message !== "" && rating > 0) {
      fetch("http://localhost:3030/reviews/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("tokenUser"),
        },
        body: JSON.stringify(reviewPayload),
      })
        .then((res) => {
          if (res.ok) {
            setError(false);
            setShow(false);
          } else {
            throw res;
          }
        })
        .catch((err) => {
          console.log(err);
          setShow(false);
          setError(false);
          evaluateError(err.status, navigate, dispatch);
        });
    } else {
      setError(true);
    }
  };

  const getAllreviews = () => {
    fetch("http://localhost:3030/reviews/all")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((data) => {
        setReviews(data);
      })
      .catch((err) => {
        console.log(err);
        evaluateError(err.status, navigate, dispatch);
      });
  };

  useEffect(() => {
    getAllreviews();
  }, []);

  return (
    <>
      <div className="w-100">
        <img
          src={darkMode ? topBgDark : topBg}
          alt="background"
          style={{ width: "100%" }}
        />
      </div>
      <Row className="justify-content-center px-2 pe-md-4 reviews-container">
        <h4 className="text-center mt-2">Recensioni dei nostri clienti 📝</h4>
        {reviews && (
          <Carousel
            swipeable={true}
            draggable={false}
            showDots={false}
            responsive={responsive}
            ssr={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            transitionDuration={500}
            containerClass="carousel-container"
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            deviceType="desktop"
            renderDotsOutside
            className="py-5 mb-4 "
          >
            {reviews.map((rev, i) => {
              return (
                <Card
                  key={rev.id}
                  className="mx-md-2 p-4 rounded-4 shadow-card me-4"
                  style={{ height: "180px" }}
                >
                  <Card.Body>
                    <Card.Title>
                      <i className="bi bi-person me-2"></i>
                      {rev.username}
                    </Card.Title>
                    {showStarsRating(rev, i)}
                    <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                    <Card.Text>{rev.message}</Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
          </Carousel>
        )}
        <div className="text-center w-75 py-2">
          {" "}
          <h6>Il tuo pensiero per noi è importante 💛</h6>
          <Button
            className="text-center pointer btn-warning btn w-50 rounded-4 shadow-card"
            onClick={() => {
              if (userData) {
                handleShow();
              } else {
                dispatch({ type: "SHOW_LOGIN_MODAL", payload: true });
              }
            }}
          >
            Dicci la tua!<i className="bi bi-pencil-square ms-2"></i>
          </Button>
        </div>
      </Row>
      <div>
        <img
          src={darkMode ? bottomBgDark : bottomBg}
          alt="background"
          style={{ width: "100%" }}
        />
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex justify-content-center w-100">
            Valuta la nostra app
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                maxLength={200}
                as="textarea"
                rows={3}
                placeholder="Cosa pensi di noi?"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
            </Form.Group>
            <Rating
              onClick={handleRating}
              // onPointerEnter={onPointerEnter}
              // onPointerLeave={onPointerLeave}
              // onPointerMove={onPointerMove}
              // /* Available Props */
            />
            {error && (
              <Alert severity="error" className="mt-2">
                Inserisci un messaggio e/o valuta il servizio.
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={handleClose}
            className="rounded-4 shadow-card"
          >
            Annulla
          </Button>
          <Button
            variant="warning"
            className="rounded-4 shadow-card"
            onClick={saveReview}
          >
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReviewsSection;
