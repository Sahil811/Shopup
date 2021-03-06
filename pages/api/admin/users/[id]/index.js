import nc from "next-connect";
import db from "../../../../../utils/db";
import User from "../../../../../models/user";
import { isAdmin, isAuth } from "../../../../../utils/auth";

const handler = nc();

handler.use(isAuth, isAdmin);

/// GET USER ///

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
});

/// UPDATE USER ///

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.name = req.body.name;
    user.isAdmin = Boolean(req.body.isAdmin);
    await user.save();
    await db.disconnect();
    res.send({ message: "User Updated Successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "User Not Found" });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ message: "User Deleted" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "User Not Found" });
  }
});

export default handler;
