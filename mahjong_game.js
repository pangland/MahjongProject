import { findTileCode } from './util.js';

class MahjongGame {
  constructor() {
    this.tiles = this.generateTiles();
    this.deadWall = this.setupWall();
    this.orderStartingHand();
    this.discards = [];
    this.drawnTile = null;
    this.closedKans = [];
    this.openHand = [];
    this.totalKans = 0;
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

  setupWall() {
    this.deadWall = {
      top: this.tiles.splice(0,10),
      bottom: this.tiles.splice(0,10)
    };
  }

  orderStartingHand() {
    const hand = this.tiles.splice(0,13);
    hand.sort((a, b) => {
      return a.tileCode <  b.tileCode ? -1 : 1;
    });

    this.hand = hand;
  }

  drawTile() {
    this.drawnTile = this.tiles.splice(0,1)[0];
  }

  discardTile(index) {
    if (index === 13) {
      this.discards.push(this.drawnTile);
    } else {
      const hand = this.hand;
      this.discards.push(hand[index]);
      hand.splice(index, 1);
      hand.push(this.drawnTile);
      hand.sort((a, b) => {
        return a.tileCode <  b.tileCode ? -1 : 1;
      });
      this.hand = hand;
    }
  }

  isKannable() {
    for (let i = 0; i < this.hand.length - 2; i++) {
      if (this.hand[i].tileCode > this.drawnTile.tileCode) {
        return false;
      }

      if (
        this.hand[i].tileCode === this.drawnTile.tileCode
        && this.hand[i].tileCode === this.hand[i+1].tileCode
        && this.hand[i+1].tileCode === this.hand[i+2].tileCode
      ) {
        return true;
      } else if (this.hand[i].tileCode === this.drawnTile.tileCode) {
        return false;
      }
    }
    return false;
  }

  closedKan() {
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].tileCode === this.drawnTile.tileCode) {
        this.closedKans.push(this.drawnTile);
        this.openHand.unshift({
          details: this.drawnTile,
          type: 'closedKan'
        });

        this.hand.splice(i, 3);
        this.drawTile();
      }
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

    const handPlusDraw = this.hand.slice(0);
    handPlusDraw.push(this.drawnTile);
    handPlusDraw.sort((a, b) => {
      return a.tileCode <  b.tileCode ? -1 : 1;
    });

    function handParser(hand, pairCount = 0, storedSequences = []) {
      function checkRun() {
        const runIndices = [0];
        const currentTileCode = hand[0].tileCode;
        let i = 1;
        let j = 1;
        while (j < 3 && i < hand.length) {
          if (currentTileCode + j - 1 === hand[i].tileCode) {
            i += 1;
          } else if (currentTileCode + j === hand[i].tileCode){
            runIndices.push(i);
            i += 1;
            j += 1;
          } else {
            return [];
          }
        }
        return runIndices;
      }

      function checkTriplet() {
        if (
          hand.length > 2
          && hand[1].tileCode === hand[0]
          && hand[2].tileCode === hand[0]
        ) {
          return true;
        }
        return false;
      }

      if (hand.length === 0) {
        winningHands.push(storedSequences);
      } else {
        if (hand[0].tileCode < 30 && hand.length > 2) {
          const runIndices = checkRun(hand);
          if (runIndices.length > 0) {
            const sequence = {
              type: 'run',
              details: hand[0]
            };

            const cloneHand = hand.slice(0);
            for (let i = 0; i < 3; i++) {
              cloneHand.splice(runIndices.pop(), 1);
            }

            const sequences = Object.assign({}, storedSequences, sequence);
            handParser(cloneHand, pairCount, sequences);
          }
        }

        const isTriplet = checkTriplet(hand);

        if (isTriplet) {
          const sequence = {
            type: 'triplet',
            details: hand[0]
          };

          const cloneHand = hand.slice(0);
          cloneHand.splice(0, 3);
          const sequences = Object.assign({}, storedSequences, sequence);
          handParser(cloneHand, pairCount, sequences);
        }

        if (
          (pairCount === storedSequences.length || pairCount === 0)
          && hand[0].tileCode === hand[1].tileCode
        ) {
          const sequence = {
            type: 'pair',
            details: hand[0]
          };

          const cloneHand = hand.slice(0);
          cloneHand.splice(0,2);
          const sequences = Object.assign({}, storedSequences, sequence);
          handParser(cloneHand, pairCount + 1, sequences);
        }
      }
    }

