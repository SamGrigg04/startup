import React from 'react'

export function APIcall({ number }) {
  const [fact, setFact] = React.useState('Loading...');

  React.useEffect(() => {
    if (number == "") return;
    setFact(`What a fun fact about ${number}!`);
  }, [number]); // runs every time number changes

  return (
    <div id="api">
      <p> {fact} </p>
    </div>
  );
}
