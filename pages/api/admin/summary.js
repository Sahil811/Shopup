import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import { onError } from "../../../utils/error";
import db from "../../../utils/db";
import User from "../../../models/user";
import Product from "../../../models/product";
import Order from "../../../models/order";

const handler = nc({
  onError,
});

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  const [ordersPriceGroup] = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$totalPrice" },
      },
    },
  ]);

  const ordersPrice = ordersPriceGroup ? ordersPriceGroup?.sales : 0;

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
});

export default handler;
