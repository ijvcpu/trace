// dialogue.js - scripting associated with dialogue mode



const screenHandler = (function () {
  let currentScreenObject
  let screenCount = 0
  let pauseFlag = false // Master flag to pause progress on click
  let currentDialogueCartridge

  function setCurrentScreenObject () {
    let currentScreen =
      dialogueCartridgeList[currentDialogueCartridge][screenCount]
    currentScreenObject = new ScreenObject(currentScreen)
  }

  function getCurrentScreenObject (object) {
    return currentScreenObject
  }

  function incrementScreenCount(){
    screenCount = screenCount + 1
  }

  function setScreenCount(count){
    screenCount = count
  }

  function getScreenCount(){
    return screenCount
  }

  function raisePauseFlag(){
    pauseFlag = true;
  }

  function lowerPauseFlag(){
    pauseFlag = false;
  }

  function getPauseFlag(){
    return pauseFlag
  }
  
  function setDialogueCartridge(cartridge){
    currentDialogueCartridge = cartridge
  }

  function getDialogueCartridge(cartridge){
    return currentDialogueCartridge
  }

  // Makes functions available in the global scope
  return {
    setCurrentScreenObject,
    getCurrentScreenObject,
    incrementScreenCount,
    setScreenCount,
    getScreenCount,
    raisePauseFlag,
    lowerPauseFlag,
    getPauseFlag,
    setDialogueCartridge,
    getDialogueCartridge
  }
})()

// Holds the parsed screen data from each line in a single object
class ScreenObject {
  constructor (currentScreen) {
    const screenArray = currentScreen.split("_")

    this.character = screenArray[0]
    this.background = screenArray[1]
    this.location = screenArray[2]
    this.tag = screenArray[3]
    this.tagInfo = screenArray[4]
    this.characterLine = screenArray.slice(5).join("_")
  }
}

// Checks the screen object for tags and calls helper functions accordingly
function updateScreen () {
  // Prevents crash on start when screen object is still empty
  const currentScreen = screenHandler.getCurrentScreenObject()
  if (currentScreen) {
    thisTag = currentScreen.tag
    thisTagInfo = currentScreen.tagInfo

    // Checks for jumps and jumps accordingly to the specified dialogue point
    if (thisTag == "jump") {
      let thisSplit = ""
      let thisTag = ""
      let thisTagInfo = ""
      let jumpTarget = currentScreen.tagInfo
      const currentDialogueCartridge = screenHandler.getDialogueCartridge()
      // Searches for the correct dovetail tags
      for (let i = 0;
        i < dialogueCartridgeList[currentDialogueCartridge].length; i++) {
        thisSplit = dialogueCartridgeList[currentDialogueCartridge][i]
          .split("_")
        thisTag = thisSplit[3]
        thisTagInfo = thisSplit[4]
        // Each jump tagInfo is a unique int pair
        if (thisTag == "jumpTarget" && parseInt(thisTagInfo) ==
          parseInt(jumpTarget)) {
          jumpTarget = i
          break
        }
      }
      screenJump(parseInt(jumpTarget))

    // For calling text cartridges from dialogue
    } else if (thisTag == "textMessage") {
      // Get the cartridge to be called
      const thisTextMessageCartridge = currentScreen.tagInfo
      // Add the text cartridge string Id to the cartridgeHopper
      textMessageCartridgeHopper.push(thisTextMessageCartridge)
      // Call the notification function to notify a new unread message
      phoneTextNotification()
      displayBackground(currentScreen.background)
      clearText()
      // Pauses to wait for the background to update
      setTimeout(() => {
        updateText()
      }, 800)
    } else if (thisTag == "choice") { // First check for special tags
      // Raise the pause flag so that clicks no longer progress the screens
      screenHandler.raisePauseFlag()
      let thisChoiceText // To hold the choice options to be printed on screen
      if (choiceCartridgeList[thisTagInfo]) {
        thisChoiceText = choiceCartridgeList[thisTagInfo]()
      }
      generateChoices(3, "vertical", thisChoiceText)
      updateText()
      // Set the new background image
      displayBackground(currentScreen.background)
    } else if (thisTag == "map0") {
      screenHandler.raisePauseFlag()
      clearText()
      mapView()
    } else if (thisTag == "mapReturn") {
      screenHandler.raisePauseFlag()
      clearText()
      mapReturn(mapLocationBookmark)
    } else {
      displayBackground(currentScreen.background)
      clearText()
      // Pauses to wait for the background to update
      setTimeout(() => {
        updateText()
      }, 800)
    }
  }
}

// Calls helper functions to assign new text attributes
function updateText () {
  const currentScreen = screenHandler.getCurrentScreenObject()
  wordWrap(currentScreen.characterLine, 18) // Call the next text
  updateTextClass()
  updateTextPosition()
}

// Resets the text classes and assigns correct ones for next slide
function updateTextClass () {
  const currentScreen = screenHandler.getCurrentScreenObject()
  let textElement = document.getElementById("currentText")
  textElement.classList.remove(...textElement.classList)
  textElement.classList.add(currentScreen.character)
  textElement.classList.add(currentScreen.location)
  textElement.classList.add("small") // TODO allow for font resizing
}

