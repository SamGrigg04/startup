import React from 'react'

export function APIcall({ number }) {
  const [fact, setFact] = React.useState('Loading...');

  React.useEffect(() => {
    if (number == "") return;
    fetch(`http://numbersapi.com/${number}`)
    .then((response) => response.json())
    .then((data) => {
      setFact(data);
    })
    .catch();
  }, [number]); // runs every time number changes

  return (
    <div id="api">
      <p> {fact} </p>
    </div>
  );

}
