import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
import Header from "./Header";
import { config } from "../App";
import "./Products.css";

// ------------------ Fetch Cart ------------------
export const fetchCart = async (token) => {
  if (!token) return [];
  try {
    const res = await axios.get(`${config.endpoint}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (e) {
    console.error("Error fetching cart:", e);
    return [];
  }
};

// ------------------ Add to Cart ------------------
export const addToCart = async (
  token,
  items,
  products,
  productId,
  qty,
  setCartItems,
  preventDuplicate = false
) => {
  if (!token) {
    window.alert("Login to add an item to the Cart");
    return;
  }

  const existingItem = (items || []).find(
    (item) => item.productId === productId
  );

  if (preventDuplicate && existingItem) {
    const alertBox = document.createElement("div");
    alertBox.setAttribute("role", "alert");
    alertBox.textContent =
      "Item already in cart. Use the cart sidebar to update quantity or remove item.";
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 2000);
    return;
  }

  try {
    const res = await axios.post(
      `${config.endpoint}/cart`,
      { productId, qty },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const cartData = generateCartItemsFrom(res.data, products);
    setCartItems(cartData);
  } catch (e) {
    console.error("Error adding to cart:", e);
  }
};

// ------------------ Main Component ------------------
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const token = localStorage.getItem("token");

  // ------------------ Fetch Products ------------------
  const performAPICall = async () => {
    setLoading(true);
    await Promise.resolve();

    try {
      const res = await axios.get(`${config.endpoint}/products`);
      const data = res?.data || [];

      setProducts(data);
      setFiltered(data);

      return data;
    } catch (e) {
      console.error("Error fetching products:", e);
      setFiltered([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const productList = await performAPICall();

        if (token) {
          const cartData = await fetchCart(token);
          setCartItems(generateCartItemsFrom(cartData, productList));
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [token]);

  // ------------------ Search ------------------
  const performSearch = async (text) => {
    if (!text) {
      setFiltered(products);
      return;
    }

    try {
      const res = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setFiltered(res.data);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setFiltered([]);
      } else {
        console.error("Search error:", e);
      }
    }
  };

  // ------------------ Debounce ------------------
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  // ------------------ Cart Handlers ------------------
  const handleAddToCart = (product) => {
    addToCart(token, cartItems, products, product._id, 1, setCartItems, true);
  };

  const handleQuantity = (productId, qty) => {
    if (qty < 0) qty = 0;
    addToCart(token, cartItems, products, productId, qty, setCartItems);
  };

  // ------------------ UI ------------------
  return (
    <div>
      
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}

        />
      </Header>
  
      
      <Box className="hero">
        <Typography className="hero-heading">
          India’s{" "}
          <span className="hero-highlight">FASTEST DELIVERY</span> to your door step
        </Typography>
      </Box>
  
      
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}

      />


      <Grid container>
        <Grid item xs={12} md={9} className="product-grid">
        {loading ? (
  <Box className="loading">
    <CircularProgress size={50} thickness={4} />
    <Typography variant="h6" sx={{ mt: 2 }}>
      Loading Products...
    </Typography>
  </Box>
) : filtered.length > 0 ? (
            <Grid container spacing={3}>
              {filtered.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box className="loading">
              <SentimentDissatisfiedIcon />
              <Typography>No products found</Typography>
            </Box>
          )}
        </Grid>
  
        
        <Grid item xs={12} md={3} bgcolor="#f5f5f5">
          <Cart
            products={products}
            items={cartItems}
            handleQuantity={handleQuantity}
          />
        </Grid>
  
      </Grid>
  
     
      <Box className="footer">
        <Typography>© 2026 QKart. All rights reserved.</Typography>
      </Box>
    </div>
  );
};

export default Products;
