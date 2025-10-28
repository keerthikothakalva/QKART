<<<<<<< ours
import React, { useState, useEffect, useRef } from "react";
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
import ProductCard from "./ProductCard";
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

  const existingItem = (items || []).find((item) => item.productId === productId);
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

// ------------------ Main Products Component ------------------
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const token = localStorage.getItem("token");

  // ------------------ Fetch Products on Load ------------------
  const performAPICall = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.endpoint}/products`);
      setProducts(res.data);
      setFiltered(res.data);
      return res.data;
    } catch (e) {
      console.error("Error fetching products:", e);
      setFiltered([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProductsAndCart = async () => {
      const productList = await performAPICall();
      if (token) {
        const cartData = await fetchCart(token);
        setCartItems(generateCartItemsFrom(cartData, productList));
      }
    };
    loadProductsAndCart();
  }, [token]);

  // ------------------ Search Functionality ------------------
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
        console.error("Error in search:", e);
      }
    }
  };

  // ------------------ Debouncing ------------------
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

  // ------------------ UI Render ------------------
  return (
    <div>
      {/*  Header with search bar as children */}
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
      </Header>

      {/*  Search box for mobile */}
=======
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


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
  };

  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
  };

  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
  };







  return (
    <div>
      <Header>

      </Header>

>>>>>>> theirs
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
<<<<<<< ours
              <SearchIcon color="primary" />
=======
              <Search color="primary" />
>>>>>>> theirs
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
<<<<<<< ours
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />

      {/*  Products Grid */}
      <Grid container>
        <Grid item xs={12} md={9} className="product-grid">
          {loading ? (
            <Box className="loading">
              <CircularProgress />
              <Typography>Loading Products...</Typography>
            </Box>
          ) : filtered.length > 0 ? (
            <Grid container spacing={2}>
              {filtered.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={() => handleAddToCart(product)}
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

        {/*  Cart Section */}
        <Grid item xs={12} md={3} bgcolor="#f5f5f5">
          <Cart
            products={products}
            items={cartItems}
            handleQuantity={handleQuantity}
          />
        </Grid>
      </Grid>
=======
      />
      <Footer />
>>>>>>> theirs
    </div>
  );
};

export default Products;
