// Scripts to handle the display and usage of the in-game cellphone and menus

// Encapsulated (modularized) storage of the current phone view
const phoneView = (function () {
  // Views: 'Home', 'TextMessages', 'Calendar', 'Photos',
  // 'Instantgram', 'GlitchTv', 'Settings', 'Conversations'
  let phoneCurrentView = ""

  // Allows outside functions to set the current phone view
  function setphoneView (view) {
    phoneCurrentView = view
  }

  // Allows outside functions to get the current phone view
  function getphoneView () {
    return phoneCurrentView
  }

  // Makes both functions available in the global scope
  return {
    setphoneView,
    getphoneView
  }
})()

// Handles the transitions between views within phone mode
function phoneViewHandler(nextView, character) {
const currentView = phoneView.getphoneView() // Check the current view
if (currentView == "Home"){
  // Returns to map mode
  if (nextView == "Map"){
    phoneView.setphoneView("Map")
    phoneModeHide();
  } else if (nextView == "Conversations"){
    hideButton("homeTextElement")
    hideButton("phone-home-button")
    const imageElement3 = document.getElementById("phoneHomeIcons") // home icons
    const header = document.getElementById("phoneHeaderFooter")
    imageElement3.style.zIndex = -1;
    header.style.zIndex = -1;
    phoneView.setphoneView("Conversations")
    phoneMessagesMain("Conversations", character)
  }

} else if (currentView == "Conversations"){
  if (nextView == "Home"){
    phoneView.setphoneView("Home")
    const phoneViewScreen = document.getElementById("phoneViewScreen")
    const backgroundElement =
      document.getElementById("phoneMessagesBackgroundJack")
    const conversations =
      document.getElementById("scrollableContainer_conversations")
    const imageElement3 = document.getElementById("phoneHomeIcons") // home icons
    const homeText = document.getElementById("homeTextContainer") // home text
    const header = document.getElementById("phoneHeaderFooter")
    phoneView.setphoneView("Home")
    header.style.zIndex = -1;
    phoneViewScreen.classList.remove("shiftRight")
    phoneViewScreen.classList.add("shiftCenter")
    conversations.classList.remove("fadeIn")
    conversations.classList.add("fadeOut")
    conversations.style.pointerEvents = "none"
    setTimeout(() => { 
      backgroundElement.classList.remove("animate")
    }, 1000)
    //setTimeout(() => {
    //  
    //}, 2100)
    setTimeout(() => { 
      showButton("homeTextElement")
      showButton("phone-home-button")
      imageElement3.style.zIndex = 3;
      homeText.style.zIndex = 3;
      imageElement3.style.pointerEvents = "none";
      homeText.style.pointerEvents = "none";
      phoneHeaderFooter("Hyperdimensional Cellular")
    }, 1000)
    
  } else if (nextView == "TextMessages"){
    phoneView.setphoneView("TextMessages")
    phoneMessagesMain("TextMessages", character)
  }

} else if (currentView == "TextMessages"){
  if (nextView == "Conversations"){
    const container = document.getElementById("scrollableContainer_textMessages")
    phoneView.setphoneView("Conversations")
    container.classList.remove("fadeIn")
    container.classList.add("fadeOut")
    phoneMessagesMain("Conversations", character)
  }
}
}
// Begins the animated transition to phone mode from map mode
function phoneModeShow () {
  screenHandler.raisePauseFlag()
  mapLocationBookmark = String(currentMap.mapId) + "_" +
    String(currentMap.currentBlock) + "_" + String(currentMap.facing)
  hideButton("move-arrow") // Clear any other onscreen buttons
  hideButton("clickable-toggle") // Clear any other onscreen buttons
  hideButton("minimap") // Clear any other onscreen buttons
  hideButton("minimapArrow") // Clear any other onscreen buttons
  hideButton("phone-button") // Clear any other onscreen buttons
  phoneView.setphoneView("Home") // Set the current view to the home view
  const imageElement = document.getElementById("phoneBackground") // background
  const imageElement2 = document.getElementById("phoneViewScreen") // phone
  const imageElement3 = document.getElementById("phoneHomeIcons") // home icons
  imageElement.style.opacity = 1
  imageElement2.style.opacity = 1
  imageElement3.style.opacity = 1

  if (imageElement) {
    imageElement.classList.add("animate")

    // After a delay, start the animation of the second element
    setTimeout(() => {
      imageElement2.classList.add("animate")

      // After another delay, start the animation of the third element
      setTimeout(() => {
        imageElement3.classList.add("fadeInIcons")
        // Check if home text already exists before generating
        const homeTextCheck = document.getElementById("homeTextContainer")
        if (homeTextCheck) {
          showButton("homeText")
          homeTextCheck.style.pointerEvents = "none"
        } else {
          generateHomeText()
        }
        // Check if the (invisible) home buttons have been created
        const homeButtonsCheck = document.getElementById("phoneHomeButtons")
        if (homeButtonsCheck) {
          showButton("phone-home-button")
        } else {
          generatephoneHomeButtons()
        }
        phoneHeaderFooter("Hyperdimensional Cellular")

        // Change the background images of the body
        document.body.style.backgroundImage = imageElement, imageElement2, imageElement3
      }, 1000)
    }, 1000)
  }
}

