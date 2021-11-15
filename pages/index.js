import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import Layout from "../components/Layout.js";
//import data from "../utils/data.js";
import NextLink from "next/link";
import db from "../utils/db.js";
import Product from "../models/product.js";
import axios from "axios";
import { Store } from "../utils/store";
import { useContext } from "react";
import { useRouter } from "next/router";
import Rating from "@material-ui/lab/Rating";

export default function Home(props) {
  const { products } = props;

  const router = useRouter();

  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const existitem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existitem ? existitem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }

    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });

    router.push("/cart");
  };

  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name} style={{ display: "grid" }}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea style={{ height: "90% !important" }}>
                    <CardMedia
                      style={{ height: "90% !important" }}
                      component="img"
                      alt={product.name}
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
                  <Typography>{`$${product.price}`}</Typography>

                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  await db.connect();
  //The lean option tells Mongoose to skip hydrating the result documents. This makes queries faster and less memory intensive, but the result documents are plain old JavaScript objects (POJOs), not Mongoose documents.
  const products = await Product.find({}, "-reviews").lean(); // Remove "reviews" from the result
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObject),
    }, // will be passed to the page component as props
  };
}
