import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Banner from "../components/Banner";
import Products from "../components/Products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const data = useLoaderData();

  useEffect(() => {
    setProducts(data.data);
  }, [data]);

  return (
    <main className="max-w-screen-xl mx-auto">
      <Banner />
      <Products products={products} />
    </main>
  );
}