// Creates a blank SVG text element
function generateSVG () {
  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("viewBox", "0 0 1920 1080")

  // Create the text element
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
  text.setAttribute("class", "small mn leftside")
  text.setAttribute("x", "50%")
  text.setAttribute("y", "20")
  text.setAttribute("id", "currentText")
  text.setAttribute("text-anchor", "middle")

  // Create and append the tspan elements
  for (let i = 0; i < 10; i++) {
    const tspan =
      document.createElementNS("http://www.w3.org/2000/svg", "tspan")
    tspan.setAttribute("x", "220")
    // Different dy for the first tspan
    tspan.setAttribute("dy", i == 0 ? "10px" : "45px")
    tspan.setAttribute("id", "tspan" + i)
    text.appendChild(tspan)
  }
  // Append the text element to the SVG
  svg.appendChild(text)
  // Append the SVG to the document or a specific container element
  document.body.appendChild(svg)
}
