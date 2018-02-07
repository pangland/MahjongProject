import React from 'react';
import { generateTiles } from '../util';
import MahjongGame from '../mahjong_game';

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.game = new MahjongGame;
    this.discardTile = this.discardTile.bind(this);
    this.game.drawTile();

    this.state = {
      hand: this.game.hand,
      drawnTile: this.game.drawnTile,
      discards: this.game.discards
    };
  }

  discardTile(index, e) {
    this.game.discardTile(index);
    this.game.drawTile();
    this.setState({
      hand: this.game.hand,
      discards: this.game.discards,
      drawnTile: this.game.drawnTile
    });

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
          <li style={{width: '10px'}}></li>
          <li onClick={this.discardTile.bind(this, 13)}>
            <img src={`./tiles/${drawn.suit}/${drawn.suit}${drawn.rank}.png`}>
            </img>
          </li>
        </ul>
        <div></div>
      </div>
    );
  }
}

export default Hand;
