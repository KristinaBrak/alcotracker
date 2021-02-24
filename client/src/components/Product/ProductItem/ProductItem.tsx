import { spawn } from "child_process";
import { ProductDto, ProductsQuery } from "../../../generated/graphql";

interface Props {
  product: ProductDto;
}

const ProductItem: React.FC<Props> = ({
  product: {
    id,
    name,
    volume,
    alcVolume,
    image,
    link,
    priceCurrent,
    priceMean,
    priceMode,
    discount,
    store,
    category,
  },
}) => {
  return (
    <div style={{ display: "flex", margin: "20px 0", minWidth: "50%" }}>
      <div
        style={{ display: "flex", flexDirection: "column", maxWidth: "50%" }}
      >
        {/* <div style={{ maxWidth: "50%" }}> */}
        <a href={link} target="_blank">
          <img src={image} alt={name} />
        </a>
        {/* </div> */}
        <p style={{ maxWidth: "80%" }}>{name}</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <p>{store}</p>
        <p>{category}</p>
        <p>{volume} L</p>
        <p>{alcVolume} %</p>
        <span>{priceCurrent}€</span>
        {discount ? <span>{discount}</span> : null}
      </div>
    </div>
  );
};

export default ProductItem;
