import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const backToExplore = () => {
    history.push('/');
  }

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
};

export default Header;
