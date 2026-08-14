const symbols = ["C", "L", "B", "S", "D"]

let reels = [0, 0, 0]
let credits = 20
let spinning = false
let spinTimer = null
let step = 0

const spinCost = 2

setLegend(
  ["b", bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`]
)

setMap(map`
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
`)

function draw() {
  clearText()

  addText("SLOTS", {
    x: 7,
    y: 1,
    color: color`3`
  })

  addText("CREDITS " + credits, {
    x: 4,
    y: 3,
    color: color`3`
  })

  addText("+-----+ +-----+ +-----+", {
    x: 0,
    y: 6,
    color: color`3`
  })

  addText(
    "|  " + symbols[reels[0]] +
    "  | |  " + symbols[reels[1]] +
    "  | |  " + symbols[reels[2]] + "  |",
    {
      x: 0,
      y: 8,
      color: color`3`
    }
  )

  addText("+-----+ +-----+ +-----+", {
    x: 0,
    y: 10,
    color: color`3`
  })

  addText("C CHERRY L LEMON", {
    x: 1,
    y: 12,
    color: color`3`
  })

  addText("B BELL S STAR D DIAMOND", {
    x: 0,
    y: 13,
    color: color`3`
  })

  addText("A SPIN  D RESET", {
    x: 3,
    y: 15,
    color: color`3`
  })
}

function randomSymbol() {
  return Math.floor(Math.random() * symbols.length)
}

function showMessage(message) {
  clearText()

  addText("SLOTS", {
    x: 7,
    y: 1,
    color: color`3`
  })

  addText("CREDITS " + credits, {
    x: 4,
    y: 3,
    color: color`3`
  })

  addText(
    "   " +
    symbols[reels[0]] +
    "       " +
    symbols[reels[1]] +
    "       " +
    symbols[reels[2]],
    {
      x: 1,
      y: 8,
      color: color`3`
    }
  )

  addText(message, {
    x: 4,
    y: 5,
    color: color`3`
  })

  addText("A SPIN", {
    x: 6,
    y: 13,
    color: color`3`
  })
}

function checkWin() {
  let a = reels[0]
  let b = reels[1]
  let c = reels[2]

  let prize = 0
  let message = ""

  // Three diamonds
  if (a === 4 && b === 4 && c === 4) {
    prize = 100
    message = "JACKPOT +100"
  }

  // Three stars
  else if (a === 3 && b === 3 && c === 3) {
    prize = 50
    message = "BIG WIN +50"
  }

  // Three bells
  else if (a === 2 && b === 2 && c === 2) {
    prize = 30
    message = "WIN +30"
  }

  // Three lemons
  else if (a === 1 && b === 1 && c === 1) {
    prize = 20
    message = "WIN +20"
  }

  // Three cherries
  else if (a === 0 && b === 0 && c === 0) {
    prize = 15
    message = "WIN +15"
  }

  // Pair = half the 2-credit spin cost
  else if (a === b || b === c || a === c) {
    prize = 1
    message = "PAIR +1"
  }

  else {
    message = "NO LUCK"
  }

  credits += prize

  showMessage(message)
}

function spin() {
  if (spinning)
    return

  if (credits < spinCost) {
    showMessage("NOT ENOUGH")
    return
  }

  credits -= spinCost
  spinning = true
  step = 0

  spinTimer = setInterval(() => {

    if (step < 10) {
      reels[0] = randomSymbol()
    }

    if (step < 14) {
      reels[1] = randomSymbol()
    }

    if (step < 18) {
      reels[2] = randomSymbol()
    }

    step++

    draw()

    if (step >= 18) {
      clearInterval(spinTimer)

      spinTimer = null
      spinning = false

      checkWin()
    }

  }, 100)
}

function reset() {
  if (spinTimer !== null) {
    clearInterval(spinTimer)
    spinTimer = null
  }

  spinning = false
  credits = 20

  reels[0] = randomSymbol()
  reels[1] = randomSymbol()
  reels[2] = randomSymbol()

  draw()
}

onInput("a", () => {
  spin()
})

onInput("d", () => {
  if (!spinning) {
    reset()
  }
})

draw()