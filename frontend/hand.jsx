import React from 'react';
import { generateTiles } from '../util.js';


class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.allTiles = generateTiles();
    this.orderStartingHand = this.orderStartingHand.bind(this);
    this.orderStartingHand();
  }

  orderStartingHand() {
    const hand = this.allTiles.splice(0,13);
    hand.sort((a, b) => {
      return a.tileCode <  b.tileCode ? -1 : 1;
    });

    this.state = {
      hand: hand
    };
  }

  render() {
    const handTiles = this.state.hand.map((tile, index) => {
      const imageLink = `./tiles/${tile.suit}/${tile.suit}${tile.rank}.png`;
      return (
        <li key={index}>
          <img src={imageLink}></img>
        </li>
      );
    });

    return (
      <ul>
        {handTiles}
      </ul>
    );
  }
}

export default Hand;
