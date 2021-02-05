export const isDebug = () => {
  const x = process.env.DEBUG?.toUpperCase() === 'TRUE';
  console.log(x);

  return x;
};
