// button.js - Scripting associated with button generation and usage


// A list to store all containers by id string for later reference or removal
const containerListHandler = (function () {

  const containerList = []
  const clickableAreaList = []

  function pushToContainerList (container) {
    containerList.push(container)
  }

  function pushToClickableAreaList (clickableArea) {
    clickableAreaList.push(clickableArea)
  }
  
  function getContainerListLength() {
    return containerList.length
  }

  function getClickableAreaListLength() {
    return clickableAreaList.length
  }

  function getContainerAtIndex(index) {
    const container = document.getElementById(containerList[i])
    return container
  }

  function getClickableAreaAtIndex(index) {
    const container = document.getElementById(clickableAreaList[i])
    return container
  }

  function deleteContainerAtIndex(index) {
    const container = document.getElementById(containerList[i])
    container.remove()
  }

  function deleteClickableAreaAtIndex(index) {
    const container = document.getElementById(clickableArea[i])
    container.remove()
  }

  function deleteAllContainers(){
    for (let i = 0; i < containerList.length; i++) {
      const container = document.getElementById(containerList[i])
      if (container) {
        // Removes the container and all its child elements, including buttons
        container.remove()
      }
    }
  }
  function deleteAllClickableAreas(){
    for (let i = 0; i < clickableAreaList.length; i++) {
      const container = document.getElementById(clickableAreaList[i])
      if (container) {
        // Removes the container and all its child elements, including buttons
        container.remove()
      }
    }
  }

  // Makes functions available in the global scope
  return {
    pushToContainerList,
    pushToClickableAreaList,
    getContainerListLength,
    getClickableAreaListLength,
    getContainerAtIndex,
    getClickableAreaAtIndex,
    deleteContainerAtIndex,
    deleteClickableAreaAtIndex,
    deleteAllContainers,
    deleteAllClickableAreas
  }
})()

// A bookmark used to store a map location to return to when jumping to dialogue
let mapLocationBookmark

