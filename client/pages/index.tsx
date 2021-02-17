import { GetStaticProps } from 'next';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const Home = ({ products }) => {
  console.log('data', products);
  return (
    <div>
      {products.map(product => (
        <div>{product.name}</div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async context => {
  const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      {
        products(filter: { name_like: "vynas" }, sort: []) {
          id
          name
        }
      }
    `,
  });

  return {
    props: {
      products: data.products,
    },
  };
};
export default Home;
