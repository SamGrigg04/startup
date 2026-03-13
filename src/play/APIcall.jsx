import React from 'react'

export function APIcall({ number }) {
  const [fact, setFact] = React.useState('');

  React.useEffect(() => {
    if (number === '' || number == null) {
      setFact('Enter a guess to get a cool fact (maybe)!');
      return;
    }

    setFact('Loading...');
    fetch(`https://uselessfacts.jsph.pl/api/v2/facts/random`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
    .then((data) => 
      setFact(data && data.text ? data.text : JSON.stringify(data)))
    .catch((err) => {
      console.error('APIcall error:', err);
      setFact('Could not load fact');
    });
  }, [number]); // runs every time number changes

  return (
    <div id="api">
      <p> {fact} </p>
    </div>
  );

}
