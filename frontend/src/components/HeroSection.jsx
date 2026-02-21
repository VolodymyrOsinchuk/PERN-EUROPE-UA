import { Typography, Container, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";
const HeroSection = ({
  typedStrings = [],
  subtitle,
  buttonText,
  buttonLink,
  textColor = "inherit",
}) => {
  // heroStyles removed (unused) — styling is handled in CSS
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
