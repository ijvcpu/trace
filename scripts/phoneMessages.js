// Scripts associated with the handling of the phone Messages app
let textMessageHopper = [] // Used to hold prepared text messages
// Holds cartridges whose event has been called but have not yet been printed
let textMessageCartridgeHopper = []
// Used to latch the start of a new text cartridge print event
let textMessagePrintStartFlag = false
// A map for holding textMessageHistory objects
const textMessageHistoryMap = new Map()

// A class used to create message objects for display
class TextMessage {
  constructor () {
    this.text = "" // The actual text content of the text message
    this.inOrOut = "" // Whether this is an incoming or outgoing message
    this.textMessageCount = "" // The current total number of texts printed
    this.path = "" // The current path the player has selected
    this.tag = "" // Tags associated with the message that call functions
    this.tagInfo = "" // Tag details such as image filenames or event codes
    this.read = false // Whether or not the text message has been printed before
    this.contact = "" // Who the text message cartridge is associated with
  }
}

// Calls helper functions to run the messages "app"
function phoneMessagesMain (nextView, character) {
  // When being called from the phone home screen
  if (nextView == "Conversations") {
    phoneView.setphoneView("Conversations") // Set the new current view
    phoneHeaderFooter("Conversations")
    // Prepares to move the phone over
    const phoneViewScreen = document.getElementById("phoneViewScreen")
    // Shifts phone layer back to show text message objects on higher layer
    phoneViewScreen.style.zIndex = "1"
    // Shifts phone image right to make room for new image
    phoneViewScreen.classList.remove("shiftCenter")
    phoneViewScreen.classList.add("shiftRight")
    const backgroundElement =
      document.getElementById("phoneMessagesBackgroundJack")
    phoneMessagesConversationsView() // Populates conversations scrollable container
    const conversations =
      document.getElementById("scrollableContainer_conversations")
    setTimeout(() => { // Pauses to wait for the phone image to shift right
      backgroundElement.classList.add("animate")
    }, 1000)
    setTimeout(() => { // Pauses to wait for the phone image to shift right
      // Allows for a fade in effect to conversations screen
      conversations.classList.remove("fadeOut")
      conversations.classList.add("fadeIn")
      conversations.style.zIndex = 5
      conversations.style.pointerEvents = "auto"
    }, 2100)
  }
  // The text messages screen in the messages app
  if (nextView == "TextMessages") {
    phoneView.setphoneView("TextMessages") // Set the new current view
    const conversations =
      document.getElementById("scrollableContainer_conversations")
      // Deletes the conversations view element
    document.body.removeChild(conversations)
    // Calls text messages screen for character on conversation element click
    generateTextMessagesScreen(character)
  }
}

// Generates the scrollable element as well as text message objects
function generateTextMessagesScreen (character) {
  // Changes the header to the current character name
  phoneHeaderFooter(character)
  // Generates the scrollable container, scrolls to bottom
  generateScrollableContainer("textMessages", true)
  // Fade in the scrollable container
  const container = document.getElementById("scrollableContainer_textMessages")
  let thisTextMessageCartridge
  container.classList.remove("fadeOut")
  container.classList.add("fadeIn")
  // If there is an unprinted cartridge in the cartridge hopper,
  // it will be parsed and printed
  // For now, the script assumes that there will only ever be one
  // unread cartridge from any given character at any one time
  if (textMessageCartridgeHopper.length != 0) {
    let thisTextMessageCartridgeSplit
    // Checks the hopper for a cartridge from the specified character
    for (let i = 0; i < textMessageCartridgeHopper.length; i++) {
      // Splits the name of the cartridge to find the character
      thisTextMessageCartridgeSplit = textMessageCartridgeHopper[i].split(".")
      if (thisTextMessageCartridgeSplit[0] == character) {
        thisTextMessageCartridge = textMessageCartridgeHopper[i]
      } else {
        console.log("Error: unread message not found from character: " +
        character)
      }
    }
    // The text hopper is now populated with the current cartridge
    textMessageHopper = generateTextMessageCartridge(thisTextMessageCartridge)
    // Called once here, then from the text button from here on out
    phoneMessagesPathHandler()
  } else {
    // Otherwise, just print the text history as-is
    phoneMessagesPrintHandler(character)
  }
}

