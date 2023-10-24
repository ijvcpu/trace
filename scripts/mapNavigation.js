function mapView () {
  hideButton("all")
  // Checks for move arrows and generates accordingly
  const moveCheck = document.querySelector(".move-arrow")
  if (moveCheck) {
    showButton("move-arrow")
  } else {
    generateMoveArrows()
  }

  // Checks for minimap and generates accordingly
  const minimapCheck = document.getElementById("minimap")
  if (minimapCheck) {
    showButton("minimap")
  } else {
    generateMinimap()
  }

  currentMap = new BlockMap() // Declared as a global game variable in game.js
  currentMap.mapRefreshView()

  // Checks for the clickable area toggle buttons and generates accordingly
  const toggleCheck = document.querySelector(".clickable-toggle")
  if (toggleCheck) {
    showButton("clickable-toggle")
  } else {
    generateClickableAreaToggle()
  }

  // Checks for the phone mode button and generates accordingly
  const phoneCheck = document.querySelector(".phone-button")
  if (phoneCheck) {
    showButton("phone-button")
  } else {
    generatephoneToggle()
  }
  generateClickableArea("look")
  generateClickableArea("talk")
  generateClickableArea("get")
}

function mapReturn (bookmark) {
  // hideButton('all');
  // Splits the bookmark into 3 tokens for parsing id, block, and facing
  bookmarkParts = bookmark.split("_")
  currentMap.mapId = bookmarkParts[0]
  currentMap.currentBlock = bookmarkParts[1]
  currentMap.facing = bookmarkParts[2]

  currentMap.mapRefreshView()
  const moveCheck = document.querySelector(".move-arrow")
  if (moveCheck) {
    showButton("move-arrow")
  } else {
    generateMoveArrows()
  }

  // Checks for minimap and generates accordingly
  const minimapCheck = document.getElementById("minimap")
  if (minimapCheck) {
    showButton("minimap")
  } else {
    generateMinimap()
  }

  const toggleCheck = document.querySelector(".clickable-toggle")
  if (toggleCheck) {
    showButton("clickable-toggle")
  } else {
    generateClickableAreaToggle()
  }
  const phoneCheck = document.querySelector(".phone-button")
  if (phoneCheck) {
    showButton("phone-button")
  } else {
    generatephoneToggle()
  }
}

// Generates map object data
class BlockMap {
  constructor () {
    this.currentBlock = 0
    this.facing = "n"
    // Used to determine block arrangements and data, stored separately
    this.mapId = 0
  }

  // Refresh the screen after any movement has taken place
  mapRefreshView () {
    /*
    // Prevents movement animations from overlapping
    if (animationHandler.getAnimatingFlag()) {
      // If the animation is already in progress, do nothing.
      return
    }
    */
    animationHandler.raiseAnimatingFlag()
    
    containerListHandler.deleteAllClickableAreas()
    let currentView = "m" + String(currentMap.mapId) +
      String(currentMap.currentBlock) + String(currentMap.facing)
    // Defines the image corresponding to the direction and block
    displayBackground(currentView) // Set the new background image
    // Displays the clickable area based on the current block and facing
    generateClickableArea("look")
    generateClickableArea("talk")
    generateClickableArea("get")
    minimapHandler() // Updates the minimap view
    setTimeout(() => {
      // Reset the flag to indicate that the animation has finished.
      animationHandler.lowerAnimatingFlag()
    }, 800)
  }

