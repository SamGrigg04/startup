import React from 'react';
import { NumbrGame } from './numbrGame';


export function Play(properties) {
  return (
    <main>
      <NumbrGame userName={properties.userName} />
    </main>
  );
}
    