// Generates cartridges and passes text message objects to history
function generateTextMessageCartridge (cartridge) {
  // Prepares an empty list, or "hopper", to store upcoming text message objects
  textMessageHopper.length = 0
  // Begin by parsing each message into a text element
  for (let i = 0; i < textMessageCartridgeList[cartridge].length; i++) {
    // Pulls the i-th line and splits it
    const currentTextCartridge =
      textMessageCartridgeList[cartridge][i].split("_")
      // Prepares a new text message element to populate and return
    const currentText = new TextMessage()
    // Base case
    currentText.contact = currentTextCartridge[0]
    currentText.inOrOut = currentTextCartridge[1]
    currentText.textMessageCount = currentTextCartridge[2]
    currentText.path = currentTextCartridge[3]
    currentText.tag = currentTextCartridge[4]
    currentText.tagInfo = currentTextCartridge[5]
    currentText.text = currentTextCartridge[6]
    textMessageHopper.push(currentText)
  }

  if (textMessageCartridgeHopper[cartridge]) {
    // Remove the cartridge from the cartridge hopper since it has been parsed
    delete (textMessageCartridgeHopper[cartridge])
  }

  return textMessageHopper
}

// This function is called only when there are unread messages,
// populated as an array of potential paths in the text hopper
// This function is called iteratively by the
// phoneMessagesPrintHandler, once for each message
function phoneMessagesPathHandler () {
  // Pops the first element of textMessageHopper and returns it as nextText
  let nextText = textMessageHopper.shift()

  // If the textNumber is 0, this is a new cartridge, so add to history
  if (nextText.textMessageCount == 0) {
    // Stores this text in history
    phoneMessagesHistoryHandler(nextText, "store")

  // Otherwise, print each text message in order and
  // confirm it matches with the chosen path, if any
  } else {
  // Check the path value of the last message added to history
  // Returns the last text message in history
    const lastText = phoneMessagesHistoryHandler(nextText, "readLast")
    // Store the chosen path and count of the last message sent or received
    const textMessageCountCheck = lastText.textMessageCount
    const pathCheck = lastText.path
    const targettextMessageCount = parseInt(textMessageCountCheck) + 1
    const targetPath = pathCheck
    // Check the first element first,
    // this will most often be the correct next text
    if (nextText.textMessageCount == targettextMessageCount &&
      nextText.path == targetPath) {
      // Stores this text in history
      phoneMessagesHistoryHandler(nextText, "store")
    } else {
    // Otherwise, step through the text hopper looking for
    // the text that matches the current text count and path number
    // Note that this discards the prior shifted (popped) nextText object,
    // as it was not on the chosen path, as well as all other text message
    // objects along the way that are not the target object
      for (let i = 0; i < textMessageHopper.length; i++) {
        // Pops the first element of textMessageHopper and returns it
        nextText = textMessageHopper.shift()
        if (nextText.textMessageCount ==
          targettextMessageCount && nextText.path == targetPath) {
          // Stores this text in history
          phoneMessagesHistoryHandler(nextText, "store")
        }
      }
      if (textMessageHopper.length == 0) {
        textMessagePrintStartFlag = false
        // TODO: Make back button reappear here
      }
    }
  }
}

// Acts as a handler for history values, stores and holds them for retrieval
// parameters (textObject, action), action = 'store, readLast, readAll'
// on (textObject, store), the function checks if there is an array
// tagged for a given character history arrays are stored as key-value
// map pairs,with the key as the contact name and the value as the history array
function phoneMessagesHistoryHandler (textObject, action) {
  // Store a new text message object in a history array for the given character
  const thisCharacter = textObject.contact
  let thisHistoryArray = []
  if (action == "store") {
    // Check if the text history map already has an entry for this character
    if (textMessageHistoryMap.has(thisCharacter)) {
      thisHistoryArray = textMessageHistoryMap.get(thisCharacter)
    } else {
      // Register the new array in the text history map
      textMessageHistoryMap.set(thisCharacter, thisHistoryArray)
    }
    // Stores the textObject as the last element of the current history array
    thisHistoryArray.push(textObject)
    // Calls the print handler to print the text to the scrollable div
    phoneMessagesPrintHandler(thisCharacter)
  }
  // Returns the last message in a given text message history array
  if (action == "readLast") {
    // Check if the text history map already has an entry for this character
    if (textMessageHistoryMap.has(thisCharacter)) {
      thisHistoryArray = textMessageHistoryMap.get(thisCharacter)
      // Returns the last text object entry in the history array
      return thisHistoryArray[thisHistoryArray.length - 1]
    } else {
      // return false; // Returns false to notify no such entry exists
    }
  }
  // Returns the full text message history array for a given character
  if (action == "readAll") {
    if (textMessageHistoryMap.has(thisCharacter)) {
      thisHistoryArray = textMessageHistoryMap.get(thisCharacter)
      return thisHistoryArray // Returns the history array
    } else {
      // return false;
    }
  }
}