  // Move using the arrow keys at bottom right
  mapMove (inputDirection) {
    // For input x: {if current facing is y: new facing is z, ...}
    const directionMapTurning = {
      w: { n: "w", e: "n", s: "e", w: "s" },
      e: { n: "e", e: "s", s: "w", w: "n" }
      // Add other directions here
    }
    /*
    Map 0 Configuration:
      __  __  __
    |_1_|_2_|_3_|
        |_0_|

    */

    // Used for n and s movement. xyz: For input x, current block y, facing z,
    // return the new location if valid
    const directionMap0Moving = {
      n0n: () => {
        this.currentBlock = 2
      },

      s0s: () => {
        this.currentBlock = 2
      },

      n1e: () => {
        this.currentBlock = 2
      },

      s1w: () => {
        this.currentBlock = 2
      },

      n2w: () => {
        this.currentBlock = 1
      },

      s2e: () => {
        this.currentBlock = 1
      },

      n2e: () => {
        this.currentBlock = 3
      },

      s2w: () => {
        this.currentBlock = 3
      },

      n2s: () => {
        this.currentBlock = 0
      },

      s2n: () => {
        this.currentBlock = 0
      },

      n3w: () => {
        this.currentBlock = 2
      },

      s3e: () => {
        this.currentBlock = 2
      }

    }

    const directionMapList = [
      directionMap0Moving
      // directionMap1Moving,
      // Add more direction maps as needed
    ]

    // West and east inputs just turn the view, north and south
    // move to a new block while retaining the same facing
    if (inputDirection == "w" || inputDirection == "e") {
      this.facing = directionMapTurning[inputDirection][this.facing]

    // North and south inputs will change the current block but keep
    // the facing unchanged, requires referencing the current map
    } else {
      const moveCheck = inputDirection + this.currentBlock +
        this.facing // Ex: n0e
      if (directionMapList[this.mapId][moveCheck]) {
        // Execute the corresponding handler function
        directionMapList[this.mapId][moveCheck]()
      } else {
        console.log("Error: No handler found for tag " + buttonTag)
      }
    }
    this.mapRefreshView() // Updates to the new screen
  }
}

// Generates and places the minimap view at the bottom right
function generateMinimap () {
  minimap = document.createElement("div")
  minimap.id = "minimap"
  minimap.classList.add("minimap")
  // Added to allow for removal with other map navigation elements
  minimap.classList.add("button")
  // Allows this element to be clicked through to lower z values
  minimap.style.pointerEvents = "none"
  // The minimap map image
  minimapImage = document.createElement("img")
  minimapImage.src = "./gui/map_minimap_0.png"
  minimap.appendChild(minimapImage)
  minimap.style.position = "fixed"
  minimap.style.left = "74.5vw"
  minimap.style.top = "85vh"
  minimapImage.style.height = "14vh"
  minimapImage.style.width = "11vw"
  // The minimap indicator arrow
  minimapArrow = document.createElement("img")
  minimapArrow.src = "./gui/minimap_arrow_n_idle.png"
  minimapArrow.id = "minimapArrow"
  minimap.appendChild(minimapArrow)
  minimapArrow.style.position = "absolute"
  minimapArrow.style.left = "19vw"
  minimapArrow.style.top = "51.5vh"
  minimapArrow.style.height = "2.5vw"
  minimapArrow.style.width = "5vh"
  document.body.appendChild(minimap)
}

// Prints the location arrow in the correct position and facing on the minimap
function minimapHandler () {
  const minimapArrow = document.getElementById("minimapArrow")
  const thisMap = currentMap.mapId
  const thisBlock = currentMap.currentBlock
  const thisFacing = currentMap.facing
  if (thisMap == 0) {
    if (thisBlock == 0) {
      minimapArrow.style.left = "4.22vw"
      minimapArrow.style.top = "7.8vh"
    }
    if (thisBlock == 1) {
      minimapArrow.style.left = "0.7vw"
      minimapArrow.style.top = "1.2vh"
    }
    if (thisBlock == 2) {
      minimapArrow.style.left = "4.22vw"
      minimapArrow.style.top = "1.2vh"
    }
    if (thisBlock == 3) {
      minimapArrow.style.left = "7.74vw"
      minimapArrow.style.top = "1.2vh"
    }
    if (thisFacing == "n") {
      minimapArrow.src = "./gui/minimap_arrow_n_idle.png"
    }
    if (thisFacing == "e") {
      minimapArrow.src = "./gui/minimap_arrow_e_idle.png"
    }
    if (thisFacing == "s") {
      minimapArrow.src = "./gui/minimap_arrow_s_idle.png"
    }
    if (thisFacing == "w") {
      minimapArrow.src = "./gui/minimap_arrow_w_idle.png"
    }
  }
}
