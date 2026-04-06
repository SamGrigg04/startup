import React from 'react';
import { NumbrGame } from './numbrGame';
import { Messages } from './messages';


export function Play(properties) {
  return (
    <main>
      <Messages currentUser={properties.name} />
      <NumbrGame name={properties.name} />
    </main>
  );
}
    