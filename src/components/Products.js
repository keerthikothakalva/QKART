import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, InputAdornment, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import "./Products.css";
import { config } from "../App";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noProducts, setNoProducts] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  
  const performAPICall = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.endpoint}/products`);
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
    setLoading(false);
  };

  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
  
      if (response.status === 200) {
        setFilteredProducts(response.data);
        setNoProducts(response.data.length === 0);
      }
    } catch (err) {
      // Handle empty search (404) gracefully
      if (err.response && err.response.status === 404) {
        setFilteredProducts([]);
        setNoProducts(true);
      } else {
        // Remove noisy console error; show user-friendly snackbar
        enqueueSnackbar(
          "Could not fetch products. Please check the backend or try again later.",
          { variant: "error" }
        );
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  useEffect(() => {
    performAPICall();
  }, []);

  return (
    <div>
      {/* Header with desktop search */}
      <Header>
        <TextField
          className="search-desktop"
          fullWidth
          placeholder="Search for items/categories"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
      </Header>

      {/*  Mobile search */}
      <Box className="search-mobile">
        <TextField
          fullWidth
          placeholder="Search for items/categories"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
      </Box>

      {/*  Loader */}
      {loading && (
        <Box className="loading">
          <CircularProgress />
          <p>Loading products...</p>
        </Box>
      )}

      {/*  Products list */}
      {!loading && !noProducts && (
        <Grid container spacing={2} className="product-grid">
          {filteredProducts.map((product) => (
            <Grid item xs={6} md={3} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/*  No results */}
      {noProducts && !loading && (
        <Box className="no-products">
          <p>No products found</p>
          <span role="img" aria-label="sad">😞</span>
        </Box>
      )}

      <Footer />
    </div>
  );
};

export default Products;