const tagList = {
  // Eye riddle wrong
  a10: function () {
    // Code to handle choice tag "a1"
    screenJump(69) // Jumps to the specified scene in the dialogue array
  },
  // Eye riddle correct
  a11: function () {
    // Code to handle tag "a2"
    screenJump(74)
  },
  a3: function () {
    // Code to handle tag "a3"
    screenHandler.lowerPauseFlag // Lower the pause flag to resume normal on-click response
  },
  // Text message choice tag
  "Jack.c1": function () {
    const theseChoices = ["Just say where_choice0",
      "Is something wrong?_choice1"]
    phoneMessagesResponseHandler() // Replaces the outgoing text
    generateChoices(2, "vertical", theseChoices)
  },
  // Handles the first choice of a text message conversation
  choice0: function () {
    // Code to handle tag "a3"
    hideButton("choice-button") // Hides choice buttons
    // Pops the first element of textMessageHopper and returns it as nextText
    let nextText = textMessageHopper.shift()
    // Stores text message path "0", as it was just chosen
    phoneMessagesHistoryHandler(nextText, "store")
    phoneMessagesResponseHandler() // Replaces the outgoing text
    phoneMessagesPathHandler() // Calls the next message
  },
  choice1: function () {
    // Code to handle tag "a3"
    hideButton("choice-button") // Hides choice buttons
    textMessageHopper.shift()
    // Pops the first element of textMessageHopper and returns it as nextText
    let nextText = textMessageHopper.shift()
    // Stores text message path "0", as it was just chosen
    phoneMessagesHistoryHandler(nextText, "store")
    phoneMessagesResponseHandler() // Replaces the outgoing text
    phoneMessagesPathHandler() // Calls the next message
  },
  // Map movement
  n: function () {
    // Code to handle tag "a1"
    if (animationHandler.getAnimatingFlag()) {
      // If the animation is already in progress, do nothing.
      return

    } else {
      currentMap.mapMove("n")
    }
    
  },
  e: function () {
    // Code to handle tag "a1"
    if (animationHandler.getAnimatingFlag()) {
      // If the animation is already in progress, do nothing.
      return

    } else {
      currentMap.mapMove("e")
    }
  },
  w: function () {
    // Code to handle tag "a1"
    if (animationHandler.getAnimatingFlag()) {
      // If the animation is already in progress, do nothing.
      return
      
    } else {
      currentMap.mapMove("w")
    }
  },
  s: function () {
    // Code to handle tag "a1"
    if (animationHandler.getAnimatingFlag()) {
      // If the animation is already in progress, do nothing.
      return
      
    } else {
      currentMap.mapMove("s")
    }
  },
  map0: function () {
    mapView(0)
  },
  // Look at News
  look_02n: function () {
    // Store the current map location to return to after the jump
    mapLocationBookmark = String(currentMap.mapId) + "_" +
      String(currentMap.currentBlock) + "_" + String(currentMap.facing)
    screenJump(119) // Some scene jump
  },
  // Talk to News
  talk_02n: function () {
    mapLocationBookmark = String(currentMap.mapId) + "_" +
      String(currentMap.currentBlock) + "_" + String(currentMap.facing)
    // Base case - first interaction

    let talkCheck = repeatInteractionHandler.getRepeat("talk02n")
    let talkCheck2 = repeatInteractionHandler.getRepeat("talk02n2")
    let gragulonCheck = repeatInteractionHandler.getRepeat("look01s")
    if (!talkCheck) {
      repeatInteractionHandler.setRepeat("talk02n")
      screenJump(14) // Some scene jump
    // If both this talk and met gragulon
    } else if (talkCheck && gragulonCheck) {
      repeatInteractionHandler.setRepeat("talk02n2")
      screenJump(104)

    // If this talk but not yet met gragulon
    } else if (talkCheck && !gragulonCheck) {
      screenJump(100)

    // All interactions completed
    } else if (talkcheck2) {
      screenJump(119)
    }
  },
  // Look at Eye
  look_03n: function () {
    // Store the current map location to return to after the jump
    mapLocationBookmark = String(currentMap.mapId) + "_" +
      String(currentMap.currentBlock) + "_" + String(currentMap.facing)
    screenJump(117) // Some scene jump
  },

  // Talk to eye
  talk_03n: function () {
    mapLocationBookmark = String(currentMap.mapId) + "_" +
      String(currentMap.currentBlock) + "_" + String(currentMap.facing)
    // Base case, first interaction
    // Check to see if first interaction
    let talkCheck = repeatInteractionHandler.getRepeat("talk03n")
    // Check for news interaction
    let newsCheck = repeatInteractionHandler.getRepeat("talk02n")
    // If not yet talked and talked to news
    if (!talkCheck && newsCheck) {
      repeatInteractionHandler.setRepeat("talk03n") // Set to true
      screenJump(50) // Jump to first interaction
    // Already spoke once before
    } else if (talkCheck && newsCheck) {
      screenJump(115)
    } else {
      screenJump(117)
    }
  },

  // Look skul'gragulon
  look_01s: function () {
    // Store the current map location to return to after the jump
    mapLocationBookmark = String(currentMap.mapId) + "_" +
      String(currentMap.currentBlock) + "_" + String(currentMap.facing)
    // Base case - first interaction, no second interaction to handle
    let lookCheck = repeatInteractionHandler.getRepeat("look01s")
    if (!lookCheck) {
      repeatInteractionHandler.setRepeat("look01s") // Set to true
      screenJump(86) // Some scene jump
    }
  },

  // Calls the phone screen from the phone button at bottom left
  phone: function () {
    // Store the current map location to return to after the jump
    mapLocationBookmark = String(currentMap.mapId) + "_" +
      String(currentMap.currentBlock) + "_" + String(currentMap.facing)
    phoneModeShow() // Some scene jump
  },

  // Calls tagged phone screen based on home icon etc.
  Messages: function () {
    phoneViewHandler("Conversations", "")
  },
  Calendar: function () {
    phoneViewHandler("Calendar", "")
  },
  Photos: function () {
    phoneViewHandler("Photos", "")
  },
  Instantgram: function () {
    phoneViewHandler("Instantgram", "")
  },
  GlitchTv: function () {
    phoneViewHandler("GlitchTv", "")
  },
  Settings: function () {
    phoneViewHandler("Settings", "")
  },
  back: function () {
    phoneBackButton() // Calls the back button function in phone mode
  },
  // Calls the corresponding phone text message history based on tag
  conversations_Jack: function () {
    phoneMessagesMain("TextMessages", "Jack") // Jump to phone texts screen
  },
  // Button element of a text message object - progress the text message screen
  nextText: function () {
    phoneMessagesResponseHandler() // Replaces the outgoing text
    phoneMessagesPathHandler() // Calls the next message
  },
  // Toggle button for enabling the look view and look cursor
  look: function () {
    const clickableArea = document.getElementById(String(currentMap.mapId) +
      String(currentMap.currentBlock) + String(currentMap.facing) + "look")
    const currentButton = document.getElementById("button_look")
    document.body.style.cursor = "auto"
    if (clickableArea.classList.contains("enabled")) {
      // If clickable area is enabled, disable it
      disableClickableAreaLook(clickableArea)
      // Changes the button graphic to inactive
      currentButton.classList.remove("lookActive")
    } else {
      // First, check to see if the talk view is enabled, and if so, disable it
      const talkArea = document.getElementById(String(currentMap.mapId) +
        String(currentMap.currentBlock) + String(currentMap.facing) + "talk")
      if (talkArea.classList.contains("enabled")) {
        disableClickableAreaTalk(talkArea)
        // Changes the button graphic to inactive
        talkButton.classList.remove("talkActive")
      }
      const getArea = document.getElementById(String(currentMap.mapId) +
        String(currentMap.currentBlock) + String(currentMap.facing) + "get")
      const getButton = document.getElementById("button_get")
      if (getArea.classList.contains("enabled")) {
        disableClickableAreaGet(getArea)
        // Changes the button graphic to inactive
        getButton.classList.remove("getActive")
      }
      // Then, enable the look clickable area
      enableClickableAreaLook(clickableArea)
      // Changes the button graphic to active
      currentButton.classList.add("lookActive")
      document.body.style.cursor = "url(\"./gui/map_look_cursor.png\"), auto"
    }
  },

  // Toggle button for enabling the talk view and talk cursor
  talk: function () {
    document.body.style.cursor = "auto"
    const clickableArea = document.getElementById(String(currentMap.mapId) +
      String(currentMap.currentBlock) + String(currentMap.facing) + "talk")
    const currentButton = document.getElementById("button_talk")
    if (clickableArea.classList.contains("enabled")) {
      // If clickable area is enabled, disable it
      disableClickableAreaTalk(clickableArea)
      // Changes the button graphic to inactive
      currentButton.classList.remove("talkActive")
    } else {
      // First, check to see if the look view is enabled, and if so, disable it
      const getArea = document.getElementById(String(currentMap.mapId) +
        String(currentMap.currentBlock) + String(currentMap.facing) + "get")
      const getButton = document.getElementById("button_get")
      if (getArea.classList.contains("enabled")) {
        disableClickableAreaGet(getArea)
        // Changes the button graphic to inactive
        getButton.classList.remove("getActive")
      }
      const lookArea = document.getElementById(String(currentMap.mapId) +
        String(currentMap.currentBlock) + String(currentMap.facing) + "look")
      const lookButton = document.getElementById("button_look")
      if (lookArea.classList.contains("enabled")) {
        disableClickableAreaLook(lookArea)
        // Changes the button graphic to inactive
        lookButton.classList.remove("lookActive")
      }

      // If clickable area is disabled, enable it
      enableClickableAreaTalk(clickableArea)
      // Changes the button graphic to active
      currentButton.classList.add("talkActive")
      document.body.style.cursor = "url(\"./gui/map_talk_cursor.png\"), auto"
    }
  },

  // Toggle button for enabling the look view and look cursor
  get: function () {
    document.body.style.cursor = "auto"
    const clickableArea = document.getElementById(String(currentMap.mapId) +
      String(currentMap.currentBlock) + String(currentMap.facing) + "get")
    const currentButton = document.getElementById("button_get")
    if (clickableArea.classList.contains("enabled")) {
      // If clickable area is enabled, disable it
      disableClickableAreaGet(clickableArea)
      // Changes the button graphic to inactive
      currentButton.classList.remove("getActive")
    } else {
      // First, check to see if the talk and look views are enabled: disable
      const talkArea = document.getElementById(String(currentMap.mapId) +
        String(currentMap.currentBlock) + String(currentMap.facing) + "talk")
      const talkButton = document.getElementById("button_talk")
      if (talkArea.classList.contains("enabled")) {
        disableClickableAreaTalk(talkArea)
        // Changes the button graphic to inactive
        talkButton.classList.remove("talkActive")
      }
      const lookArea = document.getElementById(String(currentMap.mapId) +
        String(currentMap.currentBlock) + String(currentMap.facing) + "look")
      const lookButton = document.getElementById("button_look")
      if (lookArea.classList.contains("enabled")) {
        disableClickableAreaLook(lookArea)
        // Changes the button graphic to inactive
        lookButton.classList.remove("lookActive")
      }
      // Then, enable the get clickable area
      enableClickableAreaGet(clickableArea)
      // Changes the button graphic to active
      currentButton.classList.add("getActive")
      document.body.style.cursor = "url(\"./gui/map_get_cursor.png\"), auto"
    }
  }

}

