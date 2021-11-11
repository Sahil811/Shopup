import nc from "next-connect";
import Order from "../../../models/order";
import { onError } from "../../../utils/error";
import db from "../../../utils/db";
import { isAuth, isAdmin } from "../../../utils/auth";

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();

  const orders = await Order.aggregate([
    {
      $lookup: {
        from: "users",
        let: { userRef: "$user" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$userRef"] } } },
          { $project: { name: 1, email: 1 } },
        ],
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  await db.disconnect();
  res.send(orders);
});

export default handler;
