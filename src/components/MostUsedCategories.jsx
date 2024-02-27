import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getCategoriesMostUsed } from "../functions";

import topBg from "../assets/img/categories-top.svg";
import bottomBg from "../assets/img/categories-bottom.svg";

import topBgDark from "../assets/img/darkMode/categories-top-dark.svg";
import bottomBgDark from "../assets/img/darkMode/categories-bottom-dark.svg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MostUsedCategories = () => {
  const [categories, setCategories] = useState({});
  const darkMode = useSelector((state) => state.darkModeEnabled);
  const navigate = useNavigate();

  const getCategories = () => {
    getCategoriesMostUsed().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  const showCategories = () => {
    const array = [];
    const filteredCategories = Object.entries(categories)
      .filter(([category, count]) => count > 1)
      .reduce((obj, [category, count]) => {
        obj[category] = count;
        array.push(
          <div
            key={count}
            className="single-category-show rounded-5 shadow-card zoom"
            onClick={() => {
              navigate("/restaurants/" + category.toLowerCase());
            }}
          >
            {category}
          </div>
        );
        return obj;
      }, {});

    return array;
  };

  useEffect(() => {
    getCategories();
    if (categories) {
      showCategories();
    }
  }, []);

  if (Object.keys(categories).length > 0) {
    return (
      <>
        <div className="w-100">
          <img
            src={darkMode ? topBgDark : topBg}
            alt="background"
            style={{ width: "100%" }}
          />
        </div>
        <Row
          style={{ backgroundColor: "#B2DFDB" }}
          className="flex-column py-5"
        >
          <Col className="mb-3">
            <h4 className="text-center">
              Le categorie che hai usato di più in base ai tuoi ordini recenti
            </h4>
          </Col>
          {categories && (
            <Col className="d-flex justify-content-center my-4">
              {showCategories()}
            </Col>
          )}
        </Row>
        <div className="w-100">
          <img
            src={darkMode ? bottomBgDark : bottomBg}
            alt="background"
            style={{ width: "100%" }}
          />
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default MostUsedCategories;