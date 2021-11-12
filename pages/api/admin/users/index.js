import nc from "next-connect";
import db from "../../../../utils/db";
import User from "../../../../models/user";
import { isAdmin, isAuth } from "../../../../utils/auth";

const handler = nc();

handler.use(isAuth, isAdmin);

/// GET USERS ///

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({ email: { $ne: "admin@example.com" } });
  await db.disconnect();
  res.send(users);
});

export default handler;
