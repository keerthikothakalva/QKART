import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Stack,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        className="card-media"
      />
      <CardContent>
        <Stack spacing={1}>
          <p className="product-name">{product.name}</p>
          <p className="product-cost">${product.cost}</p>
          <Rating name="read-only" value={product.rating} readOnly />
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          className="card-button"
          variant="contained"
          fullWidth
          startIcon={<AddShoppingCartIcon />}
          onClick={() => handleAddToCart(product)}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
