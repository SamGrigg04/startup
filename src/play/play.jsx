import React from 'react';
import './play.css';
import { Players } from './players';
import { NumbrGame } from './numbrGame';


export function Play(properties) {
  return (
    <main>
      <NumbrGame userName={properties.userName} />
      {/* <Players userName={properties.userName} /> */}
    </main>
  );
}
    