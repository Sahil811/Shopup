import NextLink from "next/link";
import { Grid, Link, Typography } from "@material-ui/core";
import Layout from "../components/Layout.js";
import db from "../utils/db.js";
import Product from "../models/product.js";
import axios from "axios";
import { Store } from "../utils/store";
import { useContext } from "react";
import { useRouter } from "next/router";
import ProductItem from "../components/ProductItem";

/// To fix window not defined error in " Carousel"
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import("react-material-ui-carousel"), {
  ssr: false, // Important
});

import useStyles from "../utils/styles";

export default function Home(props) {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { topRatedProducts, featuredProducts } = props;

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
      {featuredProducts && featuredProducts.length ? (
        <Carousel className={classes.mt1} animation="slide">
          {featuredProducts.map((product) => (
            <NextLink
              key={product._id}
              href={`/product/${product.slug}`}
              passHref
            >
              <Link>
                <img
                  src={product.featuredImage}
                  alt={product.name}
                  className={classes.featuredImage}
                ></img>
              </Link>
            </NextLink>
          ))}
        </Carousel>
      ) : (
        ""
      )}

      <Typography variant="h2">Popular Products</Typography>
      <Grid container spacing={3}>
        {topRatedProducts &&
          topRatedProducts.length &&
          topRatedProducts.map((product) => (
            <Grid item md={4} key={product.name}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              />
            </Grid>
          ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  await db.connect();
  //The lean option tells Mongoose to skip hydrating the result documents. This makes queries faster and less memory intensive, but the result documents are plain old JavaScript objects (POJOs), not Mongoose documents.
  //const products = await Product.find({}, "-reviews").lean(); // Remove "reviews" from the result

  // To fix featured product issue
  const featuredProductsDocs = await Product.aggregate([
    {
      $match: { isFeatured: true },
    },
    {
      $limit: 3,
    },
    {
      $unset: ["reviews", "__v"],
    },
  ]);

  const topRatedProductsDocs = await Product.find({}, "-reviews")
    .lean()
    .sort({
      rating: -1,
    })
    .limit(6);

  await db.disconnect();

  return {
    props: {
      featuredProducts: featuredProductsDocs.map(db.convertDocToObject),
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObject),
    }, // will be passed to the page component as props
  };
}
