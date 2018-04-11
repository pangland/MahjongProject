import React from 'react';
import { generateTiles } from '../util';
import MahjongGame from '../mahjong_game';

class ClassroomTile extends React.Component {
  constructor(props) {
    super(props);

    this.selectTile = this.selectTile.bind(this);

    this.state = {
      hidden: true,
      selected: false,
    };
  }

  selectTile() {
    const selectStatus = this.state.selected ? false : true;
    this.setState( {selected: selectStatus} );
  }

  render() {
    // const properties = this.props.properties;
    // const imageLink = `./tiles/${properties.suit}/${properties.suit}${properties.rank}.png`;

    const facedownImage = `./tiles/face-down-64px.png`;
    const className = this.state.selected ? "selected-image" : "";

    return (
      <li className={className} onClick={this.selectTile}>
        <img src={facedownImage}></img>
      </li>
    );
  }
}

export default ClassroomTile;