// Generates and returns an empty button element, numbered by  parameter
function generateButton (id, text, className) {
  const button = document.createElement("button")

  // Set the button's text and attributes
  // Assigns an id to each button up to the number specified
  button.id = "button" + "_" + id
  button.textContent = text
  button.className = className // Can be changed for different button styles
  button.classList.add("button") // Used for hiding and showing buttons
  // Use relative positioning for buttons inside the div
  button.style.position = "relative"

  // Adjust the positioning of the button
  button.style.top = "0" // Adjust the top position in pixels
  button.style.left = "0" // Adjust the left position in pixels

  // On click, the button element will be passed as an argument to
  // the button handler who can parse the response
  button.addEventListener("click", function () {
    buttonHandler(button)
    event.stopPropagation() // Prevent further propagation
  })

  return button
}

// Checks the tag of the clicked button and references
// the tag list to see what actions to perform
function buttonHandler (button) {
  const buttonTag = button.getAttribute("tag")
  const buttonTagInfo = button.getAttribute("tagInfo")

  // Check if a handler function exists for the button's tag
  if (tagList[buttonTag]) {
    // Execute the corresponding handler function
    tagList[buttonTag]()
  } else {
    console.log("Error: No handler found for tag " + buttonTag)
  }
}

// Generates 2-3 choice buttons without further alignment adjustments
function generateChoices (number, arrangement, choiceArray) {
  // clearText(); // Clears previous text element
  const container = document.createElement("div") // Create a container div
  container.id = "buttonContainer" // Assign an id to the container
  containerListHandler.pushToContainerList(container.id)
  document.body.appendChild(container) // Append the container to the body
  container.style.position = "absolute"
  container.style.top = "40%"
  container.style.left = "50%"
  container.style.transform = "translate(-50%, -50%)"
  container.style.zIndex = "5"

  if (arrangement == "vertical") {
    container.style.display = "flex"
    container.style.flexDirection = "column"
    container.style.justifyContent = "center"
    container.style.alignItems = "center"
  }

  for (let i = 0; i < number; i++) {
    const button = generateButton(i, "", "custom-button")
    button.classList.add("choice-button") // For hiding and deletion
    container.appendChild(button) // Append the button to the container

    // Set the button's text from the choiceArray if available
    if (choiceArray[i]) {
      // Splits the choice from the parsing tag
      let choiceParts = choiceArray[i].split("_")
      // Assigns the choice text to the button
      button.textContent = choiceParts[0]
      // Assigns the associated tag to the button for later parsing on click
      button.setAttribute("tag", choiceParts[1])
    }

    // The number of pixels to shift each button down based on arrangement
    let pxIncrementVertical = 100
    // The number of pixels to shift each button right based on arrangement
    let pxIncrementHorizontal = 200

    if (arrangement == "vertical") {
      // Adjust the positioning for vertical alignment
      button.style.top = (i * pxIncrementVertical) + "px"
    } else {
      // Adjust the positioning for horizontal alignment
      button.style.left = (i * pxIncrementHorizontal) + "px"
    }
  }
}

