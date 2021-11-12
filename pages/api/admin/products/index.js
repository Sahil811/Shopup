import nc from "next-connect";
import db from "../../../../utils/db";
import Product from "../../../../models/product";
import { isAdmin, isAuth } from "../../../../utils/auth";

const handler = nc();
handler.use(isAuth, isAdmin);

/// GET PRODUCTS ///

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

/// CREATE PRODUCT ///

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "sample name",
    slug: "sample-slug-" + Math.random(),
    image: "/images/shirt1.jpg",
    price: 0,
    category: "sample category",
    brand: "sample brand",
    countInStock: 0,
    description: "sample description",
    rating: 0,
    numReviews: 0,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: "Product Created", product });
});

export default handler;
