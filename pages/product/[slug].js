import React from "react";
import { useRouter } from "next/router";
import data from "../../utils/data";

export default function ProductScreen() {
  const router = useRouter();
  const { slug } = router.query;
  const product = data.products.find((p) => p.slug === slug);

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{`$${product.price}`}</p>
      <button>Add to cart</button>
    </div>
  );
}
