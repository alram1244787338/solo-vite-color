# 颜色调色工具 (Color Palette Tool)

纯前端颜色工具，支持取色、多格式互转、预设调色板和 WCAG 对比度检测。

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:5173](http://localhost:5173) 即可使用。

其他命令：

```bash
npm run build      # 构建生产版本
npm run preview    # 本地预览生产构建
npm test           # 运行单元测试
```

## 功能

- **颜色拾取器**：原生 `input[type=color]` 取色器 + HEX 手动输入，两者双向同步，输入停止 300ms 防抖后同步取色器，非法 HEX 显示红色错误提示并保留上一次有效值
- **实时格式转换**：当前颜色在 HEX、RGB、HSL 三种格式下的值实时显示，均为整数
- **12 色预设调色板**：红橙黄绿青蓝紫灰黑 12 个常用色块，点击即刻选中并同步
- **WCAG 对比度检测**：展示当前颜色在白色和黑色背景上的文字示例，计算对比度比值（(L1+0.05)/(L2+0.05)），标注是否达到 AA 标准（4.5:1）

## 技术栈

- **构建工具**：Vite 5
- **语言**：原生 JavaScript (ES Modules, class-based)
- **样式**：原生 CSS
- **测试**：手写轻量 runner（describe / it / expect），Node 原生运行，无额外依赖

纯前端项目，无后端、无路由、无 HTTP 请求。

## 目录结构

```
.
├── index.html                  # 入口 HTML（仅含 #app 容器，内容由 JS 动态生成）
├── package.json
├── vite.config.js
├── src/
│   ├── main.js                 # 入口：组装组件、建立联动
│   ├── components/
│   │   ├── ColorPicker.js      # 取色器 + HEX 输入 + 格式转换显示
│   │   ├── Palette.js          # 12 色预设调色板
│   │   └── ContrastChecker.js  # WCAG 对比度检测（白/黑背景）
│   ├── utils/
│   │   └── color.js            # 纯函数：HEX/RGB/HSL 互转 + 对比度计算
│   └── styles/
│       ├── global.css          # 全局 reset 与基础样式
│       ├── layout.css          # 页面整体布局（Grid 左右分栏）
│       └── components.css      # 各组件样式
└── test/
    ├── runner.js               # 轻量测试运行器
    ├── color.test.js           # color.js 测试用例（14 套件，74 用例）
    └── run.js                  # 测试入口
```

## 测试

```bash
npm test
```

覆盖 `src/utils/color.js` 全部纯函数：

- `isValidHex` / `normalizeHex`：合法/非法/3位短/空值等边界
- `hexToRgb` / `rgbToHex`：正常值、边界 0/255、小数取整、范围钳制
- `rgbToHsl` / `hslToRgb`：三原色、黑白灰、返回值类型与范围
- RGB ↔ HSL 往返一致性：12 组颜色，误差容差 ±2
- HEX → RGB → HSL → RGB → HEX 完整链路往返
- `getRelativeLuminance` / `getContrastRatio`：亮度、黑白 21:1、同色 1:1、顺序无关
- `getContrastWithWhite` / `getContrastWithBlack`：极端值、正负方向
- `meetsWcagAa`：4.5 边界判定
