import { describe, it, expect } from './runner.js'
import {
  isValidHex,
  normalizeHex,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  getRelativeLuminance,
  getContrastRatio,
  hexToLuminance,
  getContrastWithWhite,
  getContrastWithBlack,
  meetsWcagAa
} from '../src/utils/color.js'

describe('isValidHex', () => {
  it('6位带#号的合法HEX', () => {
    expect(isValidHex('#3b82f6')).toBeTruthy()
    expect(isValidHex('#ffffff')).toBeTruthy()
    expect(isValidHex('#000000')).toBeTruthy()
  })

  it('6位不带#号的合法HEX', () => {
    expect(isValidHex('3b82f6')).toBeTruthy()
    expect(isValidHex('ffffff')).toBeTruthy()
    expect(isValidHex('000000')).toBeTruthy()
  })

  it('3位短HEX带#号', () => {
    expect(isValidHex('#f00')).toBeTruthy()
    expect(isValidHex('#abc')).toBeTruthy()
    expect(isValidHex('#fff')).toBeTruthy()
  })

  it('3位短HEX不带#号', () => {
    expect(isValidHex('f00')).toBeTruthy()
    expect(isValidHex('abc')).toBeTruthy()
    expect(isValidHex('fff')).toBeTruthy()
  })

  it('不区分大小写', () => {
    expect(isValidHex('#FF00AA')).toBeTruthy()
    expect(isValidHex('#FFaa00')).toBeTruthy()
    expect(isValidHex('ABC')).toBeTruthy()
  })

  it('非法字符的HEX', () => {
    expect(isValidHex('#gggggg')).toBeFalsy()
    expect(isValidHex('#xyz123')).toBeFalsy()
    expect(isValidHex('GGG')).toBeFalsy()
  })

  it('长度不正确', () => {
    expect(isValidHex('#ff')).toBeFalsy()
    expect(isValidHex('#fffff')).toBeFalsy()
    expect(isValidHex('#fffffff')).toBeFalsy()
    expect(isValidHex('f')).toBeFalsy()
    expect(isValidHex('ff')).toBeFalsy()
    expect(isValidHex('fffff')).toBeFalsy()
  })

  it('空值', () => {
    expect(isValidHex('')).toBeFalsy()
    expect(isValidHex('#')).toBeFalsy()
  })
})

describe('normalizeHex', () => {
  it('6位HEX规范化为小写带#', () => {
    expect(normalizeHex('#3b82f6')).toBe('#3b82f6')
    expect(normalizeHex('#3B82F6')).toBe('#3b82f6')
    expect(normalizeHex('3b82f6')).toBe('#3b82f6')
    expect(normalizeHex('3B82F6')).toBe('#3b82f6')
  })

  it('3位短HEX扩展为6位', () => {
    expect(normalizeHex('#f00')).toBe('#ff0000')
    expect(normalizeHex('f00')).toBe('#ff0000')
    expect(normalizeHex('#abc')).toBe('#aabbcc')
    expect(normalizeHex('#ABC')).toBe('#aabbcc')
  })

  it('空值返回#000000', () => {
    expect(normalizeHex('')).toBe('#000000')
    expect(normalizeHex(null)).toBe('#000000')
    expect(normalizeHex(undefined)).toBe('#000000')
  })
})

describe('hexToRgb', () => {
  it('6位HEX转RGB', () => {
    expect(hexToRgb('#3b82f6')).toEqual({ r: 59, g: 130, b: 246 })
    expect(hexToRgb('3b82f6')).toEqual({ r: 59, g: 130, b: 246 })
  })

  it('3位短HEX转RGB', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('abc')).toEqual({ r: 170, g: 187, b: 204 })
  })

  it('纯黑纯白', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('常见颜色值', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 })
    expect(hexToRgb('#ffff00')).toEqual({ r: 255, g: 255, b: 0 })
  })

  it('返回值均为整数', () => {
    const result = hexToRgb('#3b82f6')
    expect(Number.isInteger(result.r)).toBeTruthy()
    expect(Number.isInteger(result.g)).toBeTruthy()
    expect(Number.isInteger(result.b)).toBeTruthy()
  })
})