    handParser(handPlusDraw);
    if (winningHands.length > 0) {
      return true;
    }
  }

  calculatePoints(winningHand) {
    const allGreens = [22, 23, 24, 26, 28, 90];
    let isGreen = true;

    const suits = {};
    const winds = {};
    const dragons = {};
    const ranks = {};
    let runs = 0;
    let melds = 0;
    let pairs = 0;
    let dragonCount = 0;
    let windCount = 0;
    let allHonors = true;
    let allTerminals = true;
    let allIncludeTerminals = true;
    let pairSuit;
    let fu = 20;

    const handleMeld = ((sequence) => {
      const fuMultiplier = sequence.type === 'triplet' ? 1 : 4;
      melds++;
      suits[sequence.details.suit] = true;

      if (!allGreens.includes(sequence.details.tileCode)) {
        isGreen = false;
      }

      if (sequence.details.tileCode % 10 === 0) {
        allTerminals = false;
        allIncludeTerminals = false;
        sequence.details.suit === 'wind' ? windCount++ : dragonCount++;
        fu += 8 * fuMultiplier;
      } else if (
        sequence.details.tileCode % 10 !== 1
        && sequence.details.tileCode % 10 !== 9
      ) {
        allHonors = false;
        allTerminals = false;
        allIncludeTerminals = false;
        fu += 4 * fuMultiplier;
      } else {
        allHonors = false;
        fu += 8 * fuMultiplier;
      }
    });

    const handleRun = ((sequence) => {
      runs++;
      allTerminals = false;
      allHonors = false;
      suits[sequence.details.suit] = true;

      if (sequence.details.tileCode !== 22) {
        isGreen = false;
      }

      if (
        sequence.details.tileCode % 10 !== 1
        && sequence.details.tileCode % 10 !== 7
      ) {
        allIncludeTerminals = false;
      }
    });

    const handlePair = ((sequence) => {
      if (pairs === 0) {
        suits[sequence.details.suit] = true;
      } else {
        pairSuit = false;
      }

      if (!allGreens.includes(sequence.details.tileCode)) {
        isGreen = false;
      }

      if (
        sequence.details.suit % 10 !== 1
        && sequence.details.suit % 10 !== 9
      ) {
        allTerminals = false;
        allIncludeTerminals = false;
      } else if (sequence.details.suit % 10 !== 0) {
        allHonors = false;
      }
    });

    const isNineGates = () => {
      if (Object.keys(suits).length > 1 || allHonors | this.closedKans.length > 0) {
        return false;
      }

      const baseline = [3, 1, 1, 1, 1, 1, 1, 1, 3];
      const numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0];

      winningHand.forEach((sequence) => {
        const digit = sequence.details.tileCode % 10;
        switch (sequence.type) {
          case 'triplet':
            if (digit !== 1 && digit !== 9) {
              return false;
            }
            numbers[digit - 1] += 3;
            break;
          case 'run':
            numbers[digit - 1] += 1;
            numbers[digit] += 1;
            numbers[digit + 1] += 1;
            break;
          case 'pair':
            numbers[digit - 1] += 2;
        }
      });

      let excessCounted = false;
      for (let i = 0; i < baseline.length; i++) {
        if (numbers[i] < baseline[i] || numbers[i] > baseline[i] + 1) {
          return false;
        }

        if (numbers[i] === baseline[i] + 1 && excessCounted) {
          return false;
        } else if (numbers[i] === baseline[i] + 1) {
          excessCounted = true;
        }
      }
    };

    this.closedKans.forEach((sequence) => {
      handleMeld(sequence);
    });

    winningHand.forEach((sequence) => {
      switch (sequence.type) {
        case 'closedKan':
          handleMeld(sequence);
          break;
        case 'run':
          handleRun(sequence);
          break;
        default:
          handlePair(sequence);
      }
    });

    const winConditions = [];

    if (this.closedKans.length === 4) {
      winConditions.push({
        japaneseName: 'Suu kantsu',
        englishName: 'Four quads',
        value: 8000
      });
    } else if (melds === 4) {
      winConditions.push({
        japaneseName: 'suu ankou',
        englishName: 'Four concealed triplets',
        value: 8000
      });
    }

    if (allHonors) {
      winConditions.push({
        japaneseName: 'tsuu iisou',
        englishName: 'All honors',
        value: 8000
      });
    } else if (allTerminals) {
      winConditions.push({
        japaneseName: 'chinroutou',
        englishNames: 'All terminals',
        value: 8000
      });
    }

    if (windCount === 4) {
      winConditions.push({
        japaneseName: 'daisuushii',
        englishName: 'Big four winds',
        value: 16000
      });
    } else if (windCount === 3 && pairSuit === 'wind') {
      winConditions.push({
        japaneseName: 'shousuushii',
        englishName: 'Little four winds',
        value: 8000
      });
    } else if (dragonCount === 3) {
      winConditions.push({
        japaneseName: 'daisangen',
        englishName: 'Big three dragons',
        value: 8000
      });
    } else if (allTerminals) {
      winConditions.push({
        japaneseName: 'chinroutou',
        englishName: 'All terminals',
        value: 8000
      });
    }

    if (isGreen) {
      winConditions.push({
        japaneseName: 'ryuuisou',
        englishName: 'All green',
        points: 8000
      });
    }

    if (winConditions.length > 0) {
      return winConditions;
    }

    if (isNineGates()) {

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
