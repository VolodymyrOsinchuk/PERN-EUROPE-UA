import { Button, Typography } from "@mui/material";
import { Link, useRouteError } from "react-router-dom";

import "../assets/css/error.css";
const ErrorPage = () => {
  const error = useRouteError();
  // console.log("🚀 ~ ErrorPage ~ error:", error);
  if (error.status === 404) {
    return (
      <div className="error-container">
        <div className="error-animation">
          <h1 className="error-code">404</h1>
          <Typography variant="h4" gutterBottom>
            Упс! Сторінку не знайдено
          </Typography>
        </div>
        <Typography
          variant="body1"
          style={{ maxWidth: "600px", margin: "20px auto" }}
        >
          На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
          Можливо, ви перейшли за застарілим посиланням або допустили помилку в
          адресі.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<span className="material-icons">home</span>}
        >
          <Link style={{ color: "white", textDecoration: "none" }} to="/">
            Повернутися на головну
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="error-container">
      <div className="error-animation">
        {/* <h1 className="error-code">404</h1> */}
        <Typography variant="h3" gutterBottom>
          Щось пішло не так.
        </Typography>
      </div>
      {/* <Typography
        variant="body1"
        style={{ maxWidth: "600px", margin: "20px auto" }}
      >
        На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
        Можливо, ви перейшли за застарілим посиланням або допустили помилку в
        адресі.
      </Typography> */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<span className="material-icons">home</span>}
      >
        <Link style={{ color: "white", textDecoration: "none" }} to="/">
          Повернутися на головну
        </Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
