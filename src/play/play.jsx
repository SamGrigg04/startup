import React from 'react';
import { NumbrGame } from './numbrGame';


export function Play(properties) {
  return (
    <main>
      <NumbrGame name={properties.name} />
    </main>
  );
}
    