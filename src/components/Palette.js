const PRESET_COLORS = [
  { name: '红色', hex: '#ef4444' },
  { name: '橙红', hex: '#f97316' },
  { name: '橙色', hex: '#f59e0b' },
  { name: '黄色', hex: '#eab308' },
  { name: '黄绿', hex: '#84cc16' },
  { name: '绿色', hex: '#22c55e' },
  { name: '青绿', hex: '#10b981' },
  { name: '青色', hex: '#06b6d4' },
  { name: '蓝色', hex: '#3b82f6' },
  { name: '紫色', hex: '#8b5cf6' },
  { name: '灰色', hex: '#6b7280' },
  { name: '黑色', hex: '#111827' }
]

export default class Palette {
  constructor() {
    this.colors = PRESET_COLORS
    this.selectedHex = null
    this.listeners = []
  }

  onSelect(callback) {
    this.listeners.push(callback)
  }

  setSelected(hex) {
    if (this.selectedHex !== hex) {
      this.selectedHex = hex
      this._updateActive()
    }
  }

  render() {
    const container = document.createElement('div')
    container.className = 'palette'
    container.innerHTML = `
      <h2 class="section-title">预设调色板</h2>
      <p class="palette-hint">点击色块选择颜色</p>
      <div class="palette-grid" id="palette-grid"></div>
    `

    this.el = container
    const grid = container.querySelector('#palette-grid')

    this.colors.forEach((color, idx) => {
      const swatch = document.createElement('button')
      swatch.className = 'color-swatch'
      swatch.dataset.hex = color.hex
      swatch.dataset.index = idx
      swatch.title = `${color.name} ${color.hex}`
      swatch.style.backgroundColor = color.hex

      if (color.l > 50 || color.hex === '#eab308' || color.hex === '#84cc16' || color.hex === '#f59e0b') {
        swatch.style.color = '#333'
      } else {
        swatch.style.color = '#fff'
      }

      const label = document.createElement('span')
      label.className = 'swatch-label'
      label.textContent = color.hex
      swatch.appendChild(label)

      swatch.addEventListener('click', () => {
        this.selectedHex = color.hex
        this._updateActive()
        this.listeners.forEach(cb => cb(color.hex))
      })

      grid.appendChild(swatch)
    })

    return container
  }

  _updateActive() {
    if (!this.el) return
    const swatches = this.el.querySelectorAll('.color-swatch')
    swatches.forEach(s => {
      if (s.dataset.hex.toLowerCase() === this.selectedHex?.toLowerCase()) {
        s.classList.add('active')
      } else {
        s.classList.remove('active')
      }
    })
  }
}
