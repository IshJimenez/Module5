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
    const rotateButton = document.querySelector('#rotateB')
    const turnDisplay = document.querySelector('#whose-turn')
    const infoDisplay = document.querySelector('#info')
    const singlePlayerButton = document.querySelector('#singlePlayerButton')
    const multiPlayerButton = document.querySelector('#multiPlayerButton')
    const userSquares = []
    const compSquares = []
    let isHorizontal = true
    let isGameOver = false
    let currentPlayer = 'user'

    const width = 10
    let gameMode = " ";
    let playerNum = 0;
    let ready = false;
    let enenmyReady = false;
    let allShipsPlaced = false;
    let shotFired = -1

    //Set Player Mode
    singlePlayerButton.addEventListener('click', startSinglePlayer)
    multiPlayerButton.addEventListener('click', startMultiPlayer)

    // Multi Player
    function startMultiPlayer(){
        gameMode = "multiPlayer"

        const socket = io();

    //Get your player Num
    socket.on('player-number', num => {
        if (num === -1) {
            infoDisplay.innerHTML = "Sorry hommie game is currently in progress"
        } else {
            playerNum = parseInt(num)
            if(playerNum === 1) currentPlayer = "enemy"

            console.log(playerNum)
        }
    })

    //Another Champion has connected or disconnected 
    socket.on('player-connection', num => {
        console.log(`Champion number ${num} has connected or disconnected`)
        playerConnectedOrDisconnected(num)
    })

    //Ready button click
    startButton.addEventListener('click', () => {
        if(allShipsPlaced) playGameMulti(socket)
        else infoDisplay.innerHTML = "Think your slick huh place all the ships in the board"
    })

    function playerConnectedOrDisconnected(num) {
        let player = `.p${parseInt(num) + 1}`
        document.querySelector(`${player} .connected span`).classList.toggle('green')
        if(parseInt(num) === playerNum) document.querySelector(player).style.fontWeight = 'bold'
    }
    }

    //Single Player
    function startSinglePlayer() {
        gameMode = "singlePlayer"

    createBaddies(shipArray[0])
    createBaddies(shipArray[1])
    createBaddies(shipArray[2])
    createBaddies(shipArray[3])
    createBaddies(shipArray[4])

    startButton.addEventListener('click', playGameSingle)

    }

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

    

    //Rotate those boats
    function rotate() {
        if (isHorizontal) {
            killer.classList.toggle('killer-container-vertical')
            shark.classList.toggle('shark-container-vertical')
            cruiser.classList.toggle('cruiser-container-vertical')
            battleship.classList.toggle('battleship-container-vertical')
            carrier.classList.toggle('carrier-container-vertical')
            isHorizontal = false 
            console.log(isHorizontal)
            return
        }
        if (!isHorizontal) {
            killer.classList.toggle('killer-container-vertical')
            shark.classList.toggle('shark-container-vertical')
            cruiser.classList.toggle('cruiser-container-vertical')
            battleship.classList.toggle('battleship-container-vertical')
            carrier.classList.toggle('carrier-container-vertical')
            isHorizontal = true   
            console.log(isHorizontal)
            return
        }
    }
    
    rotateButton.addEventListener('click', rotate)

    //Move the human ship
    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragover', dragOver))
    userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
    userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
    userSquares.forEach(square => square.addEventListener('drop', dragDrop))
    userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

    let selectedShipNameWithIndex
    let draggedShip 
    let draggedShipLength

    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectedShipNameWithIndex = e.target.id
        console.log(selectedShipNameWithIndex)
    }))

    function dragStart() {
        draggedShip = this
        draggedShipLength = this.childNodes.length
        console.log(draggedShip)
    }
    function dragOver(e) {
        e.preventDefault()
    }
    function dragEnter(e) {
        e.preventDefault()
    }
    function dragLeave() {
        console.log('drag leave')
    }
    function dragDrop() {
        let shipNameWithLastId = draggedShip.lastChild.id
        let shipClass = shipNameWithLastId.slice(0, -1)
        console.log(shipClass)
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
        let shipLastId = lastShipIndex + parseInt(this.dataset.id)
        console.log(shipLastId)
        const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
        const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60]
        
        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
        let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

        selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))
        
        shipLastId = shipLastId - selectedShipIndex
        console.log(shipLastId)

        if(isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for(let i = 0; i < draggedShipLength; i++) {
                userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass)
            }
        } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
            for(let i = 0; i < draggedShipLength; i++) {
                userSquares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', shipClass)
            }
        } else return

        displayGrid.removeChild(draggedShip)
        if(!displayGrid.querySelector('.ship')) allShipsPlaced = true
    }
    function dragEnd() {
        console.log('dragend')
    }

    //Game logic MULTI
    function playGameMulti(socket){
        if(isGameOver) return
        if(!ready) {
            socket.emit('player-ready')
            ready = true
            playerReady(playerNum)
        }
    }

    function playerReady()

    //Game Logic SINGLE
    function playGameSingle() {
        if(isGameOver) return
        if(currentPlayer === 'user') {
            turnDisplay.innerHTML = "Your Turn"
            compSquares.forEach(square => square.addEventListener('click', function(e) {
            revealSquare(square)
            }))
        }
        if(currentPlayer === 'computer') {
            turnDisplay.innerHTML = "Computers Turn"
            setTimeout (computerGo, 1000)
        }
    }
    

    let killerCount = 0
    let sharkCount = 0
    let cruiserCount = 0
    let battleshipCount = 0
    let carrierCount = 0

    function revealSquare(square) {
        if(!square.classList.contains('bang')){
            if(square.classList.contains('killer')) killerCount++
            if(square.classList.contains('shark')) sharkCount++
            if(square.classList.contains('cruiser')) cruiserCount++
            if(square.classList.contains('battleship')) battleshipCount++
            if(square.classList.contains('carrier')) carrierCount++
        }
            if(square.classList.contains('taken')) {
            square.classList.add('bang')
            } else {
            square.classList.add('miss')
        }
        currentPlayer = 'computer'
        checkForWins()
        playGameSingle()
        
    }

    let cpuKillerCount = 0
    let cpuSharkCount = 0
    let cpuCruiserCount = 0
    let cpuBattleshipCount = 0
    let cpuCarrierCount = 0

    function computerGo() {
        let random = Math.floor(Math.random() * userSquares.length)
        if (!userSquares[random].classList.contains('taken')) {
            userSquares[random].classList.add('miss')
            if(userSquares[random].contains('killer')) cpuKillerCount++
            if(userSquares[random].contains('shark')) cpuSharkCount++
            if(userSquares[random].contains('cruiser')) cpuCruiserCount++
            if(userSquares[random].contains('battleship')) cpuBattleshipCount++
            if(userSquares[random].contains('carrier')) cpuCarrierCount++
        // } 
        // if(userSquares[random].contains('taken')) {
        //     userSquares[random].add('bang')
        } else {
            // if (!userSquares[random].classList.contains('bang')) {   
            //     userSquares[random].classList.add('bang')
            //     if(userSquares[random].contains('killer')) cpuKillerCount++
            //     if(userSquares[random].contains('shark')) cpuSharkCount++
            //     if(userSquares[random].contains('cruiser')) cpuCruiserCount++
            //     if(userSquares[random].contains('battleship')) cpuBattleshipCount++
            //     if(userSquares[random].contains('carrier')) cpuCarrierCount++
            // }

            if(userSquares[random].contains('taken')) {
                userSquares[random].add('bang')
                // } else {
                // userSquares[random].add('miss')
            }



        console.log("I see you")   
        computerGo()
        currentPlayer = 'user'
        checkForWins()
        turnDisplay.innerHTML = 'Your Turn'
    }}


    function checkForWins() {
        if(killerCount === 2) {
            infoDisplay.innerHTML = "You sunk the comps killer"
            killerCount = 10
        }
        if(sharkCount === 3) {
            infoDisplay.innerHTML = "You sunk the comps shark"
            sharkCount = 10
        }
        if(cruiserCount === 3) {
            infoDisplay.innerHTML = "You sunk the comps cruiser"
            cruiserCount = 10
        }
        if(battleshipCount === 4) {
            infoDisplay.innerHTML = "You sunk the comps battleship"
            battleshipCount = 10
        }
        if(carrierCount === 5) {
            infoDisplay.innerHTML = "You sunk the comps carrier"
            carrierCount = 10
        }
        if(cpuKillerCount === 2) {
            infoDisplay.innerHTML = "Comp sunk your killer"
            cpuKillerCount = 10
        }
        if(cpuSharkCount === 3) {
            infoDisplay.innerHTML = "Comp sunk your shark"
            cpuSharkCount = 10
        }
        if(cpuCruiserCount === 3) {
            infoDisplay.innerHTML = "Comp sunk your cruiser"
            cpuCruiserCount = 10
        }
        if(cpuBattleshipCount === 4) {
            infoDisplay.innerHTML = "Comp sunk your battleship"
            cpuBattleshipCount = 10
        }
        if(cpuCarrierCount === 5) {
            infoDisplay.innerHTML = "Comp sunk your carrier"
            cpuCarrierCount= 10
        }
        if((killerCount + sharkCount + cruiserCount + battleshipCount + carrierCount) === 50) {
            infoDisplay.innerHTML = "YOU HAVE SLAIN THE COMPUTER"
            gameOver()
        }
        if((cpuKillerCount + cpuSharkCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
            infoDisplay.innerHTML = "THE MACHINE HAS DESTROYED YOU"
            gameOver()
        }
    }

    function gameOver() {
        isGameOver = true
        startButton.removeEventListener('click', playGameSingle)
    }
    
})