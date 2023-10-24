// mapInteraction.js - handles clickable areas in map view

// Clickable area containers declared into global scope prior to creation
let lookContainer
let talkContainer
let getContainer

// Generates a clickable area in map view for each type of interactivity
function generateClickableArea (type) {
  const currentView = String(currentMap.mapId) +
    String(currentMap.currentBlock) + String(currentMap.facing)

  // For look clickable objects
  if (type == "look") {
    let lookData = ""

    // Check the corresponding list for clickable areas in current view
    if (mapClickableLookAreaList[currentView]) {
      // Execute the corresponding handler function
      lookData = mapClickableLookAreaList[currentView]()
    } else {
      console.log("Error: No handler found for look tag " + currentView)
    }
    // Create a container for "look" clickable elements
    const lookContainer = document.createElement("div")
    lookContainer.id = currentView + "look"
    lookContainer.classList.add("clickable-area")
    document.body.appendChild(lookContainer)
    containerListHandler.pushToClickableAreaList(lookContainer.id)

    // Generate "look" clickable elements
    for (let i = 0; i < lookData.numberOfAreas; i++) {
      const lookElement = document.createElement("div")
      lookElement.classList.add("clickable-area-look")
      lookElement.classList.add("disabled")
      lookElement.setAttribute("tag", lookData.tag[i])

      // Split size and location values from the arrays
      const [width, height] = lookData.sizeXY[i].split("_")
      const [left, top] = lookData.locationXY[i].split("_")

      // Set the size and position CSS properties
      lookElement.style.width = width + "px"
      lookElement.style.height = height + "px"
      lookElement.style.position = "absolute"
      lookElement.style.left = left
      lookElement.style.top = top

      lookElement.addEventListener("click", function () {
        buttonHandler(lookElement)
        event.stopPropagation() // Prevent further propagation
      })

      lookElement.classList.add(lookData.tag) // Assign the "tag" class
      lookContainer.appendChild(lookElement)
    }
  }

  // For talk clickable objects
  if (type == "talk") {
    let talkData = ""
    if (mapClickableTalkAreaList[currentView]) {
      // Execute the corresponding handler function
      talkData = mapClickableTalkAreaList[currentView]()
    } else {
      console.log("Error: No handler found for talk tag " + currentView)
    }

    // Create a container for "talk" clickable elements
    const talkContainer = document.createElement("div")
    talkContainer.id = currentView + "talk"
    talkContainer.classList.add("clickable-area")
    document.body.appendChild(talkContainer)
    containerListHandler.pushToClickableAreaList(talkContainer.id)

    // Generate "talk" clickable elements
    for (let i = 0; i < talkData.numberOfAreas; i++) {
      const talkElement = document.createElement("div")
      talkElement.classList.add("clickable-area-talk")
      talkElement.classList.add("disabled")
      talkElement.setAttribute("tag", talkData.tag[i])

      // Split size and location values from the arrays
      const [width, height] = talkData.sizeXY[i].split("_")
      const [left, top] = talkData.locationXY[i].split("_")

      // Set the size and position CSS properties
      talkElement.style.width = width + "px"
      talkElement.style.height = height + "px"
      talkElement.style.position = "absolute"
      talkElement.style.left = left
      talkElement.style.top = top

      talkElement.addEventListener("click", function () {
        buttonHandler(talkElement)
        event.stopPropagation() // Prevent further propagation
      })

      talkElement.classList.add(talkData.tag) // Assign the "tag" class
      talkContainer.appendChild(talkElement)
    }
  }

  // For get clickable objects
  if (type == "get") {
    let getData = ""

    if (mapClickableGetAreaList[currentView]) {
      // Execute the corresponding handler function
      getData = mapClickableGetAreaList[currentView]()
    } else {
      console.log("Error: No handler found for get tag " + currentView)
    }
    // Create a container for "get" clickable elements
    const getContainer = document.createElement("div")
    getContainer.id = currentView + "get"
    getContainer.classList.add("clickable-area")
    document.body.appendChild(getContainer)
    containerListHandler.pushToClickableAreaList(getContainer.id)

    // Generate "get" clickable elements
    for (let i = 0; i < getData.numberOfAreas; i++) {
      const getElement = document.createElement("div")
      getElement.classList.add("clickable-area-get")
      getElement.classList.add("disabled")
      getElement.setAttribute("tag", getData.tag[i])

      // Split size and location values from the arrays
      const [width, height] = getData.sizeXY[i].split("_")
      const [left, top] = getData.locationXY[i].split("_")

      // Set the size and position CSS properties
      getElement.style.width = width + "px"
      getElement.style.height = height + "px"
      getElement.style.position = "absolute"
      getElement.style.left = left
      getElement.style.top = top

      getElement.addEventListener("click", function () {
        buttonHandler(getElement)
        event.stopPropagation() // Prevent further propagation
      })

      getElement.classList.add(getData.tag) // Assign the "tag" class
      getContainer.appendChild(getElement)
    }
  }
}

