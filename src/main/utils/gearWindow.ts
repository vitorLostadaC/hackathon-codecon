import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

const windowType = (): 'toolbar' | 'desktop' | 'dock' => {
  switch (process.platform) {
    case 'win32':
      return 'toolbar'
    case 'linux':
      return 'dock' // Use dock type for Linux to avoid desktop type issues
    default:
      return 'desktop'
  }
}

export function createGearWindow(): BrowserWindow {
  const display = screen.getPrimaryDisplay()
  const { width: screenWidth } = display.workAreaSize

  const gearWindow = new BrowserWindow({
    width: 48,
    height: 48,
    x: screenWidth - 68, // 20px from right edge
    y: 20, // 20px from top
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    hasShadow: false,
    type: windowType(),
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Load the gear icon page
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    gearWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/gear`)
  } else {
    gearWindow.loadFile(join(__dirname, '../renderer/gear.html'))
  }

  // Make sure window stays in the correct position
  gearWindow.setAlwaysOnTop(true, 'floating')

  // Show window after it's fully loaded and configured
  gearWindow.once('ready-to-show', () => {
    gearWindow.show()
  })

  // Prevent the window from being shown in Mission Control
  gearWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  return gearWindow
}
