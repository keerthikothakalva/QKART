import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory } from "react-router-dom";


const Register = () => {
  const [variantInput]=useState();
  const[isLoading, setIsloading]=useState();
  const { enqueueSnackbar } = useSnackbar();
  const[formData,setFormData]=useState({
  username:"",
  password:"",
  confirmPassword:""
  })
  const history = useHistory();




  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const res = async (formData) => {
    try{
       setIsloading(true);
      if(variantInput(formData)){
      let res=await axios.post(`${config.endpoint}/auth/register`,{
        username:formData.username,
        password:formData.password,
      });
      if(res.status>=200 && res.status<=299 ){
         enqueueSnackbar("Registered Successfully",{variant:"success"})
      }
      history.push('/login'); 

    }
  
      if(res.status===400){
        enqueueSnackbar(res.error)
      }
    
  }
      catch(err){
        console.log(err,"err")
          enqueueSnackbar("something went wrong.check that the backend is running, reachable and and returns valid JSON.",{variant:"error"})
       
    }
      finally{
        setIsloading(false)
      }
    
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if(!data.username){
      enqueueSnackbar("username is a required field",{variant:"warning"})
      return false
    }
    if(!data.password){
      enqueueSnackbar("Password is a required field",{variant:"warning"})
      return false
    }
    if(!data.username.length<6){
      enqueueSnackbar("Username must be at least 6 characters",{variant:"warning"})
      return false
    }
    if(!data.password.length<6){
      enqueueSnackbar("Password must be at least 6 characters",{variant:"warning"})
      return false
    }
    
    if(!data.confirmPassword){
      enqueueSnackbar("Passwords do not match",{variant:"warning"})
      return false
    }
    return true

    
    
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
            onchange={(e)=>handlechange(e)}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            value={formData.password}
            onchange={(e)=>handlechange(e)}
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
            onchange={(e)=>handlechange(e)}
            type="password"
            fullWidth
          />
          <Box sx={{display:"flex",justifyContent:"center"}}>
          {isLoading?<CircularProgress/>:<button fullWidth className="button" variant="contained" onClick={()=>Register(formData)}>Register</button>}
          </Box>
          <p className="secondary-action">
            Already have an account?{" "}
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
