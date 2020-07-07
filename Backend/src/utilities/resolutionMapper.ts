function mapResolutionToEpsilon(resolution: String) {
  switch (resolution) {
    case 'low':
      return 0.0001
      break
    case 'medium':
      return 0.00001
    default:
      return 0.000001
      break
  }
}

function mapResolutionToInt(resolution: String) {
  switch (resolution) {
    case 'low':
      return 2
      break
    case 'medium':
      return 1
    default:
      return 0
      break
  }
}

export {mapResolutionToEpsilon, mapResolutionToInt}
