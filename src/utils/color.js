export function isValidHex(hex) {
  return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(hex)
}

export function normalizeHex(hex) {
  if (!hex) return '#000000'
  let h = hex.replace('#', '')
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('')
  }
  return '#' + h.toLowerCase()
}

export function hexToRgb(hex) {
  const h = normalizeHex(hex).replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16)
  }
}

export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const v = Math.max(0, Math.min(255, Math.round(n)))
    const h = v.toString(16)
    return h.length === 1 ? '0' + h : h
  }
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

export function rgbToHsl(r, g, b) {
  r = r / 255
  g = g / 255
  b = b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

export function hslToRgb(h, s, l) {
  h = h / 360
  s = s / 100
  l = l / 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsl(r, g, b)
}

export function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l)
  return rgbToHex(r, g, b)
}

function getLinearChannel(c) {
  c = c / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function getRelativeLuminance(r, g, b) {
  const R = getLinearChannel(r)
  const G = getLinearChannel(g)
  const B = getLinearChannel(b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function getContrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function hexToLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  return getRelativeLuminance(r, g, b)
}

export function getContrastWithWhite(hex) {
  const l = hexToLuminance(hex)
  const whiteL = getRelativeLuminance(255, 255, 255)
  return getContrastRatio(l, whiteL)
}

export function getContrastWithBlack(hex) {
  const l = hexToLuminance(hex)
  const blackL = getRelativeLuminance(0, 0, 0)
  return getContrastRatio(l, blackL)
}

export function meetsWcagAa(ratio) {
  return ratio >= 4.5
}

export function meetsWcagAaLarge(ratio) {
  return ratio >= 3
}
