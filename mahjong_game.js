class MahjongGame {
  constructor() {
  }

  generateTiles() {
    const numberValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const numberedSuits = ['bamboo', 'number', 'pin'];
    const dragonValues = ['red', 'white', 'green'];
    const windValues = ['east', 'south', 'west', 'north'];
    const tiles = [];

    function makeFourCopies(rank, suit) {
      for (let i = 0; i < 4; i++) {
        tiles.push({
          rank: rank,
          suit: suit,
          tileCode: findTileCode(rank, suit)
        });
      }
    }

    function shuffleTiles() {
      for (let i = 0; i < tiles.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }
    }

    numberValues.forEach((rank) => {
      numberedSuits.forEach((suit) => {
        makeFourCopies(rank, suit);
      });
    });

    dragonValues.forEach((rank) => {
      makeFourCopies(rank, 'dragon');
    });

    windValues.forEach((rank) => {
      makeFourCopies(rank, 'wind');
    });

    shuffleTiles();
    return tiles;
  }

  findTileCode(rank, suit) {
    let tileCode = 0;

    switch (suit) {
      case 'number':
        tileCode += 0;
        break;
      case 'pin':
        tileCode += 10;
        break;
      case 'bamboo':
        tileCode += 20;
        break;
      case 'wind':
        tileCode += 30;
        break;
      case 'dragon':
        tileCode += 70;
    }

    switch (rank) {
      case 'white':
        break;
      case 'green':
        tileCode += 10;
        break;
      case 'red':
        tileCode += 20;
        break;
      case 'east':
        break;
      case 'south':
        tileCode += 10;
        break;
      case 'west':
        tileCode += 20;
        break;
      case 'north':
        tileCode += 30;
        break;
      default:
        tileCode += rank;
    }

    return tileCode;
  }
}
