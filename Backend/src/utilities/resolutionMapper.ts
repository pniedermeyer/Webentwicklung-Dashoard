/**
 * Function that returns a mathematical epsilon we can use for RDP.
 * @param resolution String representation of the resolution
 */
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

/**
 * Function that returns an identifying int to persist in the database.
 * @param resolution String representation of the resolution
 */
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
