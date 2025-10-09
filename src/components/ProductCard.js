import { Button, Card, CardActions, CardContent, CardMedia, Rating, Stack } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "./ProductCard.css";

/**
 * ProductCard Component — displays a single product with details
 * Expected props:
 * {
 *   product: { name, cost, rating, image, _id },
 *   handleAddToCart: (productId) => {}
 * }
 */

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      {/* Product Image */}
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        className="card-media"
      />

      {/* Product Info */}
      <CardContent>
        <Stack spacing={1}>
          <p className="product-name">{product.name}</p>
          <p className="product-cost">₹{product.cost}</p>
          <Rating name="read-only" value={product.rating} readOnly />
        </Stack>
      </CardContent>

      {/* Add to Cart Button */}
      <CardActions>
        <Button
          fullWidth
          className="card-button"
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => handleAddToCart && handleAddToCart(product._id)}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;   