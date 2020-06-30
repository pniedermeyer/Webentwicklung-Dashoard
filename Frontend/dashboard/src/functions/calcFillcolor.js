export function calcFillcolor ({ baseColor = 240, value = 1, maxValue = 100 }) {
  const colorscaling = (value * 50) / maxValue // 100: max (white), 50: min (pure color)
  return createHslLiteral(baseColor, 100, 100 - colorscaling)
}

function createHslLiteral (hue, saturation, lightness) {
  return 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)'
}
