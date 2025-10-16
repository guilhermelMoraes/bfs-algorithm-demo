class Game {
  #board = document.getElementById('board');
  #markedSquare = null;
  #squareProps = [
    [
      { weight: null, enabled: false, index: 0 },
      { weight: null, enabled: false, index: 1 },
      { weight: null, enabled: false, index: 2 },
      { weight: null, enabled: false, index: 3 },
      { weight: null, enabled: false, index: 4 },
      { weight: null, enabled: true, index: 5 },
      { weight: null, enabled: false, index: 6 },
      { weight: null, enabled: false, index: 7 },
    ],
    [
      { weight: null, enabled: false, index: 8 },
      { weight: null, enabled: true, index: 9 },
      { weight: null, enabled: true, index: 10 },
      { weight: null, enabled: true, index: 11 },
      { weight: null, enabled: true, index: 12 },
      { weight: null, enabled: true, index: 13 },
      { weight: null, enabled: true, index: 14 },
      { weight: null, enabled: false, index: 15 },
    ],
    [
      { weight: null, enabled: false, index: 16 },
      { weight: null, enabled: true, index: 17 },
      { weight: null, enabled: false, index: 18 },
      { weight: null, enabled: false, index: 19 },
      { weight: null, enabled: false, index: 20 },
      { weight: null, enabled: false, index: 21 },
      { weight: null, enabled: true, index: 22 },
      { weight: null, enabled: false, index: 23 },
    ],
    [
      { weight: null, enabled: false, index: 24 },
      { weight: null, enabled: true, index: 25 },
      { weight: null, enabled: false, index: 26 },
      { weight: null, enabled: true, index: 27 },
      { weight: null, enabled: false, index: 28 },
      { weight: null, enabled: true, index: 29 },
      { weight: null, enabled: true, index: 30 },
      { weight: null, enabled: false, index: 31 },
    ],
    [
      { weight: null, enabled: false, index: 32 },
      { weight: null, enabled: true, index: 33 },
      { weight: null, enabled: false, index: 34 },
      { weight: null, enabled: true, index: 35 },
      { weight: null, enabled: false, index: 36 },
      { weight: null, enabled: false, index: 37 },
      { weight: null, enabled: true, index: 38 },
      { weight: null, enabled: false, index: 39 },
    ],
    [
      { weight: null, enabled: false, index: 40 },
      { weight: null, enabled: true, index: 41 },
      { weight: null, enabled: false, index: 42 },
      { weight: null, enabled: true, index: 43 },
      { weight: null, enabled: false, index: 44 },
      { weight: null, enabled: true, index: 45 },
      { weight: null, enabled: true, index: 46 },
      { weight: null, enabled: false, index: 47 },
    ],
    [
      { weight: null, enabled: false, index: 48 },
      { weight: null, enabled: true, index: 49 },
      { weight: null, enabled: true, index: 50 },
      { weight: null, enabled: true, index: 51 },
      { weight: null, enabled: true, index: 52 },
      { weight: null, enabled: true, index: 53 },
      { weight: null, enabled: true, index: 54 },
      { weight: null, enabled: false, index: 55 },
    ],
    [
      { weight: null, enabled: false, index: 56 },
      { weight: null, enabled: false, index: 57 },
      { weight: null, enabled: false, index: 58 },
      { weight: null, enabled: false, index: 59 },
      { weight: null, enabled: false, index: 60 },
      { weight: null, enabled: false, index: 61 },
      { weight: null, enabled: false, index: 62 },
      { weight: null, enabled: false, index: 63 },
    ],
  ];

  #getValidAdjacentSquares(refSquare) {
    const refId = parseInt(refSquare.id.split('-').at(1));
    
    const getNextById = (id) => document.querySelector(`#square-${id}.square--enabled`);

    const adjacent = [
      { name: 'left', square: getNextById(refId - 1) },
      { name: 'top', square: getNextById(refId - 8) },
      { name: 'bottom', square: getNextById(refId + 8) },
      { name: 'right', square: getNextById(refId + 1) },
    ];
    
    const validSqrs = adjacent.filter(
      ({ square }) => square !== null && square?.dataset?.weight === 'null',
    );

    return validSqrs;
  }

  #propagateWeight(sqr, weight = 0) {
    const adjacentSqrs = this.#getValidAdjacentSquares(sqr);

    if (adjacentSqrs.length === 0) {
      return;
    }

    adjacentSqrs.forEach(({ square }) => {
      square.dataset.weight = weight + 1;
      square.innerHTML = weight + 1;
    });

    adjacentSqrs.forEach(({ square }) => {
      this.#propagateWeight(square, weight + 1);
    });
  }

  #clearBoard() {
    const squares = document.querySelectorAll('.square--enabled');
    squares.forEach((el) => {
      el.dataset.weight = null;
      el.innerHTML = '';
    });
  }

  #markDestination(event) {
    const prevMarkedSqr = this.#markedSquare;
    if (prevMarkedSqr) {
      prevMarkedSqr.classList.remove('square--selected');
      prevMarkedSqr.dataset.weight = null;
    }
    
    this.#clearBoard();
    const square = event.currentTarget;
    square.classList.add('square--selected');
    this.#markedSquare = square;
    square.dataset.weight = 0;
    square.innerHTML = 0;
    
    this.#propagateWeight(square);
  }
  
  #createBoard() {
    this.#squareProps.forEach((column) => {
      column.forEach(({ enabled, index, weight }) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.id = `square-${index}`;
        square.dataset.weight = weight;
        
        if (enabled) {
          square.classList.add('square--enabled');
          square.addEventListener('click', this.#markDestination.bind(this));
        }
        
        this.#board.appendChild(square);
      });
    });
  }
  
  start() {
    this.#createBoard();
  }
}

const match = new Game();
match.start();
