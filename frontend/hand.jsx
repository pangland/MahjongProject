import React from 'react';
import { generateTiles } from '../util';
import MahjongGame from '../mahjong_game';

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.game = new MahjongGame;
    this.allTiles = this.game.tiles;
    this.hand = this.game.hand;
    this.discardTile = this.discardTile.bind(this);
    this.orderStartingHand();

    this.state = {
      hand: this.game.hand,
      drawnTile: this.game.drawTile(),
      discards: this.game.discards
    };
  }

  discardTile(index, e) {
    this.game.discardTile(index);


    const discards = this.state.discards;
    const newDrawnTile = this.allTiles.splice(0,1)[0];
    if (index === 13) {
      discards.push(this.state.drawnTile);
      this.setState({
        discards: discards,
        drawnTile: newDrawnTile
      });
    } else {
      const hand = this.state.hand;
      discards.push(hand[index]);
      hand.splice(index, 1);
      hand.push(this.state.drawnTile);
      hand.sort((a, b) => {
        return a.tileCode <  b.tileCode ? -1 : 1;
      });
      this.setState({
        hand: hand,
        discards: discards,
        drawnTile: newDrawnTile
      });
    }

    this.game.isWinningHand();
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

    const drawn = this.state.drawnTile;

    return (
      <div>
        <ul>
          <h1>Discarded Tiles</h1>
          {discardedTiles}
        </ul>
        <ul>
          <h1>Hand</h1>
          {handTiles}
          <li onClick={this.discardTile.bind(this, 13)}>
            <img src={`./tiles/${drawn.suit}/${drawn.suit}${drawn.rank}.png`}></img>
          </li>
        </ul>
      </div>
    );
  }
}

export default Hand;