describe('rgbToHex', () => {
  it('正常RGB转HEX', () => {
    expect(rgbToHex(59, 130, 246)).toBe('#3b82f6')
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00')
    expect(rgbToHex(0, 0, 255)).toBe('#0000ff')
  })

  it('边界值 0', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000')
  })

  it('边界值 255', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff')
  })

  it('小数取整（四舍五入）', () => {
    expect(rgbToHex(59.7, 130.3, 246.1)).toBe('#3c82f6')
    expect(rgbToHex(59.4, 130.6, 246.9)).toBe('#3b83f7')
    expect(rgbToHex(10.1, 20.5, 30.9)).toBe('#0a151f')
  })

  it('超出范围被钳制', () => {
    expect(rgbToHex(-10, 300, 256)).toBe('#00ffff')
    expect(rgbToHex(-100, -50, 0)).toBe('#000000')
    expect(rgbToHex(300, 400, 500)).toBe('#ffffff')
  })

  it('返回结果为小写6位带#', () => {
    const result = rgbToHex(10, 20, 30)
    expect(result.startsWith('#')).toBeTruthy()
    expect(result.length).toBe(7)
    expect(result).toBe('#0a141e')
  })
})

describe('rgbToHsl', () => {
  it('纯红', () => {
    expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 })
  })

  it('纯绿', () => {
    expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 })
  })

  it('纯蓝', () => {
    expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 })
  })

  it('纯黑', () => {
    expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 })
  })

  it('纯白', () => {
    expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 })
  })

  it('灰色饱和度为0', () => {
    const gray = rgbToHsl(128, 128, 128)
    expect(gray.s).toBe(0)
    expect(gray.l).toBeCloseTo(50, 0)
  })

  it('返回值均为整数', () => {
    const result = rgbToHsl(59, 130, 246)
    expect(Number.isInteger(result.h)).toBeTruthy()
    expect(Number.isInteger(result.s)).toBeTruthy()
    expect(Number.isInteger(result.l)).toBeTruthy()
  })

  it('h 在 0-360 范围内', () => {
    const { h } = rgbToHsl(59, 130, 246)
    expect(h >= 0 && h <= 360).toBeTruthy()
  })

  it('s 在 0-100 范围内', () => {
    const { s } = rgbToHsl(59, 130, 246)
    expect(s >= 0 && s <= 100).toBeTruthy()
  })

  it('l 在 0-100 范围内', () => {
    const { l } = rgbToHsl(59, 130, 246)
    expect(l >= 0 && l <= 100).toBeTruthy()
  })
})

describe('hslToRgb', () => {
  it('纯红', () => {
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('纯绿', () => {
    expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 })
  })

  it('纯蓝', () => {
    expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 })
  })

  it('纯黑', () => {
    expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('纯白', () => {
    expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('灰色（饱和度为0）', () => {
    expect(hslToRgb(0, 0, 50)).toEqual({ r: 128, g: 128, b: 128 })
  })

  it('返回值均为整数', () => {
    const result = hslToRgb(217, 91, 60)
    expect(Number.isInteger(result.r)).toBeTruthy()
    expect(Number.isInteger(result.g)).toBeTruthy()
    expect(Number.isInteger(result.b)).toBeTruthy()
  })

  it('r, g, b 在 0-255 范围内', () => {
    const { r, g, b } = hslToRgb(217, 91, 60)
    expect(r >= 0 && r <= 255).toBeTruthy()
    expect(g >= 0 && g <= 255).toBeTruthy()
    expect(b >= 0 && b <= 255).toBeTruthy()
  })
})

describe('RGB ↔ HSL 往返一致性', () => {
  function testRoundTrip(r, g, b, tolerance = 2) {
    const hsl = rgbToHsl(r, g, b)
    const back = hslToRgb(hsl.h, hsl.s, hsl.l)
    expect(Math.abs(back.r - r)).toBeLessThan(tolerance + 1)
    expect(Math.abs(back.g - g)).toBeLessThan(tolerance + 1)
    expect(Math.abs(back.b - b)).toBeLessThan(tolerance + 1)
  }

  it('纯红往返一致', () => testRoundTrip(255, 0, 0))
  it('纯绿往返一致', () => testRoundTrip(0, 255, 0))
  it('纯蓝往返一致', () => testRoundTrip(0, 0, 255))
  it('纯黑往返一致', () => testRoundTrip(0, 0, 0))
  it('纯白往返一致', () => testRoundTrip(255, 255, 255))
  it('蓝色 #3b82f6 往返一致', () => testRoundTrip(59, 130, 246))
  it('紫色往返一致', () => testRoundTrip(139, 92, 246))
  it('橙色往返一致', () => testRoundTrip(249, 115, 22))
  it('灰色往返一致', () => testRoundTrip(128, 128, 128))
  it('随机颜色1往返一致', () => testRoundTrip(45, 210, 178))
  it('随机颜色2往返一致', () => testRoundTrip(236, 72, 153))
  it('随机颜色3往返一致', () => testRoundTrip(88, 28, 135))
})

describe('hexToHsl / hslToHex', () => {
  it('HEX 转 HSL', () => {
    expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 100, l: 50 })
    expect(hexToHsl('#00ff00')).toEqual({ h: 120, s: 100, l: 50 })
  })

  it('HSL 转 HEX', () => {
    expect(hslToHex(0, 100, 50)).toBe('#ff0000')
    expect(hslToHex(120, 100, 50)).toBe('#00ff00')
    expect(hslToHex(240, 100, 50)).toBe('#0000ff')
  })
})

