import nc from "next-connect";
import db from "../../../../../utils/db";
import Product from "../../../../../models/product";
import { isAdmin, isAuth } from "../../../../../utils/auth";

const handler = nc();
handler.use(isAuth, isAdmin);

/// GET PRODUCT ///

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

/// EDIT PRODUCT ///

handler.put(async (req, res) => {
  new Promise(async (resolve, reject) => {
    try {
      await db.connect();

      const product = await Product.findOneAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            name: req.body.name,
            slug: req.body.slug,
            price: req.body.price,
            category: req.body.category,
            image: req.body.image,
            brand: req.body.brand,
            countInStock: req.body.countInStock,
            description: req.body.description,
            featuredImage: req.body.featuredImage,
            isFeatured: req.body.isFeatured,
          },
        },
        { new: true }
      );

      if (product) {
        await db.disconnect();
        return resolve(res.send({ message: "Product Updated Successfully" }));
      } else {
        await db.disconnect();
        return reject(res.status(404).send({ message: "Product Not Found" }));
      }
    } catch (error) {
      console.log(error);
      return reject(res.status(404).send({ message: error }));
    }
  });
});

/// DELETE PRODUCT ///

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: "Product Deleted" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product Not Found" });
  }
});

export default handler;