function phoneModeHide () {
  const imageElement = document.getElementById("phoneBackground") // background
  const imageElement2 = document.getElementById("phoneViewScreen") // phone
  const imageElement3 = document.getElementById("phoneHomeIcons") // home icons
  const homeText = document.getElementById("homeTextContainer") // home text
  const headerFooter = document.getElementById("phoneHeaderFooter")
  hideButton("phone-home-button")
  hideButton("phone-back-button")
  if (imageElement && imageElement2 && imageElement3) {
    imageElement3.classList.remove("fadeInIcons")
    homeText.style.opacity = 0
    headerFooter.style.opacity = 0
    headerFooter.style.pointerEvents = "none"
    
    // After a delay, start the animation of the second element
    setTimeout(() => {
      imageElement2.classList.remove("animate")
      // After another delay, start the animation of the third element
      setTimeout(() => {
        imageElement.classList.remove("animate")

        imageElement.style.opacity = 0
        imageElement2.style.opacity = 0
        imageElement3.style.opacity = 0
      }, 1000)
    }, 1000)
    mapReturn(mapLocationBookmark) // Return to map view
  }
}

// Event listener that prepares the phone button and menu view
document.addEventListener("DOMContentLoaded", function () {
  const imageElement = document.createElement("img")
  // phone background gradient screen
  imageElement.src = "./images/phone_bg.png"
  imageElement.id = "phoneBackground"
  imageElement.classList.add("movingImage", "responsive-img")

  document.body.appendChild(imageElement)

  const imageElement2 = document.createElement("img")

  imageElement2.src = "./images/phone_main.png" // phone view itself
  imageElement2.id = "phoneViewScreen"
  imageElement2.classList.add("movingImage", "responsive-img")

  document.body.appendChild(imageElement2)

  const imageElement3 = document.createElement("img")

  imageElement3.src = "./images/phone_home_icons.png" // phone home icons
  imageElement3.id = "phoneHomeIcons"
  imageElement3.classList.add("movingImage", "responsive-img")

  document.body.appendChild(imageElement3)

  // Prepares text message splash backgrounds
  const phoneMessagesBackgroundJack = document.createElement("img")

  phoneMessagesBackgroundJack.src = "./images/phone_splash.png"
  phoneMessagesBackgroundJack.id = "phoneMessagesBackgroundJack"
  phoneMessagesBackgroundJack.classList.add("movingImage", "responsive-img")

  document.body.appendChild(phoneMessagesBackgroundJack)
})

// Generates a text element
function generateTextElement (id, text, font) {
  // Create a div element
  const textElement = document.createElement("div")

  // Set properties and content
  textElement.id = "text" + "_" + id
  textElement.textContent = text
  textElement.classList.add(font)

  return textElement
}

// Generates a borderless, scrollbar-less scrollable container
function generateScrollableContainer (id, scrollToBottom) {
  const container = document.createElement("div")
  container.id = "scrollableContainer" + "_" + id
  // Here fadeInPrevious prepares for a fade-in transition class, fadeInIcons
  container.classList.add("disable-scrollbars",
    "scrollable-container", "fadeOut")
  document.body.appendChild(container)

  // Scroll to the bottom if set by parameter
  if (scrollToBottom) {
    container.scrollTop = container.scrollHeight
  }
}

