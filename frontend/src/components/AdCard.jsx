// AdCard.js
import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";

const AdCard = ({ ad, handleDeleteClick }) => (
  <Card key={ad.id} className="ad-card" style={{ marginBottom: "20px" }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {ad.title}
      </Typography>
      <Typography variant="body1">{ad.description}</Typography>
      <Typography variant="body2" color="text.secondary">
        Опубліковано: {ad.date}
      </Typography>
      <Box sx={{ mt: 2, display: "flex", gap: 2, color: "text.secondary" }}>
        <Typography variant="body2">
          <span
            className="material-icons"
            style={{ fontSize: "16px", verticalAlign: "text-bottom" }}
          >
            visibility
          </span>
          {ad.views} переглядів
        </Typography>
        <Typography variant="body2">
          <span
            className="material-icons"
            style={{ fontSize: "16px", verticalAlign: "text-bottom" }}
          >
            chat
          </span>
          {ad.responses} відгуків
        </Typography>
      </Box>
    </CardContent>
    <div className="ad-actions">
      <Button
        size="small"
        startIcon={<span className="material-icons">edit</span>}
        style={{ marginRight: "8px" }}
      >
        Редагувати
      </Button>
      <Button
        size="small"
        color="error"
        startIcon={<span className="material-icons">delete</span>}
        onClick={() => handleDeleteClick(ad)}
      >
        Видалити
      </Button>
    </div>
  </Card>
);

export default AdCard;
