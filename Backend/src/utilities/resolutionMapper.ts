function mapResolutionToEpsilon(resolution: String) {
  switch (resolution) {
    case 'low':
      return 0.0001
    case 'medium':
      return 0.00001
    case 'high':
      return 0.000001
    default:
      return 0
  }
}

function mapResolutionToInt(resolution: String) {
  switch (resolution) {
    case 'low':
      return 3
    case 'medium':
      return 2
    case 'high':
      return 1
    default:
      return 0
  }
}

export { mapResolutionToEpsilon, mapResolutionToInt }