function phoneMessagesPrintHandler (character) {
  // Retrieves the correct text message history
  const textHistory = textMessageHistoryMap.get(character)
  const container = document.getElementById("scrollableContainer_textMessages")
  container.scrollTop = container.scrollHeight
  // Generate a text message button element for each text message
  // in the text message history, up to unread
  if (textMessagePrintStartFlag) {
    for (let i = 0; i < textHistory.length; i++) {
      // First, prints all read objects as unclickable text button objects
      if (textHistory[i].read == true) {
        const textButton = generateButton(textHistory[i].textMessageCount,
          textHistory[i].text, "text-message-button")
        if (textHistory[i].inOrOut == "in") {
          textButton.classList.add("left-button")
        } else {
          textButton.classList.add("right-button")
        }
        container.appendChild(textButton)
        container.scrollTop = container.scrollHeight
      // Now all read texts have been printed, and will not be printed twice,
      // and the textMessagePrintStartFlag latches
      }
    }
    // Prevents printing read messages - will reset when text cartridge is empty
    textMessagePrintStartFlag = true
  }

  for (let i = 0; i < textHistory.length; i++) {
    // When encountering the first unread message outgoing,
    // prints it and then waits to continue
    if (textHistory[i].read == false) {
      // Mark the message as read, since it has now been printed
      textHistory[i].read = true
      const textButton = generateButton(textHistory[i].textMessageCount,
        textHistory[i].text, "text-message-button")
      // For incoming messages, keep printing until an outgoing or choice flag
      if (textHistory[i].inOrOut == "in" && textHistory[i].tag != "choice") {
        textButton.classList.add("left-button")
        container.appendChild(textButton) // Display the actual text message
        container.scrollTop = container.scrollHeight // Scroll the view
        // Calls the path handler to print the next message and continue
        phoneMessagesPathHandler()

      // For an incoming message that flags a choice,
      // the next outgoing message button should start the choice menu
      } else if (textHistory[i].inOrOut == "in" && textHistory[i].tag ==
        "choice") {
        // Wait on outgoing message for user to click before continuing
        textButton.classList.add("right-button")
        textButton.textContent = "Click Here to Respond"
        // If the next outgoing text is a choice,
        // set the button properties to call the choice menu
        if (textHistory[i].tag == "choice") {
          textButton.setAttribute("tag", textHistory[i].tagInfo)
        }
        container.appendChild(textButton)
        container.scrollTop = container.scrollHeight
      } else if (textHistory[i].inOrOut == "out") {
        // Wait on outgoing message for user to click before continuing
        textButton.classList.add("right-button")
        textButton.textContent = "Click Here to Respond"
        textButton.setAttribute("tag", "nextText")
        container.appendChild(textButton)
        container.scrollTop = container.scrollHeight
      }
    }
  }
}

// This function receives the button click and replaces the holding text
// on the outgoing text button with the actual line
function phoneMessagesResponseHandler () {
  // Check to see which character conversation this is
  const character = textMessageHopper[0].contact
  // Retrieve the associated history array
  const thisHistory = textMessageHistoryMap.get(character)
  const thisTextObject = thisHistory[thisHistory.length - 1]
  const thisResponse = thisTextObject.text
  const thistextMessageCount = thisTextObject.textMessageCount
  const thisButton = document.getElementById("button_" + thistextMessageCount)
  thisButton.textContent = thisResponse
  const container = document.getElementById("scrollableContainer_textMessages")
  container.scrollTop = container.scrollHeight
}

// Outer menu screen that shows all conversations delineated by sender
function phoneMessagesConversationsView () {
  // Move phone screen header footer as well

  generateScrollableContainer("conversations", false)
  const container = document.getElementById("scrollableContainer_conversations")
  const contactElement =
    generateConversationsContact("phone_icons_messenger_chara",
      "Jack", "latest message")
  contactElement.addEventListener("click", function () {
    buttonHandler(contactElement)
    event.stopPropagation() // Prevent further click propagation
  })
  // Add the contact element to the scrollable container
  container.appendChild(contactElement)
  // TODO: get this data from the relevant cartridge and history
}

// Generates and returns a contact entry for a character in conversations view
function generateConversationsContact (icon, topText, bottomText) {
  const clickableDiv = document.createElement("div")
  clickableDiv.classList.add("clickable-div")
  // Sets the contact element tag as character name
  clickableDiv.setAttribute("tag", "conversations" + "_" + topText)

  // Creates the icon element
  const conversationsIcon = document.createElement("img")
  conversationsIcon.classList.add("icon")
  conversationsIcon.src = "./gui/" + icon + ".png"
  conversationsIcon.alt = "Icon"

  // Creates the text container
  const textContainer = document.createElement("div")
  textContainer.classList.add("text-container")

  // Creates the top text element
  const textTop = document.createElement("div")
  textTop.classList.add("text-top")
  textTop.textContent = topText

  // Creates the bottom text element
  const textBottom = document.createElement("div")
  textBottom.classList.add("text-bottom")
  textBottom.textContent = bottomText

  // Appends child elements to the clickable div
  textContainer.appendChild(textTop)
  textContainer.appendChild(textBottom)
  clickableDiv.appendChild(conversationsIcon)
  clickableDiv.appendChild(textContainer)

  return clickableDiv // Returns to contact element
}
