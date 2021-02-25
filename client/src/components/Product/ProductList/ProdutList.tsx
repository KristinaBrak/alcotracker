import { ProductDto, ProductsQuery } from "../../../generated/graphql";
import ProductItem from "../ProductItem/ProductItem";

interface Props {
  products: ProductsQuery["products"];
}

const ProductList: React.FC<Props> = ({ products }) => {
  return (
    <ul style={{ display: "flex", flexWrap: "wrap" }}>
      {products.map((product) => (
        <ProductItem product={product as ProductDto} key={`${product.id}`} />
      ))}
    </ul>
  );
};

export default ProductList;
