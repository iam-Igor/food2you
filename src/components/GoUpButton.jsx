import { Button } from "react-bootstrap";

const GoUpButton = () => {
  const goUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      onClick={goUp}
      className="go-up-btn border-0 rounded-circle shadow-card text-black"
    >
      <i className="bi bi-chevron-double-up fs-3"></i>
    </Button>
  );
};

export default GoUpButton;
