import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";
const Header = ({ children, hasHiddenAuthButtons }) => {
  const history= useHistory()

  const token=
  typeof localstorage !=="undefined"?
  localStorage.getItem("token"): null;
  
  const handlelogout=()=>{
    localstorage.clear();
    window.location.reload()
    history.push("/login")
  }

  const backToExplore=()=>{
    history.push("/")
  }

  if(hasHiddenAuthButtons){

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={backToExplore}>
          Back to explore
        </Button>
      </Box>
    );
  }
  return(
    localstorage.getItem("username")?
    <Stack direction={"row"} spacing={2} sx={{justifyContent:"flex-end", alignItems:"center"}}>
    <Avatar src="avatar.png" alt="user-image"/>
    <p> {localstorage.getItem("username")}</p>
    <Button variant="contained" className="button" onClick={handlelogout}>Logout</Button>
      </Stack>:
    <Stack direction={"row"} spacing={2}>
      <Button className="button" onClick={()=>history.push("/login")}>Login</Button>
      <Button variant="contained" className="button" onClick={()=>history.push("/register")}>Register</Button>
    </Stack>
  )
};

export default Header;
