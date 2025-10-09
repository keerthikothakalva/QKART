import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    history.push("/login");
  };

  const backToExplore = () => {
    history.push("/");
  };

  // ✅ Case 1: If hasHiddenAuthButtons is true (like Login/Register pages)
  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={backToExplore}
        >
          Back to explore
        </Button>
      </Box>
    );
  }

  // ✅ Case 2: Default Header (Products page + others)
  return (
    <Box className="header">
      {/* ✅ Logo */}
      <Box className="header-title" onClick={() => history.push("/")}>
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {/* ✅ Search bar (only visible if children is passed from Products.js) */}
      {children && <Box className="search-bar">{children}</Box>}

      {/* ✅ Right side: user / login controls */}
      {localStorage.getItem("username") ? (
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "flex-end", alignItems: "center" }}
        >
          <Avatar src="avatar.png" alt={localStorage.getItem("username")} />
          <p>{localStorage.getItem("username")}</p>
          <Button
            variant="contained"
            className="button"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button className="button" onClick={() => history.push("/login")}>
            Login
          </Button>
          <Button
            variant="contained"
            className="button"
            onClick={() => history.push("/register")}
          >
            Register
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;