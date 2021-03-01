import { ProductDto, ProductsQuery } from "../../../generated/graphql";
import Loader from "../../Loader/Loader";
import ProductItem from "../ProductItem/ProductItem";

interface Props {
  productsData: ProductsQuery;
  loading: boolean;
  error?: Error;
}

const ProductList: React.FC<Props> = ({ productsData, loading, error }) => {
  if (error) {
    return <p>error</p>;
  }
  if (loading || !productsData) {
    return <Loader />;
  }

  const { products } = productsData;
  return (
    <ul style={{ display: "flex", flexWrap: "wrap" }}>
      {products.map((product) => (
        <ProductItem product={product as ProductDto} key={`${product.id}`} />
      ))}
    </ul>
  );
};

export default ProductList;
