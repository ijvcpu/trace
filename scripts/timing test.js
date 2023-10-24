for (let i = 0; i < textHistory.length; i++) {
  // When encountering the first unread message outgoing, print it and then wait to continue
  if (textHistory[i].read == false) {
    textHistory[i].read = true // Mark the message as read, since it has now been printed
    const textButton = generateButton(textHistory[i].textMessageCount, textHistory[i].text, "text-message-button")
    // For incoming messages, keep printing until an outgoing or choice flag message appears
    // First unread message does not require a pause

    if (textHistory[i].inOrOut == "in" && textHistory[i].tag != "choice") {
      if (i == 0) {
        textButton.classList.add("left-button")
        container.appendChild(textButton) // Display the actual text message
        container.scrollTop = container.scrollHeight // Scroll the view to the bottom
        phoneMessagesPathHandler() // Calls the path handler to print the next message and continue
      } else {
        // Start by showing a simulated pause for the writing of the response
        const ellipsesButton = generateButton("0", "", "text-message-button")
        ellipsesButton.classList.add("left-button")
        textButton.classList.add("left-button")
        setTimeout(() => { // Pauses to generate response and print ellipses
          container.appendChild(ellipsesButton)
          container.scrollTop = container.scrollHeight // Scroll the view to the bottom
        }, 800)
        setTimeout(() => {
          ellipsesButton.textContent = "."
          container.scrollTop = container.scrollHeight // Scroll the view to the bottom
        }, 1800)
        setTimeout(() => {
          ellipsesButton.textContent = ".."
        }, 2800)
        setTimeout(() => {
          ellipsesButton.textContent = "..."
        }, 3800)
        // Replace with the actual response
        setTimeout(() => {
          container.removeChild(ellipsesButton)
          container.appendChild(textButton) // Display the actual text message
          container.scrollTop = container.scrollHeight // Scroll the view to the bottom
          phoneMessagesPathHandler() // Calls the path handler to print the next message and continue
        }, 4800)
      }
    }
  }
}
