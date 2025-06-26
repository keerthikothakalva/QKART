import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const[formData,setFormData]=useState({
    username:"",
    password:"",
    })
    const[isLoading, setIsloading]=useState(false);
    const history=useHistory()
    const [res]=useState();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    try{
      setIsloading(true);
      if (!validateInput(formData)) 
      return;
     let res=await axios.post(`${config.endpoint}/auth/login`,{
       username:formData.username,
       password:formData.password,
     });
     if(res.status>200&& res.status<=299){
        enqueueSnackbar("Registered Successfully",{variant:"success"})
     }
     persistLogin({token:res.data.token, username:res.data.username,balance:res.data.balance}) 
     history.push("/")
 }
     catch(e){
        if (e.res && e.res.status === 400) {
          return enqueueSnackbar(e.res.data.message, { variant: "error" });
        } else {
         enqueueSnackbar(
           "Something went wrong. check that the backend is running, reachable and return valid JSON.",
           { variant: "error" }
         );
   }
  }
     finally{
       setIsloading(false)
     }

  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is required field", { variant: "warning" });
      return false;
    }
    
    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    return true;

  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token",token)
    localStorage.setItem("username",username)
    localStorage.setItem("balance",balance)


  };
  const handlechange=(e)=>{
    setFormData(()=>({...formData,[e.target.name]:e.target.value}))
  }


  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={formData.username}
            onChange={(e)=>handlechange(e)}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            value={formData.password}
            onChange={(e)=>handlechange(e)}
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e)=>handlechange(e)}
            type="password"
            fullWidth
          />
          <Box sx={{display:"flex",justifyContent:"center"}}>
          {isLoading?<CircularProgress/>:<button fullWidth className="button" variant="contained" onClick={()=>res(formData)}>Register</button>}
          </Box>
          <p className="secondary-action">
            Dont have an account?
            <link to="/register"> Register Now</link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
