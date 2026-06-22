import { hexToRgb, hexToHsl, isValidHex, normalizeHex } from '../utils/color.js'

function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

export default class ColorPicker {
  constructor(initialColor = '#3b82f6') {
    this.color = normalizeHex(initialColor)
    this.validColor = this.color
    this.listeners = []
    this.hexInputError = false
    this._debouncedSyncColor = debounce((val) => this._syncColorFromInput(val), 300)
  }

  onChange(callback) {
    this.listeners.push(callback)
  }

  setColor(newColor) {
    const normalized = normalizeHex(newColor)
    if (normalized !== this.color) {
      this.color = normalized
      this.validColor = normalized
      this.hexInputError = false
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
        <div class="hex-input-wrapper" id="cp-hex-wrapper">
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
      <div class="error-message" id="cp-error" style="display:none">无效的颜色值</div>
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
      this._debouncedSyncColor(val)
    })

    hexInput.addEventListener('blur', () => {
      hexInput.value = this.color.replace('#', '')
      if (this.hexInputError) {
        this.hexInputError = false
        this._updateErrorState()
      }
    })
  }

  _syncColorFromInput(val) {
    const hexInput = this.el.querySelector('#cp-hex')
    const colorInput = this.el.querySelector('#cp-color')

    if (val.length === 3 || val.length === 6) {
      const hex = '#' + val
      if (isValidHex(hex)) {
        this.color = normalizeHex(hex)
        this.validColor = this.color
        this.hexInputError = false
        this.listeners.forEach(cb => cb(this.color))
        this._updateView()
        colorInput.value = this.color
      } else {
        this.hexInputError = true
        this._updateErrorState()
      }
    } else if (val.length === 0) {
      this.hexInputError = false
      this._updateErrorState()
    } else {
      this.hexInputError = true
      this._updateErrorState()
    }
  }

  _updateErrorState() {
    if (!this.el) return
    const wrapper = this.el.querySelector('#cp-hex-wrapper')
    const errorMsg = this.el.querySelector('#cp-error')
    if (this.hexInputError) {
      wrapper.classList.add('error')
      errorMsg.style.display = 'block'
    } else {
      wrapper.classList.remove('error')
      errorMsg.style.display = 'none'
    }
  }

  _updateView() {
    if (!this.el) return

    const preview = this.el.querySelector('#cp-preview')
    const colorInput = this.el.querySelector('#cp-color')
    const hexInput = this.el.querySelector('#cp-hex')
    const fmtHex = this.el.querySelector('#cp-fmt-hex')
    const fmtRgb = this.el.querySelector('#cp-fmt-rgb')
    const fmtHsl = this.el.querySelector('#cp-fmt-hsl')

    preview.style.backgroundColor = this.validColor
    colorInput.value = this.validColor
    hexInput.value = this.validColor.replace('#', '')

    const rgb = hexToRgb(this.validColor)
    const hsl = hexToHsl(this.validColor)

    fmtHex.textContent = this.validColor.toUpperCase()
    fmtRgb.textContent = `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`
    fmtHsl.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`

    this._updateErrorState()
  }
}