// Function to enable the clickable area children
function enableClickableAreaLook () {
  const clickableAreaParent = document.getElementById(String(currentMap.mapId) +
    String(currentMap.currentBlock) + String(currentMap.facing) + "look")
  clickableAreaParent.classList.remove("disabled") // Used for button detection
  clickableAreaParent.classList.add("enabled") // Used for button detection
  // Check if the parent element exists
  if (clickableAreaParent) {
    // Iterate through the children and enable them
    const children =
      clickableAreaParent.querySelectorAll(".clickable-area-look")
    children.forEach(function (child) {
      child.classList.remove("disabled")
      child.classList.add("enabled")
    })
  }
}

// Function to disable the clickable area
function disableClickableAreaLook () {
  const clickableAreaParent = document.getElementById(String(currentMap.mapId) +
    String(currentMap.currentBlock) + String(currentMap.facing) + "look")
  // const clickableAreaParent = document.getElementById(areaId + 'look');
  clickableAreaParent.classList.remove("enabled") // Used for button detection
  clickableAreaParent.classList.add("disabled") // Used for button detection
  // Check if the parent element exists
  if (clickableAreaParent) {
    // Iterate through the children and enable them
    const children =
      clickableAreaParent.querySelectorAll(".clickable-area-look")

    children.forEach(function (child) {
      child.classList.remove("enabled")
      child.classList.add("disabled")
    })
  }
}

// Function to enable the clickable area children
function enableClickableAreaTalk () {
  const clickableAreaParent = document.getElementById(String(currentMap.mapId) +
    String(currentMap.currentBlock) + String(currentMap.facing) + "talk")

  clickableAreaParent.classList.remove("disabled") // Used for button detection
  clickableAreaParent.classList.add("enabled") // Used for button detection
  // Check if the parent element exists
  if (clickableAreaParent) {
    // Iterate through the children and enable them
    const children =
      clickableAreaParent.querySelectorAll(".clickable-area-talk")

    children.forEach(function (child) {
      child.classList.remove("disabled")
      child.classList.add("enabled")
    })
  }
}

// Function to disable the clickable area
function disableClickableAreaTalk () {
  const clickableAreaParent = document.getElementById(String(currentMap.mapId) +
    String(currentMap.currentBlock) + String(currentMap.facing) + "talk")
  clickableAreaParent.classList.remove("enabled") // Used for button detection
  clickableAreaParent.classList.add("disabled") // Used for button detection
  // Check if the parent element exists
  if (clickableAreaParent) {
    // Iterate through the children and enable them
    const children =
      clickableAreaParent.querySelectorAll(".clickable-area-talk")

    children.forEach(function (child) {
      child.classList.remove("enabled")
      child.classList.add("disabled")
    })
  }
}

// Function to enable the clickable area children
function enableClickableAreaGet () {
  const clickableAreaParent = document.getElementById(String(currentMap.mapId) +
    String(currentMap.currentBlock) + String(currentMap.facing) + "get")
  clickableAreaParent.classList.remove("disabled") // Used for button detection
  clickableAreaParent.classList.add("enabled") // Used for button detection
  // Check if the parent element exists
  if (clickableAreaParent) {
    // Iterate through the children and enable them
    const children = clickableAreaParent.querySelectorAll(".clickable-area-get")
    children.forEach(function (child) {
      child.classList.remove("disabled")
      child.classList.add("enabled")
    })
  }
}

// Function to disable the clickable area
function disableClickableAreaGet () {
  const clickableAreaParent = document.getElementById(String(currentMap.mapId) +
    String(currentMap.currentBlock) + String(currentMap.facing) + "get")
  // const clickableAreaParent = document.getElementById(areaId + 'get');
  clickableAreaParent.classList.remove("enabled") // Used for button detection
  clickableAreaParent.classList.add("disabled") // Used for button detection
  // Check if the parent element exists
  if (clickableAreaParent) {
    // Iterate through the children and enable them
    const children = clickableAreaParent.querySelectorAll(".clickable-area-get")

    children.forEach(function (child) {
      child.classList.remove("enabled")
      child.classList.add("disabled")
    })
  }
}