// Generates and places the movement arrows used in map view
function generateMoveArrows () {
  const container = document.createElement("div")
  container.id = "moveArrows"
  containerListHandler.pushToContainerList(container.id)
  document.body.appendChild(container)
  container.style.position = "fixed" // Set relative positioning
  container.style.top = "0"
  container.style.left = "0"

  const compass = ["n", "e", "s", "w"]
  // document.addEventListener('DOMContentLoaded', function () {

  for (let i = 0; i < 4; i++) {
    const button = generateButton(compass[i], "", "map-button-" + compass[i])
    button.style.position = "absolute"
    button.classList.add("move-arrow")
    button.classList.add("button")
    button.setAttribute("tag", compass[i])
    container.appendChild(button)
  }

  // Move buttons
  let buttonN = document.getElementById("button_n")
  let buttonE = document.getElementById("button_e")
  let buttonS = document.getElementById("button_s")
  let buttonW = document.getElementById("button_w")

  buttonN.style.top = "85vh";
  buttonN.style.left = "92vw";
  buttonE.style.top = "92vh";
  buttonE.style.left = "96vw";
  buttonS.style.top = "93vh";
  buttonS.style.left = "92vw";
  buttonW.style.top = "92vh";
  buttonW.style.left = "88vw";
  /*
  buttonN.style.top = (parseInt(buttonN.style.top) - 50) + "px"
  buttonE.style.left = (parseInt(buttonE.style.left) + 50) + "px"
  buttonS.style.top = (parseInt(buttonS.style.top) + 50) + "px"
  buttonW.style.left = (parseInt(buttonW.style.left) - 50) + "px"
  */
// });
}

