// Specific card counter

export function cardsCounter(array) {
    const counter = {};
    array.forEach((card) => {
      if (counter[card]) {
        counter[card] += 1;
      } else {
        counter[card] = 1;
      }
    });
    return counter;
  }

// Deck shuffler
 export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }