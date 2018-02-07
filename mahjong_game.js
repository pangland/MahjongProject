import { findTileCode } from './util.js';

class MahjongGame {
  constructor() {
    this.tiles = this.generateTiles();
    this.orderStartingHand();
    this.discards = [];
    this.drawnTile = null;
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

  orderStartingHand() {
    const hand = this.allTiles.splice(0,13);
    hand.sort((a, b) => {
      return a.tileCode <  b.tileCode ? -1 : 1;
    });

    this.hand = hand;
  }

  drawTile() {
    this.drawnTile = this.tiles.splice(0,1)[0];
  }

  discardTile(index) {
    const newDrawnTile = this.tiles.splice(0,1)[0];
    if (index === 13) {
      this.discards.push(this.drawnTile);
    } else {
      const hand = this.state.hand;
      this.discards.push(hand[index]);
      hand.splice(index, 1);
      hand.push(this.state.drawnTile);
      hand.sort((a, b) => {
        return a.tileCode <  b.tileCode ? -1 : 1;
      });
    }
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
        tileCode += 40;
        break;
      case 'dragon':
        tileCode += 80;
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

  isWinningHand() {
    // let's ignore yakuman for now
    const winningHands = [];
    const tripletCount = 0;

    function handParser(hand, pairCount = 0, storedSequences = []) {
      function checkRun() {
        const runIndices = [0];
        let currentTileCode = hand[0].tileCode;
        let i = 1;
        let j = 1;
        let newTileCode = hand[i].tileCode;
        while (j < 3 && newTileCode <= currentTileCode + j) {
          if (currentTileCode === newTileCode) {
            i += 1;
          } else if (currentTileCode + 1 === newTileCode){
            runIndices.push(i);
            i += 1;
            j += 1;
          } else {
            return [];
          }
          newTileCode = hand[i].tileCode;
        }
        return runIndices;
      }

      function checkTriplet() {
        if (
          hand[1].tileCode === hand[0]
          && hand[2].tileCode === hand[0]
        ) {
          return true;
        }
        return false;
      }

      if (hand.length === 0) {
        winningHands.push(storedSequences);
      } else {
        if (hand[0].tileCode < 30) {
          const runIndices = checkRun(hand);
          if (runIndices.length > 0) {
            storedSequences.push({
              type: run,
              details: hand[0]
            });

            const cloneHand = hand.slice(0);
            for (let i = cloneHand.length - 1; i >= 0; i--) {
              cloneHand.splice(runIndices.pop(), 1);
            }

            handParser(cloneHand, pairCount, storedSequences);
          }
        }

        const isTriplet = checkTriplet(hand);

        if (isTriplet) {
          storedSequences.push({
            type: 'triplet',
            details: hand[0]
          });

          const cloneHand = hand.slice(0);
          cloneHand.splice(0, 3);
          handParser(cloneHand, pairCount, storedSequences);
        }

        if (
          (pairCount === storedSequences.length || pairCount === 0)
          && hand[0].tileCode === hand[1].tileCode
        ) {
          const cloneHand = hand.slice(0);
          cloneHand.splice(0,2);
          handParser(cloneHand, pairCount, storedSequences);
        }
      }
    }

    handParser(this.hand);
    if (winningHands.length > 0) {
      console.log('test');
    }
  }

  isOpen() {
    return false;
  }

  // isTenpai() {
  //   const tileCodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15,
  //     16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 40, 50, 60,
  //     70, 80, 90, 100];
  //
  //   for (let i = 0; i < this.hand.length; i++) {
  //     let savedTileCode = this.hand[i].tileCode;
  //     tileCodes.forEach((tileCode) => {
  //       this.hand[i].tileCode = tileCode;
  //       if (this.isWinningHand()) {
  //         break;
  //       }
  //     });
  //     this.hand[i].tileCode = savedTileCode;
  //   }
  //
  //   this.isWinningHand();
  // }
}

export default MahjongGame;
