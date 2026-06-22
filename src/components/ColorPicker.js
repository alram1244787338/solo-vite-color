import { hexToRgb, hexToHsl, isValidHex, normalizeHex } from '../utils/color.js'

export default class ColorPicker {
  constructor(initialColor = '#3b82f6') {
    this.color = normalizeHex(initialColor)
    this.listeners = []
  }

  onChange(callback) {
    this.listeners.push(callback)
  }

  setColor(newColor) {
    const normalized = normalizeHex(newColor)
    if (normalized !== this.color) {
      this.color = normalized
      this.listeners.forEach(cb => cb(this.color))
      this._updateView()
    }
  }

  render() {
    const container = document.createElement('div')
    container.className = 'color-picker'
    container.innerHTML = `
      <h2 class="section-title">颜色拾取器</h2>
      <div class="color-preview-wrapper">
        <div class="color-preview" id="cp-preview"></div>
      </div>
      <div class="picker-row">
        <label class="picker-label">取色器</label>
        <input type="color" id="cp-color" class="color-input" value="${this.color}" />
      </div>
      <div class="picker-row">
        <label class="picker-label">HEX</label>
        <div class="hex-input-wrapper">
          <span class="hex-prefix">#</span>
          <input
            type="text"
            id="cp-hex"
            class="hex-input"
            maxlength="6"
            value="${this.color.replace('#', '')}"
            placeholder="3b82f6"
          />
        </div>
      </div>
      <h3 class="section-subtitle">格式转换</h3>
      <div class="format-list">
        <div class="format-row">
          <span class="format-label">HEX</span>
          <span class="format-value" id="cp-fmt-hex">${this.color.toUpperCase()}</span>
        </div>
        <div class="format-row">
          <span class="format-label">RGB</span>
          <span class="format-value" id="cp-fmt-rgb">rgb(0, 0, 0)</span>
        </div>
        <div class="format-row">
          <span class="format-label">HSL</span>
          <span class="format-value" id="cp-fmt-hsl">hsl(0, 0%, 0%)</span>
        </div>
      </div>
    `

    this.el = container
    this._bindEvents()
    this._updateView()
    return container
  }

  _bindEvents() {
    const colorInput = this.el.querySelector('#cp-color')
    const hexInput = this.el.querySelector('#cp-hex')

    colorInput.addEventListener('input', (e) => {
      this.setColor(e.target.value)
    })

    hexInput.addEventListener('input', (e) => {
      const val = e.target.value.replace(/[^a-fA-F0-9]/g, '')
      e.target.value = val
      if (val.length === 3 || val.length === 6) {
        const hex = '#' + val
        if (isValidHex(hex)) {
          this.color = normalizeHex(hex)
          this.listeners.forEach(cb => cb(this.color))
          this._updateView()
          colorInput.value = this.color
        }
      }
    })

    hexInput.addEventListener('blur', () => {
      hexInput.value = this.color.replace('#', '')
    })
  }

  _updateView() {
    if (!this.el) return

    const preview = this.el.querySelector('#cp-preview')
    const colorInput = this.el.querySelector('#cp-color')
    const hexInput = this.el.querySelector('#cp-hex')
    const fmtHex = this.el.querySelector('#cp-fmt-hex')
    const fmtRgb = this.el.querySelector('#cp-fmt-rgb')
    const fmtHsl = this.el.querySelector('#cp-fmt-hsl')

    preview.style.backgroundColor = this.color
    colorInput.value = this.color
    hexInput.value = this.color.replace('#', '')

    const rgb = hexToRgb(this.color)
    const hsl = hexToHsl(this.color)

    fmtHex.textContent = this.color.toUpperCase()
    fmtRgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    fmtHsl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  }
}
