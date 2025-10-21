let boards;
const boardsModule = await import('./boards.js');
boards = boardsModule.default;

class BreadthFirstSearchAlgorithmDemo {
  #board = document.getElementById('board');
  #destinationSquare = null;
  #ghost;
  #movementInterval = null;
  #squareProps = boards['12x12'];
  
  constructor() {
    const loadGhost = () => {
      const ghost = document.createElement('img');
      ghost.src = './ghost.png';
      ghost.alt = 'ghost';
      ghost.id = 'ghost';
      
      this.#ghost = ghost;
    }
    
    loadGhost();
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
  
  #moveGhost() {
    const halfSecond = 500;
    
    if (this.#movementInterval) {
      clearInterval(this.#movementInterval);
    }
    
    this.#movementInterval = setInterval(() => {
      const adjacent = this.#getValidAdjacentSquares(this.#ghost.parentElement, true);
      
      const currentPos = this.#ghost.parentElement;
      
      adjacent.forEach(({ square }) => {
        if (Number.parseInt(square.dataset.weight) < Number.parseInt(currentPos.dataset.weight)) {
          square.appendChild(this.#ghost);
        }
      });
      
      if (this.#ghost.parentElement === this.#destinationSquare) {
        clearInterval(this.#movementInterval);
        this.#movementInterval = null;
      }
    }, halfSecond);
  }
  
  #markDestination(event) {
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
    this.#moveGhost();
  }
  
  #createBoard(size = 'board--12x12') {
    this.#board.classList.add(size);

    this.#squareProps.forEach((column) => {
      column.forEach(({ enabled, index }) => {
        const square = document.createElement('div');
        square.classList.add('square', 'square--with-border');
        square.id = `square-${index}`;
        
        if (enabled) {
          square.dataset.weight = '';
          square.classList.add('square--enabled', 'square--show-weight');
          square.addEventListener('click', this.#markDestination.bind(this));
        }
        
        this.#board.appendChild(square);
      });
    });
  }
  
  #setOptions() {
    const showHideProps = (checkbox, className) => {
      this.#board.childNodes.forEach((sqr) => {
        if (checkbox.checked) {
          sqr.classList.add(className);
        } else {
          sqr.classList.remove(className);
        }
      });
    }

    const showBorders = document.getElementById('show-borders');
    showBorders.addEventListener('change', () => showHideProps(showBorders, 'square--with-border'));
    
    const showWeights = document.getElementById('show-weight');
    showWeights.addEventListener('change', () => showHideProps(showWeights, 'square--show-weight'));
  }

  start() {
    this.#createBoard();
    this.#setOptions();
    
    const initialGhostPos = document.getElementById(`square-${18}`);
    initialGhostPos.appendChild(this.#ghost);
  }
}

const demo = new BreadthFirstSearchAlgorithmDemo();
demo.start();
