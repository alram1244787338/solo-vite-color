import {
  getContrastWithWhite,
  getContrastWithBlack,
  meetsWcagAa
} from '../utils/color.js'

export default class ContrastChecker {
  constructor(initialColor = '#3b82f6') {
    this.color = initialColor
  }

  setColor(hex) {
    this.color = hex
    this._updateView()
  }

  render() {
    const container = document.createElement('div')
    container.className = 'contrast-checker'
    container.innerHTML = `
      <h2 class="section-title">色彩对比度检测</h2>
      <p class="contrast-hint">当前颜色在白色/黑色背景上的文字可读性</p>
      <div class="contrast-grid">
        <div class="contrast-card bg-white" id="cc-white">
          <div class="contrast-sample">
            <span class="sample-text" id="cc-white-text">示例文本 Sample Text</span>
          </div>
          <div class="contrast-info">
            <div class="contrast-ratio">
              <span class="ratio-label">对比度</span>
              <span class="ratio-value" id="cc-white-ratio">0:1</span>
            </div>
            <div class="contrast-status" id="cc-white-status">
              <span class="status-dot"></span>
              <span class="status-text">--</span>
            </div>
          </div>
        </div>
        <div class="contrast-card bg-black" id="cc-black">
          <div class="contrast-sample">
            <span class="sample-text" id="cc-black-text">示例文本 Sample Text</span>
          </div>
          <div class="contrast-info">
            <div class="contrast-ratio">
              <span class="ratio-label">对比度</span>
              <span class="ratio-value" id="cc-black-ratio">0:1</span>
            </div>
            <div class="contrast-status" id="cc-black-status">
              <span class="status-dot"></span>
              <span class="status-text">--</span>
            </div>
          </div>
        </div>
      </div>
      <div class="contrast-wcag-note">
        <strong>WCAG AA 标准：</strong>正文对比度 ≥ 4.5:1
      </div>
    `

    this.el = container
    this._updateView()
    return container
  }

  _updateView() {
    if (!this.el) return

    const whiteText = this.el.querySelector('#cc-white-text')
    const blackText = this.el.querySelector('#cc-black-text')
    const whiteRatio = this.el.querySelector('#cc-white-ratio')
    const blackRatio = this.el.querySelector('#cc-black-ratio')
    const whiteStatus = this.el.querySelector('#cc-white-status')
    const blackStatus = this.el.querySelector('#cc-black-status')

    const whiteContrast = getContrastWithWhite(this.color)
    const blackContrast = getContrastWithBlack(this.color)

    whiteText.style.color = this.color
    blackText.style.color = this.color

    whiteRatio.textContent = whiteContrast.toFixed(2) + ':1'
    blackRatio.textContent = blackContrast.toFixed(2) + ':1'

    this._setStatus(whiteStatus, meetsWcagAa(whiteContrast))
    this._setStatus(blackStatus, meetsWcagAa(blackContrast))
  }

  _setStatus(el, pass) {
    const dot = el.querySelector('.status-dot')
    const text = el.querySelector('.status-text')
    if (pass) {
      dot.className = 'status-dot pass'
      text.textContent = '通过 AA'
      text.className = 'status-text pass'
    } else {
      dot.className = 'status-dot fail'
      text.textContent = '未通过 AA'
      text.className = 'status-text fail'
    }
  }
}
