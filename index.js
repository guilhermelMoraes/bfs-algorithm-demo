class Game {
  #board = document.getElementById('board');
  #destinationSquare = null;
  #sprite;
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
  #movementInterval = null;
  #movementAudio = new Audio('./movement-sound.mp3');

  constructor() {
    const loadSprite = () => {
      const sprite = document.createElement('img');
      sprite.src = './sprite.png';
      sprite.alt = 'Sprite';
      sprite.id = 'sprite';
  
      this.#sprite = sprite;
    }

    const loadAudio = () => {
      this.#movementAudio.preload = 'auto';
      this.#movementAudio.volume = 1;
    }


    loadAudio();
    loadSprite();
  }

  #playMovementAudio() {
    this.#movementAudio.currentTime = 0;

    this.#movementAudio
      .play()
      .catch(console.error);
  }

  #getValidAdjacentSquares(refSquare, getWeightedAdjs = false) {
    const refId = Number.parseInt(refSquare.id.split('-').at(1));
    
    const getNextById = (id) => document.querySelector(`#square-${id}.square--enabled`);

    const adjacent = [
      { name: 'left', square: getNextById(refId - 1) },
      { name: 'top', square: getNextById(refId - this.#squareProps.length) },
      { name: 'bottom', square: getNextById(refId + this.#squareProps.length) },
      { name: 'right', square: getNextById(refId + 1) },
    ];
    
    const validSqrs = adjacent.filter(({ square }) => {
      if (getWeightedAdjs) {
        return square !== null && square?.dataset?.weight !== null
      } else {
        return square !== null && square?.dataset?.weight === 'null'
      }
    });

    return validSqrs;
  }

  #propagateWeight(refSquare) {
    const queue = [{ square: refSquare, distance: 0 }];
    
    while (queue.length > 0) {
      const { square, distance } = queue.shift();

      const adjacentSqrs = this.#getValidAdjacentSquares(square);

      adjacentSqrs.forEach(({ square: adjSqr }) => {
        adjSqr.dataset.weight = distance + 1;

        queue.push({ square: adjSqr, distance: distance + 1 });
      });
    }
  }

  #clearBoard() {
    const squares = document.querySelectorAll('.square--enabled');
    squares.forEach((el) => {
      el.dataset.weight = null;
    });
  }

  #moveSprite() {
    const halfSecond = 500;

    if (this.#movementInterval) {
      clearInterval(this.#movementInterval);
    }

    this.#movementInterval = setInterval(() => {
      const adjacent = this.#getValidAdjacentSquares(this.#sprite.parentElement, true);
    
      const currentPos = this.#sprite.parentElement;
      let moved = false;

      adjacent.forEach(({ square }) => {
        if (Number.parseInt(square.dataset.weight) < Number.parseInt(currentPos.dataset.weight)) {
          square.appendChild(this.#sprite);
          moved = true;
        }
      });

      if (moved) {
        this.#playMovementAudio();
      }

      if (this.#sprite.parentElement === this.#destinationSquare) {
        clearInterval(this.#movementInterval);
        this.#movementInterval = null;
      }
    }, halfSecond);
  }

  markDestination(event) {
    const prevDestinationSqr = this.#destinationSquare;
    if (prevDestinationSqr) {
      prevDestinationSqr.classList.remove('square--selected');
      prevDestinationSqr.dataset.weight = null;
    }
    
    this.#clearBoard();
    const square = event.currentTarget;
    square.classList.add('square--selected');
    this.#destinationSquare = square;
    square.dataset.weight = 0;
    
    this.#propagateWeight(square);
    this.#moveSprite();
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
          square.addEventListener('click', this.markDestination.bind(this));
        }
        
        this.#board.appendChild(square);
      });
    });
  }

  #getSquareById(index) {
    return document.getElementById(`square-${index}`);
  }

  start() {
    this.#createBoard();
    
    const initialSpritePos = this.#getSquareById(27);
    initialSpritePos.appendChild(this.#sprite);
  }
}

const match = new Game();
match.start();