// Generates the text for the home icons on the phone home view
function generateHomeText () {
  const textContainer = document.createElement("div")
  textContainer.style.top = "0"
  textContainer.style.left = "0"
  textContainer.style.position = "fixed"
  textContainer.id = "homeTextContainer"
  textContainer.classList.add("homeText")
  textContainer.opacity = 1
  containerListHandler.pushToContainerList(textContainer.id)

  document.body.appendChild(textContainer)
  const homeIconArray = ["Messages", "Calendar", "Photos",
    "Instantgram", "GlitchTv", "Settings"]

  for (let i = 0; i < homeIconArray.length; i++) {
    let text = generateTextElement(homeIconArray[i],
      homeIconArray[i], "font-style")
    text.classList.add("homeTextElement")
    textContainer.appendChild(text)
  }
  const text1 = document.getElementById("text_Messages")
  text1.style.top = "28vh"
  text1.style.left = "41.2vw"
  const text2 = document.getElementById("text_Calendar")
  text2.style.top = "28vh"
  text2.style.left = "49.1vw"
  const text3 = document.getElementById("text_Photos")
  text3.style.top = "28vh"
  text3.style.left = "57vw"
  const text4 = document.getElementById("text_Instantgram")
  text4.style.top = "41.5vh"
  text4.style.left = "40.9vw"
  const text7 = document.getElementById("text_GlitchTv")
  text7.style.top = "41.5vh"
  text7.style.left = "49.2vw"
  const text9 = document.getElementById("text_Settings")
  text9.style.top = "41.5vh"
  text9.style.left = "56.6vw"
}

// Checks the current view and calls the relevent function to return back
function phoneBackButton () {
  const currentView = phoneView.getphoneView() // Check the current view
  // If at the home view, return to the previous game mode
  if (currentView == "Home") {
    phoneModeHide()
  } else if (currentView == "Conversations") {
    phoneViewHandler("Home", "")
  } else if (currentView == "TextMessages") {
    phoneViewHandler("Conversations", "")
  }
}

// Changes the header and footer for the phone view based on the current view
function phoneHeaderFooter (view) {
  // Check if the element already exists to avoid re-creating it every time
  let headerFooter = document.getElementById("phoneHeaderFooter")
  if (!headerFooter) {
    const screenContainer = document.createElement("div")
    screenContainer.id = "phoneHeaderFooter"
    // Prepares for fade in
    screenContainer.classList.add("phone-screen-container", "fadeOut")
    document.body.appendChild(screenContainer)
    // Text at top of view
    const headerText = document.createElement("div")
    headerText.id = "headerText"
    headerText.classList.add("headerText")
    
    screenContainer.appendChild(headerText)
  }
  const backButtonCheck = document.getElementById("button_back")
    if (backButtonCheck){
      showButton("phone-back-button")
    } else {
      const backButton = generateButton("back", "", "phone-back-button")
      backButton.setAttribute("tag", "back")
      headerFooter = document.getElementById("phoneHeaderFooter")
      headerFooter.appendChild(backButton)
    }

  // Text at top of view
  const headerText = document.getElementById("headerText")
  // The "title" of the view, showing the current app or view in the app
  headerText.textContent = view
  if (view == "Hyperdimensional Cellular") {
    setTimeout(() => { // Pauses to wait for the phone image to shift right
      const headerFooter = document.getElementById("phoneHeaderFooter")
      headerFooter.classList.remove("fadeOut")
      headerFooter.classList.add("fadeIn") // Allows for a fade in effect
      headerFooter.style.left = "40vw"
      headerFooter.style.opacity = 1
      headerFooter.style.zIndex = 2
      headerFooter.style.pointerEvents = "auto"
    }, 200)
  } else {
    headerFooter.classList.add("fadeOut")
    headerFooter.classList.remove("fadeIn") // Allows for a fade in effect
    setTimeout(() => { // Pauses to wait for the phone image to shift right
      const headerFooter = document.getElementById("phoneHeaderFooter")
      headerFooter.classList.remove("fadeOut")
      headerFooter.classList.add("fadeIn") // Allows for a fade in effect
      headerFooter.style.left = "70.1vw"
      headerText.style.left = "3vw"
      headerText.style.top = "1vw"
      headerFooter.style.opacity = 1
      headerFooter.style.zIndex = 2
      headerFooter.style.pointerEvents = "auto"
    }, 2100)
  }
}