// Hides the specified button and disables its clickable area
function hideButton (thisButton) {
  // thisButton: choice-button, clickable-toggle, phone-button (map view),
  // phone-home-button (home icons), phone-back-button,
  // text-message-button (actual text messages), move-arrow,
  // button (for all buttons)
  let buttons = document.querySelectorAll("." + thisButton)

  buttons.forEach((button) => {
    button.style.opacity = 0 // Remove the hidden-button class
    button.style.pointerEvents = "none"
  })
}

// Hides the specified button and disables its clickable area
function deleteButton (thisButton) {
  let buttons = document.querySelectorAll("." + thisButton)

  buttons.forEach((button) => {
    button.remove()
  })
}

// Shows the specified button and enables its clickable area
function showButton (thisButton) {
  let buttons = document.querySelectorAll("." + thisButton)

  buttons.forEach((button) => {
    button.style.opacity = 1 // Re-enable display
    button.style.pointerEvents = "auto"
    if (thisButton !== "minimap") {
      // Re-enable pointer events, except for minimap
      button.style.pointerEvents = "auto"
    }
  })
}

// Generates the interaction toggle buttons, like "look" or "talk",
// which change the cursor and allow for map interaction
function generateClickableAreaToggle () {
  const container = document.createElement("div")
  container.id = "clickableAreaToggle"
  containerListHandler.pushToContainerList(container.id)
  document.body.appendChild(container)
  container.style.position = "absolute" // Set relative positioning
  container.style.top = "90%"
  container.style.left = "55%"

  clickableAreaType = ["get", "look", "talk"]

  // Generates each button type specified in clickableAreaType
  for (let i = 0; i < clickableAreaType.length; i++) {
    const button = generateButton(clickableAreaType[i], "", "toggle-" +
      clickableAreaType[i])
    button.classList.add("clickable-toggle")
    button.classList.add("button")
    button.style.position = "absolute"
    button.setAttribute("tag", clickableAreaType[i])
    container.appendChild(button)
  }
  let buttonLook = document.getElementById("button_look")
  buttonLook.style.left = (parseInt(buttonLook.style.left) + 4.5) + "vw"
  let buttonTalk = document.getElementById("button_talk")
  buttonTalk.style.left = (parseInt(buttonTalk.style.left) + 10) + "vw"
}

// Generates and places the phone toggle button on the screen
function generatephoneToggle () {
  buttonphone = generateButton("phone", "", "phone-button")
  buttonphone.style.top = "90%"
  buttonphone.style.left = "5%"
  buttonphone.style.position = "absolute"
  buttonphone.setAttribute("tag", "phone")
  document.body.appendChild(buttonphone)
}

// Animates and changes the background of the text button when
// there is a new unread message in the text cartridge hopper
function phoneTextNotification () {
}

// Generates the invisible clickable buttons for the home screen icons
function generatephoneHomeButtons () {
  const container = document.createElement("div")
  container.id = "phoneHomeButtons"
  containerListHandler.pushToContainerList(container.id)
  document.body.appendChild(container)
  container.style.position = "absolute" // Set relative positioning
  container.style.top = "21%"
  container.style.left = "50%"

  const homeIconArray = ["Messages", "Calendar", "Photos", "Instantgram",
    "GlitchTv", "Settings"]

  for (let i = 0; i < homeIconArray.length; i++) {
    const button = generateButton(homeIconArray[i], "", "phone-home-button")
    button.style.position = "absolute"
    button.style.pointerEvents = "auto"
    button.setAttribute("tag", homeIconArray[i])

    container.appendChild(button)
  }

  // Move buttons
  const homeButton1 = document.getElementById("button_Messages")
  homeButton1.style.top = "0px"
  homeButton1.style.left = "-170px"
  const homeButton2 = document.getElementById("button_Calendar")
  homeButton2.style.top = "0px"
  homeButton2.style.left = "-21px"
  const homeButton3 = document.getElementById("button_Photos")
  homeButton3.style.top = "0x"
  homeButton3.style.left = "133px"
  const homeButton4 = document.getElementById("button_Instantgram")
  homeButton4.style.top = "140px"
  homeButton4.style.left = "-177px"
  const homeButton7 = document.getElementById("button_GlitchTv")
  homeButton7.style.top = "275px"
  homeButton7.style.left = "-165px"
  const homeButton9 = document.getElementById("button_Settings")
  homeButton9.style.top = "275px"
  homeButton9.style.left = "127px"
}
