/**
 * Implementation of a hash code function to be used as id for counties
 * @param s 
 */
function hashCode(s: string): number {
  var hash: number = 0
  if (s.length == 0) return hash
  for (let i: number = 0; i < s.length; i++) {
    let char = s.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

export default hashCode
