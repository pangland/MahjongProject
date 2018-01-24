import React from 'react';
import { generateTiles } from '../util.js';
// maybe a tile class later

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.allTiles = generateTiles();
    this.orderStartingHand = this.orderStartingHand.bind(this);
    this.discardTile = this.discardTile.bind(this);
    this.orderStartingHand();
  }

  orderStartingHand() {
    const hand = this.allTiles.splice(0,13);
    hand.sort((a, b) => {
      return a.tileCode <  b.tileCode ? -1 : 1;
    });

    this.state = {
      hand: hand,
      drawnTile: null,
      discards: []
    };
  }

  discardTile(index, e) {
    const hand = this.state.hand;
    const discards = this.state.discards;
    discards.push(hand[index]);
    hand.splice(index, 1);

    this.setState({
      hand: hand,
      discards: discards
    });
  }

  render() {
    const handTiles = this.state.hand.map((tile, index) => {
      const image = `./tiles/${tile.suit}/${tile.suit}${tile.rank}.png`;
      return (
        <li key={index} onClick={this.discardTile.bind(this, index)}>
          <img src={image}></img>
        </li>
      );
    });

    const discardedTiles = this.state.discards.map((tile, index) => {
      const image = `./tiles/${tile.suit}/${tile.suit}${tile.rank}.png`;
      return (
        <li key={index}>
          <img src={image}></img>
        </li>
      );
    });

    return (
      <div>
        <ul>
          <h1>Discarded Tiles</h1>
          {discardedTiles}
        </ul>
        <ul>
          <h1>Hand</h1>
          {handTiles}
        </ul>
      </div>
    );
  }
}

export default Hand;
