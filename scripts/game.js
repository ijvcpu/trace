// game.js - scripting associated with the general operation of the game itself

// Prevents screen animations from overlapping
const animationHandler = (function () {
  let animatingFlag = false // Used to prevent transitions from overlapping

  function raiseAnimatingFlag () {
    animatingFlag = true
  }

  function lowerAnimatingFlag(){
    animatingFlag = false
  }

  function getAnimatingFlag(){
    return animatingFlag
  }

  // Makes functions available in the global scope
  return {
    raiseAnimatingFlag,
    lowerAnimatingFlag,
    getAnimatingFlag
  }
})()



/*
var imageUrls = [
  './images/bg001.png',
    './images/bg002.png',
    './images/bg003.png',
    './images/bg004.png',
    './images/bg005.png',
    './images/bg006.png',
    './images/bg007.png',
    './images/bg008.png',
    './images/bg009.png',
    './images/bg010.png',
    './images/bg011.png',
    './images/bg012.png',
    './images/bg013.png',
    './images/bg014.png',
    './images/bg015.png',
    './images/bg016.png',
    './images/bg017.png',
    './images/bg018.png',
    './images/bg019.png',
    './images/bg020.png',
    './images/bg021.png',
    './images/bg022.png',
    './images/bg023.png',
    './images/bg024.png',
    './images/bg025.png',
    './images/bg026.png',
    './images/button_idle.png',
    './images/phone_splash.png',
    './images/choice_box.png',
    './images/m00n.png',
    './images/m00e.png',
    './images/m00s.png',
    './images/m00w.png',
    './images/m01n.png',
    './images/m01e.png',
    './images/m01s.png',
    './images/m01w.png',
    './images/m02n.png',
    './images/m02e.png',
    './images/m02s.png',
    './images/m02w.png',
    './images/m03n.png',
    './images/m03e.png',
    './images/m03s.png',
    './images/m03w.png',
];

var images = [];
var loadedImagesCount = 0;

function preloadImages(callback) {

  imageUrls.forEach(function (imageUrl) {
      var img = new Image();
      img.src = imageUrl;
      img.onload = function () {
          loadedImagesCount++;
          var progress = (loadedImagesCount / imageUrls.length) * 100;
          updateLoadingProgress(progress);

          if (loadedImagesCount === imageUrls.length) {
              callback();
          }
      };
      images.push(img);
  });
}

function updateLoadingProgress(progress) {
  var loadingProgressBar = document.getElementById('loading-progress');
  loadingProgressBar.style.width = progress + '%';
}

function startImagePreloading() {
  //createLoadingBar();
  preloadImages(function () {
    // All images are preloaded
    var loadingBar = document.getElementById('loading-bar');
    loadingBar.style.display = 'none'; // Hide the loading bar
    onStart();
  });
}

function loadAssets () {
  var imageUrls = [
    './images/bg001.png',
    './images/bg002.png',
    './images/bg003.png',
    './images/bg004.png',
    './images/bg005.png',
    './images/bg006.png',
    './images/bg007.png',
    './images/bg008.png',
    './images/bg009.png',
    './images/bg010.png',
    './images/bg011.png',
    './images/bg012.png',
    './images/bg013.png',
    './images/bg014.png',
    './images/bg015.png',
    './images/bg016.png',
    './images/bg017.png',
    './images/bg018.png',
    './images/bg019.png',
    './images/bg020.png',
    './images/bg021.png',
    './images/bg022.png',
    './images/bg023.png',
    './images/bg024.png',
    './images/bg025.png',
    './images/bg026.png',
    './images/button_idle.png',
    './images/phone_splash.png',
    './images/choice_box.png',
    './images/m00n.png',
    './images/m00e.png',
    './images/m00s.png',
    './images/m00w.png',
    './images/m01n.png',
    './images/m01e.png',
    './images/m01s.png',
    './images/m01w.png',
    './images/m02n.png',
    './images/m02e.png',
    './images/m02s.png',
    './images/m02w.png',
    './images/m03n.png',
    './images/m03e.png',
    './images/m03s.png',
    './images/m03w.png',
  ];
  var images = [];

  imageUrls.forEach(function (imageUrl) {
      var img = new Image();
      img.src = imageUrl;
      images.push(img);
  });

  
  onStart()
}

*/
function onStart () {
  screenHandler.setDialogueCartridge("gameStart") // Sets the current cartridge
  // Sets the current screen object according to the current parameters
  screenHandler.setCurrentScreenObject()
  hideButton("button") // Clears any erroneously generated objects at start
  // var element = document.getElementById('currentText');
  currentScreen = screenHandler.getCurrentScreenObject()
  updateScreen()
  wordWrap(currentScreen.characterLine, 20)
}

// Redraws the screen based on the latest screen object loaded from dialogue
function screenRefresh () {
  // Update to next screen
  screenHandler.setCurrentScreenObject()
  updateScreen()
}

// Display the specified image based on filename, without extension included
function displayBackground (imageName) {
  // Catch altered map views by frame
  // For showing gragulon after eye riddle
  if (imageName == "m01s" && repeatInteractionHandler.getRepeat("talk03n") &&
      !repeatInteractionHandler.getRepeat("look01s")) {
    document.body.style.backgroundImage = "url(" + "images/" +
      imageName + "1" + ".png)"
  } else {
    document.body.style.backgroundImage = "url(" + "images/" +
      imageName + ".png)"
  }
}

// Main startup event listener
document.addEventListener("DOMContentLoaded", function () {
  // onStart(); // Initial startup // Now handled by start button
  // Background track
  const audio = new Audio("detective.mp3")
  audio.autoplay = true // Set autoplay
  audio.loop = true // Set loop

  const audioContainer = document.createElement("div")
  audioContainer.appendChild(audio)

  // Append the audio container to the document body or another desired location
  document.body.appendChild(audioContainer)

  // Main on-click event listener for dialogue mode
  document.body.addEventListener("click", function () {
    if (animationHandler.getAnimatingFlag()) {
      // If the animation is already in progress, do nothing.
      return
    }

    // Used to pause on-click progression for choices, map view, etc.
    let pauseCheck = screenHandler.getPauseFlag()
    if (!pauseCheck) {
      // Only fires if the pause flag is lowered
      screenHandler.incrementScreenCount()
      screenRefresh()
    }
    // Set a flag to indicate that the animation is in progress.
    animationHandler.raiseAnimatingFlag()

    // Set a timeout to reset the flag after your transition duration
    setTimeout(() => {
      // Reset the flag to indicate that the animation has finished.
      animationHandler.lowerAnimatingFlag()
    }, 800)
  })
})
