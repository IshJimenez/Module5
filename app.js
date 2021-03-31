document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('.guser')
    const compGrid = document.querySelector('.gcomp')
    const displayGrid = document.querySelector('.grid-display')
    const ships = document.querySelectorAll('.ship')
    const killer = document.querySelector('.killer-container')
    const shark = document.querySelector('.shark-container')
    const cruiser = document.querySelector('.cruiser-container')
    const battleship = document.querySelector('.battleship-container')
    const carrier = document.querySelector('.carrier-container')
    const startButton = document.querySelector('#start')
    const rotateButton = document.querySelector('#rotate')
    const turnDisplay = document.querySelector('#whose-turn')
    const infoDisplay = document.querySelector('#info')
    const userSquares = []
    const compSquares = []

    const width = 10

    //Board Creation
    function summonBoard(grid, squares) {
        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.dataset.id = i 
            grid.appendChild(square)
            squares.push(square)

    }
    }

    summonBoard(userGrid, userSquares)
    summonBoard(compGrid, compSquares)

    //Ships
    const shipArray = [
        {
            name: 'killer',
            directions: [
                [0, 1],
                [0, width]
            ]
        },
        {
            name: 'shark',
            directions: [
                [0, 1, 2],
                [0, width, width*2]
            ]
        },
        {
            name: 'cruiser',
            directions: [
                [0, 1, 2],
                [0, width, width*2]
            ]
        },
        {
            name: 'battleship',
            directions: [
                [0, 1, 2, 3],
                [0, width, width*2, width*3]
            ]
        },
        {
            name: 'carrier',
            directions: [
                [0, 1, 2, 3, 4],
                [0, width, width*2, width*3, width*4]
            ]
        },
    ]

    //Draw Enemy Ships in Random Spots
    function createBaddies(ship) {
      let randomDirection = Math.floor(Math.random() * ship.directions.length)
      let current = ship.directions[randomDirection]
      if (randomDirection === 0) direction = 1
      if (randomDirection === 1) direction = 10
      let randomStart = Math.abs(Math.floor(Math.random() * compSquares.length - (ship.directions[0].length * direction)))

      const isTaken = current.some(index => compSquares[randomStart + index].classList.contains('taken'))
      const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
      const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => compSquares[randomStart + index].classList.add('taken', ship.name))
    else createBaddies(ship)
    }
    createBaddies(shipArray[0])
    createBaddies(shipArray[1])
    createBaddies(shipArray[2])
    createBaddies(shipArray[3])
    createBaddies(shipArray[4])
})