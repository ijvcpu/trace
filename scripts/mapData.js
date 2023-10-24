// Stores pertinent map data for reference

// Stores clickable look areas as class objects for reference
class ClickableArea {
  constructor () {
    this.areaType = "" // Either "look" or "talk", etc.
    this.numberOfAreas = 0 // Total number of areas on the screen in this view
    // A list of "x_y" values to be split that define the size of each area
    this.sizeXY = []
    this.locationXY = [] // As above, but for location on the screen
    this.tag = [] // A list of the pertinent tag to attach to each area
  }
}

// Creates and returns ClickableArea objects when a given screen view is loaded
const mapClickableLookAreaList = {
  "01s": function () {
    const thisArea = new ClickableArea()
    thisArea.areaType = "look"
    thisArea.numberOfAreas = 1
    thisArea.sizeXY = ["250_250"]
    thisArea.locationXY = ["60%_50%"]
    thisArea.tag = ["look_01s"]
    return thisArea
  },
  "02n": function () {
    const thisArea = new ClickableArea()
    thisArea.areaType = "look"
    thisArea.numberOfAreas = 1
    thisArea.sizeXY = ["250_500"]
    thisArea.locationXY = ["39%_20%"]
    thisArea.tag = ["look_02n"]
    return thisArea
  },
  "03n": function () {
    const thisArea = new ClickableArea()
    thisArea.areaType = "look"
    thisArea.numberOfAreas = 1
    thisArea.sizeXY = ["800_800"]
    thisArea.locationXY = ["30%_12%"]
    thisArea.tag = ["look_03n"]
    return thisArea
  }
}

const mapClickableTalkAreaList = {
  "02n": function () {
    const thisArea = new ClickableArea()
    thisArea.areaType = "talk"
    thisArea.numberOfAreas = 1
    thisArea.sizeXY = ["250_500"]
    thisArea.locationXY = ["39%_20%"]
    thisArea.tag = ["talk_02n"]
    return thisArea
  },
  "03n": function () {
    const thisArea = new ClickableArea()
    thisArea.areaType = "talk"
    thisArea.numberOfAreas = 1
    thisArea.sizeXY = ["800_800"]
    thisArea.locationXY = ["30%_12%"]
    thisArea.tag = ["talk_03n"]
    return thisArea
  }
}

const mapClickableGetAreaList = {
  "02n": function () {
    const thisArea = new ClickableArea()
    thisArea.areaType = "get"
    thisArea.numberOfAreas = 2
    thisArea.sizeXY = ["250_500", "250_500"]
    thisArea.locationXY = ["15%_20%", "78%_20%"]
    thisArea.tag = ["get_02n_ra", "get_02n_ak"]
    return thisArea
  }
}
