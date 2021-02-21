import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useState } from 'react';
import { useProductsQuery } from '../src/generated/graphql';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

const Home = () => {
  const [value, setValue] = useState(5);
  const [name, setName] = useState('');
  const [productName, setProductName] = useState('');
  const [take, setTake] = useState(value);

  const { loading, data } = useProductsQuery({
    client,
    variables: {
      filter: {
        name_like: productName,
      },
      take: take,
    },
  });

  if (loading || !data) return 'Loading...';
  const { products } = data;
  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={({ target }) => {
          setValue(Number(target.value));
        }}
      />
      <input
        type="text"
        value={name}
        onChange={({ target }) => {
          setName(target.value);
        }}
      />
      <button
        onClick={() => {
          setTake(value);
          setProductName(name);
        }}
      >
        Hit it
      </button>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {products.map(({ image }) => (
          <div>
            <img width="auto" src={image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
