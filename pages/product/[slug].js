import React, { useContext } from "react";
//import { useRouter } from "next/router";
import NextLink from "next/link";
import Image from "next/image";
import {
  Link,
  Grid,
  List,
  ListItem,
  Typography,
  Button,
} from "@material-ui/core";
import Layout from "../../components/Layout";
//import data from "../../utils/data";
import useStyles from "../../utils/styles";
import db from "../../utils/db";
import Product from "../../models/product";
import axios from "axios";
import { Store } from "../../utils/store";

export default function ProductScreen(props) {
  const { dispatch } = useContext(Store);
  const { product } = props;

  const classes = useStyles();

  //const router = useRouter();
  //const { slug } = router.query;

  if (!product) {
    return <h1>Product not found</h1>;
  }

  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock <= 0) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity: 1 } });
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>
          <NextLink href="/">
            <Link>
              <Typography>Back to products</Typography>
            </Link>
          </NextLink>
        </p>
      </div>

      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>

        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} star ({product.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>

        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Price</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography>{`$${product.price}`}</Typography>
                </Grid>
              </Grid>
            </ListItem>

            <ListItem>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Status</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography>
                    {product.countInStock > 0 ? "In stock" : "Unavailable"}
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>

            <ListItem>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => addToCartHandler()}
              >
                Add to cart
              </Button>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const slug = context.params.slug;
  await db.connect();
  //The lean option tells Mongoose to skip hydrating the result documents. This makes queries faster and less memory intensive, but the result documents are plain old JavaScript objects (POJOs), not Mongoose documents.
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObject(product),
    }, // will be passed to the page component as props
  };
}
