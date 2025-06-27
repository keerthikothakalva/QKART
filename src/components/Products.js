import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(false);

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get('${config.endpoint}/products');
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError(true);
      enqueueSnackbar(
        "Something went wrong. Please check the backend and try again.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredList = products.filter((product) =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredList);
  };

  return (
    <Box>
      <Header />
      <Box className="search-box">
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          placeholder="Search for items/categories"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box className="product-container">
        {loading ? (
          <Box className="loading">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="loading">
            <SentimentDissatisfied />
            <p>Unable to fetch products.</p>
          </Box>
        ) : filtered.length === 0 ? (
          <Box className="loading">
            <SentimentDissatisfied />
            <p>No products found.</p>
          </Box>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {filtered.map((product) => (
              <Grid item xs={6} sm={4} md={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Footer />
    </Box>
  );
};


export default Products;
