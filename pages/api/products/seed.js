import nc from "next-connect";
import Product from "../../../models/product";
import User from "../../../models/user";
import db from "../../../utils/db";
import data from "../../../utils/data";

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
});

handler.get(async (req, res) => {
  await db.connect();
  await User.deleteMany({});
  await User.insertMany(data.users);
  await Product.deleteMany({});
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ message: "Seeded sucessfully" });
});

export default handler;
