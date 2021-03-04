import React from "react";
import { useRouter } from "next/router";
import { useProductsQuery } from "../../generated/graphql";
import Loader from "../../components/Loader/Loader";

export const Product = () => {
  const router = useRouter();
  const { productName, disc } = router.query;

  let productNameFull = "";
  for (let i = 0; i < productName.length; i++) {
    productNameFull += productName[i];
  }
  productNameFull = productNameFull.replace("proc", "%");
  const discountFull = Number(disc.toString());

  const { error, loading, data } = useProductsQuery({
    variables: {
      filter: {
        name_like: productNameFull,
        discount_eq: discountFull,
      },
      take: 1,
    },
  });

  if (error) {
    return <p>error</p>;
  }
  if (loading || !data) {
    return <Loader />;
  }

  const { products } = data;
  // const {
  //   name,
  //   category,
  //   image,
  //   priceCurrent,
  //   store,
  //   volume,
  //   alcVolume,
  //   link,
  //   discount,
  // } = products[0];
  return (
    <div>
      {/* <h1>{name}</h1>
      <img src={image} alt={name} />
      <p>{store}</p>
      <p>{discount ? discount : null}</p>
      <p>{volume}</p>
      <p>{alcVolume}</p>
      <p>{priceCurrent}</p>
      <a href={link}>
        <button>Visit store</button>
      </a>
      <p>{category}</p> */}
    </div>
  );
};

export default Product;