// Updates the position of the text based on dialogue specifications
function updateTextPosition () {
  let textElement = document.getElementById("currentText")
  if (textElement.classList.contains("left")) {
    textElement.setAttribute("y", 500)
    for (let i = 0; i < 10; i++) { // For each tspan line
      let thisLine = document.getElementById("tspan" + i)
      thisLine.setAttribute("x", 400)
    }
  } else if (textElement.classList.contains("bottomLeft")) {
    textElement.setAttribute("y", 900)
    for (let i = 0; i < 10; i++) { // For each tspan line
      let thisLine = document.getElementById("tspan" + i)
      thisLine.setAttribute("x", 400)
    }
  } else if (textElement.classList.contains("topLeft")) {
    textElement.setAttribute("y", 200)
    for (let i = 0; i < 10; i++) { // For each tspan line
      let thisLine = document.getElementById("tspan" + i)
      thisLine.setAttribute("x", 400)
    }
  } else if (textElement.classList.contains("right")) {
    textElement.setAttribute("y", 500)
    for (let i = 0; i < 10; i++) { // For each tspan line
      let thisLine = document.getElementById("tspan" + i)
      thisLine.setAttribute("x", 1500)
    }
  } else if (textElement.classList.contains("bottomRight")) {
    textElement.setAttribute("y", 900)
    for (let i = 0; i < 10; i++) { // For each tspan line
      let thisLine = document.getElementById("tspan" + i)
      thisLine.setAttribute("x", 1500)
    }
  } else if (textElement.classList.contains("topRight")) {
    textElement.setAttribute("y", 200)
    for (let i = 0; i < 10; i++) { // For each tspan line
      let thisLine = document.getElementById("tspan" + i)
      thisLine.setAttribute("x", 1500)
    }
  }
}

// Function to change the text of a <tspan> element, also handles italics
function editTextLine (tspanId, newText) {
  let tspanElement = document.getElementById(tspanId)
  if (tspanElement) {
    // Clear the existing content
    tspanElement.textContent = ""
    const textParts = newText.split(" ")
    textParts.forEach((part, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg",
        "tspan")
      tspan.textContent = part
      if (part == "<i") {
        tspan.setAttribute("class", "italic")
        // Get the next part (assuming it's not split between two parts)
        tspan.textContent = textParts[index + 1]
        // Remove the next part
        textParts.splice(index + 1, 1)
      }
      tspanElement.appendChild(tspan)
      if (index < textParts.length - 1) {
        // Add a space between words
        tspanElement.appendChild(document.createTextNode(" "))
      }
    })
  } else {
    console.error("Element with ID " + tspanId + " not found.")
  }
}

// Clears all text in the main SVG text box
function clearText () {
  // Clear the previous text entry
  for (let i = 0; i < 10; i++) {
    let thisLine = document.getElementById("tspan" + i)
    thisLine.textContent = ""
  }
}

// Allows for word wrap in SVG text elements based on lineWidth in characters
function wordWrap (text, lineWidth) {
  let wordArray = text.split(" ")
  let characterCount = 0
  let currentLine = 0
  let currentSubstring = ""
  let newLine = true
  // Clears the previous SVG text entry
  clearText()

  for (let i = 0; i < wordArray.length; i++) {
    if (newLine) {
      currentSubstring = wordArray[i]
      newLine = false
    } else {
      currentSubstring += " " + wordArray[i]
    }

    characterCount += wordArray[i].length

    if (characterCount >= lineWidth || i == wordArray.length - 1) {
      let tspanLine = "tspan" + currentLine
      editTextLine(tspanLine, currentSubstring)
      currentLine++
      characterCount = 0
      newLine = true
    }
  }
}

// Handles interactions past the first for look, talk, or get as needed
// TODO: convert to map
const repeatInteractionHandler = (function () {
  let talk02n = false // News
  let talk02n2 = false // After News quest
  let talk03n = false // Eye
  let look01s = false // Gragulon

  // Allows outside functions to set the current phone view
  function setRepeat (view) {
    if (view == "talk03n") {
      talk03n = true
    }
    if (view == "talk02n") {
      talk02n = true
    }
    if (view == "talk02n2") {
      talk02n2 = true
    }
    if (view == "look01s") {
      look01s = true
    }
  }

  // Allows outside functions to get the current phone view
  function getRepeat (view) {
    if (view == "talk03n") {
      return talk03n
    };
    if (view == "talk02n") {
      return talk02n
    }
    if (view == "talk02n2") {
      return talk02n2
    }
    if (view == "look01s") {
      return look01s
    }
  }

  // Makes both functions available in the global scope
  return {
    setRepeat,
    getRepeat
  }
})()

// Jumps to the specified point in the dialogue array
function screenJump (scene) {
  containerListHandler.deleteAllClickableAreas()
  hideButton("button") // Hides all buttons
  document.body.style.cursor = "auto" // Reset the cursor
  // Toggle the look and talk buttons to off for the return to the map screen
  lookButton = document.getElementById("button_look")
  // Changes the button graphic to inactive
  lookButton.classList.remove("lookActive")
  talkButton = document.getElementById("button_talk")
  talkButton.classList.remove("talkActive")
  lookButton = document.getElementById("button_get")
  lookButton.classList.remove("getActive")
  screenHandler.setScreenCount(scene)
  screenHandler.lowerPauseFlag() // Lower the pause flag to resume normal on-click response
  // cursor

  screenRefresh()
}
