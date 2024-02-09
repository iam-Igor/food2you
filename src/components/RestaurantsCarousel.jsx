import { Button, Card, Col, Row } from "react-bootstrap";
import "react-multi-carousel/lib/styles.css";

import sushiimg from "../assets/img/sushi.jpeg";

import pizza from "../assets/img/pizza2.jpeg";

import pasta from "../assets/img/pasta.jpeg";

import kebab from "../assets/img/kebab.jpeg";

import fastfood from "../assets/img/fast-food.jpeg";
import Carousel from "react-multi-carousel";
import { useNavigate } from "react-router-dom";

const RestaurantsCarousel = () => {
  const navigate = useNavigate();

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

  return (
    <>
      <h3 className="text-center my-3">Cosa vuoi mangiare oggi?</h3>
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
        className="pb-1 "
      >
        <Card
          className="rounded-4 shadow-bottom  me-2 p-3 shadow-card-carousel ms-4"
          onClick={() => {
            navigate("/restaurants/pizza");
          }}
        >
          <div className="text-center">
            <Card.Img
              variant="top"
              src={pizza}
              className="rounded-4 restaurant-img "
            />
          </div>
          <Card.Body>
            <Card.Title className="text-center">Pizza</Card.Title>
          </Card.Body>
        </Card>
        <Card
          className="rounded-4 shadow-bottom  me-2 p-3 shadow-card-carousel ms-4"
          onClick={() => {
            navigate("/restaurants/kebab");
          }}
        >
          <div className="text-center">
            <Card.Img
              variant="top"
              src={kebab}
              className="rounded-4 restaurant-img "
            />
          </div>
          <Card.Body>
            <Card.Title className="text-center">Kebab</Card.Title>
          </Card.Body>
        </Card>
        <Card
          className="rounded-4 shadow-bottom  me-2 p-3 shadow-card-carousel ms-4"
          onClick={() => {
            navigate("/restaurants/pasta");
          }}
        >
          <div className="text-center">
            <Card.Img
              variant="top"
              src={pasta}
              className="rounded-4 restaurant-img "
            />
          </div>
          <Card.Body>
            <Card.Title className="text-center">Ristoranti</Card.Title>
          </Card.Body>
        </Card>
        <Card
          className="rounded-4 shadow-bottom  me-2 p-3 shadow-card-carousel ms-4"
          onClick={() => {
            navigate("/restaurants/fast_food");
          }}
        >
          <div className="text-center">
            <Card.Img
              variant="top"
              src={fastfood}
              className="rounded-4 restaurant-img "
            />
          </div>
          <Card.Body>
            <Card.Title className="text-center">Fast food</Card.Title>
          </Card.Body>
        </Card>
        <Card
          className="rounded-4 shadow-bottom  me-2 p-3 shadow-card-carousel ms-4"
          onClick={() => {
            navigate("/restaurants/sushi");
          }}
        >
          <div className="text-center">
            <Card.Img
              variant="top"
              src={sushiimg}
              className="rounded-4 restaurant-img "
            />
          </div>
          <Card.Body>
            <Card.Title className="text-center">Sushi</Card.Title>
          </Card.Body>
        </Card>
      </Carousel>
    </>
  );
};

export default RestaurantsCarousel;
