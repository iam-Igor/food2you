import { useEffect, useState } from "react";
import { Button, Card, Form, Modal, Row } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import { Rating } from "react-simple-star-rating";

import topBg from "../assets/img/reviews_top.svg";
import bottomBg from "../assets/img/reviews_bottom.svg";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  console.log(rating);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

    // other logic
  };

  const showStarsRating = (obj) => {
    const starsArray = [];

    for (let i = 0; i < obj.rating; i++) {
      starsArray.push(<i className="bi bi-star-fill text-warning"></i>);
    }

    return starsArray;
  };

  const reviewPayload = {
    message: message,
    rating: rating,
  };

  const saveReview = () => {
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
          console.log("Recensione salvata");
        } else {
          throw new Error("errore nel salvataggio della review");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllreviews = () => {
    fetch("http://localhost:3030/reviews/all")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Error in fetching reviews data");
        }
      })
      .then((data) => {
        console.log(data, "reviews");
        setReviews(data);
      })
      .catch((err) => [console.log(err)]);
  };

  useEffect(() => {
    getAllreviews();
  }, []);

  return (
    <>
      <div className="w-100">
        <img src={topBg} alt="background" style={{ width: "100%" }} />
      </div>
      <Row className="justify-content-center px-2 reviews-container">
        <h4 className="text-center mt-2">Recensioni dei nostri clienti</h4>
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
            className="py-5 mb-4"
          >
            {reviews.map((rev, i) => {
              return (
                <Card className="mx-md-2 p-4 rounded-4 shadow-card me-4">
                  <Card.Body key={i}>
                    <Card.Title>
                      <i className="bi bi-person"></i>
                      Autore
                    </Card.Title>
                    {showStarsRating(rev)}
                    <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                    <Card.Text>{rev.message}</Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
          </Carousel>
        )}
        <h4 className="text-center pointer" onClick={handleShow}>
          Dicci la tua!<i className="bi bi-pencil-square ms-2"></i>
        </h4>
      </Row>
      <div className="w-100">
        <img src={bottomBg} alt="background" style={{ width: "100%" }} />
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi una recensione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
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
