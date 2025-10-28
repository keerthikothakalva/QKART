import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

/**
 * Add new address view
 */
const AddNewAddressView = ({
  token,
  newAddress,
  handleNewAddress,
  addAddress,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        value={newAddress.value}
        onChange={(e) => handleNewAddress({ ...newAddress, value: e.target.value })}
      />
      <Stack direction="row" my="1rem">
        <Button
          variant="contained"
          onClick={() => addAddress(token, newAddress)}
        >
          Add
        </Button>
        <Button
          variant="text"
          onClick={() =>
            handleNewAddress({ isAddingNewAddress: false, value: "" })
          }
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });

  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      return response.data;
    } catch (e) {
      enqueueSnackbar("Could not fetch products.", { variant: "error" });
      return null;
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch {
      enqueueSnackbar("Could not fetch cart details.", { variant: "error" });
      return null;
    }
  };

  const getAddresses = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses({ ...addresses, all: response.data });
      return response.data;
    } catch {
      enqueueSnackbar("Could not fetch addresses.", { variant: "error" });
      return null;
    }
  };

  const addAddress = async (token, newAddress) => {
    if (!newAddress.value) {
      enqueueSnackbar("Please enter an address to add!", { variant: "warning" });
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/user/addresses`,
        { address: newAddress.value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses({ all: response.data, selected: "" });
      setNewAddress({ isAddingNewAddress: false, value: "" });
      return response.data;
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not add this address.", { variant: "error" });
      }
    }
  };

  const deleteAddress = async (token, addressId) => {
    try {
      const response = await axios.delete(
        `${config.endpoint}/user/addresses/${addressId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses({ all: response.data, selected: "" });
      return response.data;
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not delete this address.", { variant: "error" });
      }
    }
  };

  const validateRequest = (items, addresses) => {
    const totalCost = getTotalCartValue(items);
    const balance = localStorage.getItem("balance");

    if (totalCost > balance) {
      enqueueSnackbar(
        "You do not have enough balance in your wallet for this purchase",
        { variant: "warning" }
      );
      return false;
    }

    if (!addresses.all.length) {
      enqueueSnackbar("Please add a new address before proceeding.", {
        variant: "warning",
      });
      return false;
    }

    if (!addresses.selected) {
      enqueueSnackbar("Please select one shipping address to proceed.", {
        variant: "warning",
      });
      return false;
    }

    return true;
  };

  const performCheckout = async (token, items, addresses) => {
    if (!validateRequest(items, addresses)) return;

    try {
      const response = await axios.post(
        `${config.endpoint}/cart/checkout`,
        { addressId: addresses.selected },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        enqueueSnackbar("Order placed successfully!", { variant: "success" });
        const newBalance =
          localStorage.getItem("balance") - getTotalCartValue(items);
        localStorage.setItem("balance", newBalance);
        history.push("/thanks");
      }
    } catch (e) {
      if (e.response && e.response.data.message) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not place order.", { variant: "error" });
      }
    }
  };

  useEffect(() => {
    const onLoadHandler = async () => {
      if (!token) {
        enqueueSnackbar("You must be logged in to access checkout page", {
          variant: "info",
        });
        history.push("/login");
        return;
      }

      const productsData = await getProducts();
      const cartData = await fetchCart(token);
      const addressData = await getAddresses(token);

      if (productsData && cartData) {
        const cartDetails = generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }

      if (addressData) {
        setAddresses({ all: addressData, selected: "" });
      }
    };
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAddress = (id) => {
    setAddresses({ ...addresses, selected: id });
  };

  const handleNewAddress = (value) => {
    setNewAddress(value);
  };

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />

            <Box>
              {addresses.all.map((addr) => (
                <Box
                  key={addr._id}
                  className={`address-item ${
                    addresses.selected === addr._id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectAddress(addr._id)}
                >
                  <Typography>{addr.address}</Typography>
                  <Button
                    startIcon={<Delete />}
                    onClick={() => deleteAddress(token, addr._id)}
                  >
                    Delete
                  </Button>
                </Box>
              ))}

              {!newAddress.isAddingNewAddress ? (
                <Button
                  variant="outlined"
                  onClick={() =>
                    handleNewAddress({ isAddingNewAddress: true, value: "" })
                  }
                >
                  Add new address
                </Button>
              ) : (
                <AddNewAddressView
                  token={token}
                  newAddress={newAddress}
                  handleNewAddress={handleNewAddress}
                  addAddress={addAddress}
                />
              )}
            </Box>

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={() => performCheckout(token, items, addresses)}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
