import './styles/global.css'
import './styles/layout.css'
import './styles/components.css'
import ColorPicker from './components/ColorPicker.js'
import Palette from './components/Palette.js'

const app = document.querySelector('#app')

const header = document.createElement('header')
header.className = 'app-header'
header.innerHTML = '<h1>颜色调色工具</h1>'

const main = document.createElement('main')
main.className = 'app-main'

const contentGrid = document.createElement('div')
contentGrid.className = 'content-grid'

const colorPicker = new ColorPicker('#3b82f6')
const palette = new Palette()

contentGrid.appendChild(colorPicker.render())
contentGrid.appendChild(palette.render())
main.appendChild(contentGrid)
app.appendChild(header)
app.appendChild(main)

colorPicker.onChange((hex) => {
  palette.setSelected(hex)
})

palette.onSelect((hex) => {
  colorPicker.setColor(hex)
})

palette.setSelected(colorPicker.color)
