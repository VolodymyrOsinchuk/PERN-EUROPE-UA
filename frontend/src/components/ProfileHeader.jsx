import React, { useRef } from "react";
import { Avatar, Typography, Container, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useProfileContext } from "../layouts/ProfileLayout";
import { apiUrl } from "../utils/customFetch";

const ProfileHeader = ({ profileImage, handleImageChange }) => {
  const { user } = useProfileContext();
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  // Prepend backend URL if the path is relative (e.g. starting with /uploads)
  const avatarSrc = profileImage
    ? profileImage.startsWith("http")
      ? profileImage
      : `${apiUrl}${profileImage}`
    : null;

  return (
    <div className="profile-header">
      <Container style={{ textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Avatar
            src={avatarSrc}
            alt={user?.firstName || "Профіль користувача"}
            className="profile-avatar"
            sx={{ width: 150, height: 150, margin: "0 auto 20px", fontSize: "3rem" }}
          >
            {user?.firstName?.charAt(0)}
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
            accept="image/*"
          />
          <IconButton
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
            onClick={handleIconClick}
            aria-label="upload picture"
            component="span"
          >
            <PhotoCameraIcon />
          </IconButton>
        </div>
        <Typography variant="h4" gutterBottom>
          {(user?.firstName || "") + " " + (user?.lastName || "")}
        </Typography>
        <Typography variant="subtitle1">
          Місце проживання: {(user?.state || "") + " " + (user?.country || "")}
        </Typography>
      </Container>
    </div>
  );
};

export default ProfileHeader;
