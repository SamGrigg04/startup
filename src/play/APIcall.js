export function APIcall(properties) {
  const [fact, setFact] = React.useState('Loading...');

  React.useEffect(() => {
    setFact('What a fun fact!')
  }, []);
}