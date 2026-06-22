import {
  getContrastWithWhite,
  getContrastWithBlack,
  meetsWcagAa,
  hexToLuminance
} from './src/utils/color.js'

console.log('蓝色 #3b82f6:')
console.log('  对白对比度:', getContrastWithWhite('#3b82f6').toFixed(2) + ':1')
console.log('  对黑对比度:', getContrastWithBlack('#3b82f6').toFixed(2) + ':1')
console.log('  对白是否过 AA:', meetsWcagAa(getContrastWithWhite('#3b82f6')))
console.log('  对黑是否过 AA:', meetsWcagAa(getContrastWithBlack('#3b82f6')))

console.log('\n红色 #ef4444:')
console.log('  对白对比度:', getContrastWithWhite('#ef4444').toFixed(2) + ':1')
console.log('  对黑对比度:', getContrastWithBlack('#ef4444').toFixed(2) + ':1')
console.log('  对白是否过 AA:', meetsWcagAa(getContrastWithWhite('#ef4444')))
console.log('  对黑是否过 AA:', meetsWcagAa(getContrastWithBlack('#ef4444')))

console.log('\n黑色 #000000:')
console.log('  对白对比度:', getContrastWithWhite('#000000').toFixed(2) + ':1')
console.log('  对黑对比度:', getContrastWithBlack('#000000').toFixed(2) + ':1')
console.log('  对白是否过 AA:', meetsWcagAa(getContrastWithWhite('#000000')))

console.log('\n白色 #ffffff:')
console.log('  对白对比度:', getContrastWithWhite('#ffffff').toFixed(2) + ':1')
console.log('  对黑对比度:', getContrastWithBlack('#ffffff').toFixed(2) + ':1')
console.log('  对黑是否过 AA:', meetsWcagAa(getContrastWithBlack('#ffffff')))

console.log('\n#3b82f6 相对亮度:', hexToLuminance('#3b82f6').toFixed(4))
