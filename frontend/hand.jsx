import React from 'react';
import { generateTiles } from '../util';
import MahjongGame from '../mahjong_game';

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.game = new MahjongGame;
    this.discardTile = this.discardTile.bind(this);
    this.closedKan = this.closedKan.bind(this);
    this.game.drawTile();

    this.state = {
      hand: this.game.hand,
      closedKans: this.game.closedKans,
      openHand: this.game.openHand,
      drawnTile: this.game.drawnTile,
      discards: this.game.discards,
      kannable: this.game.isKannable,
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

  closedKan(e) {
    this.game.closedKan();
    this.setState({
      hand: this.game.hand,
      closedKans: this.game.closedKans,
      openhand: this.game.openHand,
      discards: this.game.discards,
      drawnTile: this.game.drawnTile
    });
  }

  render() {
    debugger;
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

    let kannable;
    if (this.game.isKannable()) {
      kannable = <button onClick={this.closedKan}>Kan</button>;
    }

    return (
      <div>
        <ul className='discards'>
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
        <ul>

        </ul>
        {kannable}
      </div>
    );
  }
}

export default Hand;
