import React from 'react';
import { generateTiles } from '../util';
import ClassroomTile from './classroom_tile';
import MahjongGame from '../mahjong_game';

class Classroom extends React.Component {
  constructor(props) {
    super(props);

    this.generateOptions = this.generateOptions.bind(this);
  }

  generateOptions() {
    const node = this.myRef.current;
  }

  render() {
    const facedownImage = `./tiles/face-down-64px.png`;
    const facedownTiles = [];

    for (let i = 0; i < 14; i++) {
      // facedownTiles.push(
      //   <li className='selected-image' key={i} onClick={this.generateOptions}>
      //     <img src={facedownImage}></img>
      //   </li>
      // );

      facedownTiles.push(
        <ClassroomTile key={i} />
      );
    }

    return (
      <div>
        <span>Fill your hand!</span>
        <ul>
          {facedownTiles}
        </ul>
      </div>
    );
  }
}

export default Classroom;
