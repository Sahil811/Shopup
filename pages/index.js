import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
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
  )
}
