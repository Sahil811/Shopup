import Layout from "../components/Layout.js";

export default function Home() {
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <ul>
          <li>
            <a href="/products/1">Product 1</a>
          </li>
          <li>
            <a href="/products/2">Product 2</a>
          </li>
          <li>
            <a href="/products/3">Product 3</a>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
