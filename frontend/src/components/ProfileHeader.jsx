// ProfileHeader.js
import React from "react";
import { Avatar, Typography, Container } from "@mui/material";

const ProfileHeader = () => (
  <div className="profile-header">
    <Container style={{ textAlign: "center" }}>
      <Avatar
        src="https://via.placeholder.com/150"
        alt="Профіль користувача"
        className="profile-avatar"
        style={{ width: 150, height: 150, margin: "0 auto 20px" }}
      />
      <Typography variant="h4" gutterBottom>
        Олена Петренко
      </Typography>
      <Typography variant="subtitle1">
        Місце проживання: Берлін, Німеччина
      </Typography>
    </Container>
  </div>
);

export default ProfileHeader;
