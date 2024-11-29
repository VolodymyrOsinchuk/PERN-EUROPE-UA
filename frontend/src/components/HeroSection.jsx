import { Typography, Container, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";
const HeroSection = ({
  title,
  typedStrings = [],
  subtitle,
  buttonText,
  buttonLink,
  backgroundImage,
  textAlign = "center",
  textColor = "inherit",
}) => {
  const heroStyles = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: textColor,
    textAlign: textAlign,
    padding: "100px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: textAlign === "center" ? "center" : "flex-start",
  };
  return (
    <div
      // style={heroStyles}
      className="hero"
    >
      <Container>
        <Typography
          variant="h2"
          gutterBottom
          style={{
            color: textColor,
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          {/* {title}
          {""} */}
          {typedStrings.length > 0 && (
            <ReactTyped
              strings={typedStrings}
              typeSpeed={200}
              backSpeed={150}
              loop
            />
          )}
        </Typography>

        {subtitle && (
          <Typography
            variant="h5"
            gutterBottom
            style={{
              color: textColor,
              marginBottom: "30px",
            }}
          >
            {subtitle}
          </Typography>
        )}

        {buttonText && (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            LinkComponent={Link}
            to={buttonLink}
            style={{ marginTop: "20px" }}
          >
            {buttonText}
          </Button>
        )}
      </Container>
    </div>
  );
};

export default HeroSection;
