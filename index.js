class BreadthFirstSearchAlgorithmDemo {
  #board = document.getElementById('board');
  #destinationSquare = null;
  #sprite;
  #squareProps = [
    [
      { enabled: false, index: 0 },
      { enabled: false, index: 1 },
      { enabled: false, index: 2 },
      { enabled: false, index: 3 },
      { enabled: false, index: 4 },
      { enabled: true, index: 5 },
      { enabled: false, index: 6 },
      { enabled: false, index: 7 },
    ],
    [
      { enabled: false, index: 8 },
      { enabled: true, index: 9 },
      { enabled: true, index: 10 },
      { enabled: true, index: 11 },
      { enabled: true, index: 12 },
      { enabled: true, index: 13 },
      { enabled: true, index: 14 },
      { enabled: false, index: 15 },
    ],
    [
      { enabled: false, index: 16 },
      { enabled: true, index: 17 },
      { enabled: false, index: 18 },
      { enabled: false, index: 19 },
      { enabled: false, index: 20 },
      { enabled: false, index: 21 },
      { enabled: true, index: 22 },
      { enabled: false, index: 23 },
    ],
    [
      { enabled: false, index: 24 },
      { enabled: true, index: 25 },
      { enabled: false, index: 26 },
      { enabled: true, index: 27 },
      { enabled: false, index: 28 },
      { enabled: true, index: 29 },
      { enabled: true, index: 30 },
      { enabled: false, index: 31 },
    ],
    [
      { enabled: false, index: 32 },
      { enabled: true, index: 33 },
      { enabled: false, index: 34 },
      { enabled: true, index: 35 },
      { enabled: false, index: 36 },
      { enabled: false, index: 37 },
      { enabled: true, index: 38 },
      { enabled: false, index: 39 },
    ],
    [
      { enabled: false, index: 40 },
      { enabled: true, index: 41 },
      { enabled: false, index: 42 },
      { enabled: true, index: 43 },
      { enabled: false, index: 44 },
      { enabled: true, index: 45 },
      { enabled: true, index: 46 },
      { enabled: false, index: 47 },
    ],
    [
      { enabled: false, index: 48 },
      { enabled: true, index: 49 },
      { enabled: true, index: 50 },
      { enabled: true, index: 51 },
      { enabled: true, index: 52 },
      { enabled: true, index: 53 },
      { enabled: true, index: 54 },
      { enabled: false, index: 55 },
    ],
    [
      { enabled: false, index: 56 },
      { enabled: false, index: 57 },
      { enabled: false, index: 58 },
      { enabled: false, index: 59 },
      { enabled: false, index: 60 },
      { enabled: false, index: 61 },
      { enabled: false, index: 62 },
      { enabled: false, index: 63 },
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
      column.forEach(({ enabled, index }) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.id = `square-${index}`;
        
        if (enabled) {
          square.dataset.weight = '';
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

const demo = new BreadthFirstSearchAlgorithmDemo();
demo.start();
