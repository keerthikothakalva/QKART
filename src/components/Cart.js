import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Box } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

/**
 * Returns the complete data on all products in cartData by searching in productsData
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData || !productsData) return [];
  return cartData
    .map((cartItem) => {
      const product = productsData.find((p) => p._id === cartItem.productId);
      return product
        ? { ...product, qty: cartItem.qty, productId: cartItem.productId }
        : null;
    })
    .filter(Boolean);
};

/**
 * Get the total value of all products added to the cart
 */
export const getTotalCartValue = (items = []) => {
  return items.reduce((total, item) => total + item.cost * item.qty, 0);
};

/**
 * Item quantity control component
 */
const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  if (isReadOnly) {
    
    return (
      <Box padding="0.5rem" data-testid="item-qty">
        Qty: {value}
      </Box>
    );
  }

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Cart component
 */
const Cart = ({ products = [], items = [], handleQuantity, isReadOnly = false }) => {
  const history = useHistory();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <Box className="cart">
      {items.map((item) => (
        <Box
          key={item.productId}
          display="flex"
          alignItems="flex-start"
          padding="1rem"
        >
          <Box className="image-container">
            <img src={item.image} alt={item.name} width="100%" height="100%" />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            flex="1"
            paddingX="1rem"
          >
            <div>{item.name}</div>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <ItemQuantity
                value={item.qty}
                handleAdd={() =>
                  handleQuantity && handleQuantity(item.productId, item.qty + 1)
                }
                handleDelete={() =>
                  handleQuantity && handleQuantity(item.productId, item.qty - 1)
                }
                isReadOnly={isReadOnly}
              />

              <Box fontWeight="700">${item.cost}</Box>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Cart footer */}
      <Box
        padding="1rem"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="cart-footer"
      >
        <Box color="#3C3C3C" alignSelf="center">
          Order total
        </Box>
        <Box
          color="#3C3C3C"
          fontWeight="700"
          fontSize="1.5rem"
          alignSelf="center"
          data-testid="cart-total"
        >
          ${getTotalCartValue(items)}
        </Box>
      </Box>

      {!isReadOnly && (
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => history.push("/checkout")}
          >
            Checkout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
