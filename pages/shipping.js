import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/store";

export default function Shipping() {
  const router = useRouter();
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  useEffect(() => {
    if (!userInfo) {
      if (!userInfo) {
        router.push("/login?redirect=shipping");
      }
      router.push("/login");
    }
  }, []);

  return <div>Shipping</div>;
}
