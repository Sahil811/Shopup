import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import NextLink from "next/link";
import Rating from "@material-ui/lab/Rating";

export default function ProductItem({ product, addToCartHandler }) {
  useEffect(() => {
    const cardActionArea = document.getElementById("cardActionArea");
    const cardMedia = document.getElementById("cardMedia");

    if (cardActionArea) {
      cardActionArea.style.height = "90% !important";
    }
    if (cardMedia) {
      cardMedia.style.height = "90% !important";
    }
  }, []);

  return (
    <Card>
      <NextLink href={`/product/${product.slug}`} passHref>
        <CardActionArea
          id="cardActionArea"
          style={{ height: "90% !important" }}
        >
          <CardMedia
            id="cardMedia"
            style={{ height: "90% !important" }}
            component="img"
            image={product.image}
            title={product.name}
          ></CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Rating value={product.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <Typography>{`${product.price}`}</Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