describe('getRelativeLuminance', () => {
  it('纯黑亮度为 0', () => {
    expect(getRelativeLuminance(0, 0, 0)).toBeCloseTo(0, 4)
  })

  it('纯白亮度为 1', () => {
    expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1, 4)
  })

  it('绿色权重最高（0.7152）', () => {
    const green = getRelativeLuminance(0, 255, 0)
    const red = getRelativeLuminance(255, 0, 0)
    const blue = getRelativeLuminance(0, 0, 255)
    expect(green > red).toBeTruthy()
    expect(red > blue).toBeTruthy()
  })

  it('返回值在 0-1 范围内', () => {
    const l = getRelativeLuminance(59, 130, 246)
    expect(l >= 0 && l <= 1).toBeTruthy()
  })
})

describe('getContrastRatio', () => {
  it('黑白对比度约为 21:1', () => {
    const black = getRelativeLuminance(0, 0, 0)
    const white = getRelativeLuminance(255, 255, 255)
    expect(getContrastRatio(white, black)).toBeCloseTo(21, 0)
  })

  it('同色对比度为 1:1', () => {
    const l = getRelativeLuminance(59, 130, 246)
    expect(getContrastRatio(l, l)).toBeCloseTo(1, 4)
  })

  it('参数顺序不影响结果', () => {
    const l1 = getRelativeLuminance(255, 0, 0)
    const l2 = getRelativeLuminance(0, 0, 255)
    expect(getContrastRatio(l1, l2)).toBe(getContrastRatio(l2, l1))
  })
})

describe('hexToLuminance', () => {
  it('HEX 转亮度', () => {
    expect(hexToLuminance('#000000')).toBeCloseTo(0, 4)
    expect(hexToLuminance('#ffffff')).toBeCloseTo(1, 4)
  })

  it('返回值在 0-1 范围内', () => {
    const l = hexToLuminance('#3b82f6')
    expect(l >= 0 && l <= 1).toBeTruthy()
  })
})

describe('getContrastWithWhite / getContrastWithBlack', () => {
  it('黑色对白对比度约为 21:1', () => {
    expect(getContrastWithWhite('#000000')).toBeCloseTo(21, 0)
  })

  it('白色对白对比度为 1:1', () => {
    expect(getContrastWithWhite('#ffffff')).toBeCloseTo(1, 3)
  })

  it('白色对黑对比度约为 21:1', () => {
    expect(getContrastWithBlack('#ffffff')).toBeCloseTo(21, 0)
  })

  it('黑色对黑对比度为 1:1', () => {
    expect(getContrastWithBlack('#000000')).toBeCloseTo(1, 3)
  })

  it('返回值为正数', () => {
    expect(getContrastWithWhite('#3b82f6') > 0).toBeTruthy()
    expect(getContrastWithBlack('#3b82f6') > 0).toBeTruthy()
  })
})

describe('meetsWcagAa', () => {
  it('对比度 4.5:1 刚好通过 AA', () => {
    expect(meetsWcagAa(4.5)).toBeTruthy()
  })

  it('对比度 5:1 通过 AA', () => {
    expect(meetsWcagAa(5.0)).toBeTruthy()
  })

  it('对比度 21:1 通过 AA', () => {
    expect(meetsWcagAa(21)).toBeTruthy()
  })

  it('对比度 4.49:1 不通过 AA', () => {
    expect(meetsWcagAa(4.49)).toBeFalsy()
  })

  it('对比度 1:1 不通过 AA', () => {
    expect(meetsWcagAa(1)).toBeFalsy()
  })
})

describe('整体往返：HEX → RGB → HSL → RGB → HEX', () => {
  it('多种颜色完整往返一致', () => {
    const colors = ['#3b82f6', '#ef4444', '#22c55e', '#8b5cf6', '#f59e0b', '#10b981', '#6b7280']
    for (const hex of colors) {
      const rgb = hexToRgb(hex)
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const rgbBack = hslToRgb(hsl.h, hsl.s, hsl.l)
      const hexBack = rgbToHex(rgbBack.r, rgbBack.g, rgbBack.b)

      const diff = Math.abs(rgbBack.r - rgb.r) + Math.abs(rgbBack.g - rgb.g) + Math.abs(rgbBack.b - rgb.b)
      expect(diff).toBeLessThan(6)
    }
  })
})
