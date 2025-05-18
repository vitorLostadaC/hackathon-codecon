import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  screen,
  globalShortcut,
  desktopCapturer
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { exec as callbackExec } from 'child_process'
import { promisify } from 'util'
import dotenv from 'dotenv'

// Load environment variables in the main process
dotenv.config()

const exec = promisify(callbackExec)

let mainWindow: BrowserWindow | null = null

// Screenshot handler function using Electron's desktopCapturer
async function takeScreenshot(): Promise<string> {
  try {
    // Get all screens/sources
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: screen.getPrimaryDisplay().workAreaSize.width,
        height: screen.getPrimaryDisplay().workAreaSize.height
      }
    })

    if (sources.length === 0) {
      throw new Error('No screen sources found')
    }

    // Get the primary display (or first available)
    const primarySource = sources[0]

    // Get the thumbnail as base64
    const thumbnail = primarySource.thumbnail.toDataURL()
    return thumbnail
  } catch (err) {
    console.error('Error taking screenshot:', err)
    throw err
  }
}

// AI Tools functions moved from renderer to main process
async function getOpenedApps(): Promise<string[]> {
  try {
    if (process.platform === 'darwin') {
      const { stdout } = await exec(
        'osascript -e \'tell application "System Events" to get name of every process whose visible is true\''
      )
      const apps = stdout
        .split(', ')
        .map((app) => app.trim())
        .filter(Boolean)
      return apps
    } else if (process.platform === 'linux') {
      const { stdout } = await exec('ps -e -o comm')
      const apps = stdout
        .split('\n')
        .slice(1) // Skip header
        .map((line) => line.trim())
        .filter(Boolean)
        .map((app) => app.split('/').pop() || app) // Get just the app name without path
        .filter((app) => !app.startsWith('kworker') && !app.startsWith('systemd')) // Filter system processes
      return apps
    } else {
      throw new Error('Unsupported operating system')
    }
  } catch (err: unknown) {
    const error = err as Error
    console.error('Error getting opened apps:', error.message || error)
    throw error
  }
}

async function quitApp(app: string): Promise<void> {
  if (process.platform === 'darwin') {
    await exec(`osascript -e 'tell application "${app}" to quit'`)
  } else if (process.platform === 'linux') {
    await exec(`pkill -f "${app}"`)
  }
}

async function maximizeApp(app: string): Promise<void> {
  if (process.platform === 'darwin') {
    await exec(`osascript -e 'tell application "${app}" to activate'`)
    await exec(
      `osascript -e 'tell application "System Events" to set frontmost of process "${app}" to true'`
    )
  } else if (process.platform === 'linux') {
    await exec(`wmctrl -r "${app}" -b add,maximized_vert,maximized_horz`)
  }
}

async function getFocusedApp(): Promise<string | undefined> {
  if (process.platform === 'darwin') {
    const { stdout } = await exec(
      'osascript -e \'tell application "System Events" to get name of first application process whose frontmost is true\''
    )
    return stdout.trim()
  } else if (process.platform === 'linux') {
    try {
      const { stdout } = await exec('xdotool getwindowfocus getwindowname')
      return stdout.trim()
    } catch (err) {
      console.error('Error getting focused app on Linux:', err)
      return undefined
    }
  }
  return undefined
}

async function getCodeEditor(): Promise<string | undefined> {
  const apps = await getOpenedApps()

  const mostUsedCodeEditors = [
    'Cursor',
    'VSCode',
    'Visual Studio Code',
    'code',
    'JetBrains',
    'IntelliJ',
    'PyCharm',
    'WebStorm',
    'PhpStorm',
    'GoLand',
    'Rider',
    'WindSurf',
    'Sublime',
    'Atom',
    'Notepad++',
    'Vim',
    'Emacs',
    'Brackets'
  ]

  return mostUsedCodeEditors.find((editor) => apps.includes(editor))
}

function createWindow(): void {
  // Get screen dimensions
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: screenWidth, // Full width of screen
    height: 200, // Just tall enough for the duck
    x: 0, // Left edge of screen
    y: screenHeight - 100, // Bottom of screen
    transparent: true, // Transparent background so only duck shows
    frame: false, // No window frame (no title bar, etc.)
    alwaysOnTop: true, // Stay on top of other windows
    skipTaskbar: true, // Don't show in taskbar
    autoHideMenuBar: true,
    resizable: false, // Prevent resizing
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Make the window click-through except for the duck
  mainWindow.setIgnoreMouseEvents(true, { forward: true })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Allow duck to be clickable
  ipcMain.on('set-ignore-mouse-events', (_, ignore, options) => {
    mainWindow?.setIgnoreMouseEvents(ignore, options)
  })

  // Handle screenshot requests from renderer process
  ipcMain.handle('take-screenshot', async () => {
    try {
      return await takeScreenshot()
    } catch (error) {
      console.error('Error taking screenshot:', error)
      throw error
    }
  })

  // Handle AI tools IPC requests
  ipcMain.handle('get-opened-apps', async () => {
    try {
      return await getOpenedApps()
    } catch (error) {
      console.error('Error getting opened apps:', error)
      throw error
    }
  })

  ipcMain.handle('quit-app', async (_, app: string) => {
    try {
      await quitApp(app)
      return true
    } catch (error) {
      console.error(`Error quitting app ${app}:`, error)
      throw error
    }
  })

  ipcMain.handle('maximize-app', async (_, app: string) => {
    try {
      await maximizeApp(app)
      return true
    } catch (error) {
      console.error(`Error maximizing app ${app}:`, error)
      throw error
    }
  })

  ipcMain.handle('get-focused-app', async () => {
    try {
      return await getFocusedApp()
    } catch (error) {
      console.error('Error getting focused app:', error)
      throw error
    }
  })

  ipcMain.handle('get-code-editor', async () => {
    try {
      return await getCodeEditor()
    } catch (error) {
      console.error('Error getting code editor:', error)
      throw error
    }
  })

  // Additional shell commands handlers
  ipcMain.handle('execute-shell-command', async (_, command: string) => {
    try {
      const result = await exec(command)
      return result
    } catch (error) {
      console.error(`Error executing shell command: ${command}`, error)
      throw error
    }
  })

  ipcMain.handle('execute-apple-script', async (_, script: string) => {
    try {
      if (process.platform !== 'darwin') {
        throw new Error('AppleScript can only be executed on macOS')
      }
      const result = await exec(script)
      return result
    } catch (error) {
      console.error('Error executing AppleScript:', error)
      throw error
    }
  })

  // Handle environment variables requests
  ipcMain.handle('get-env', (_, key: string) => {
    return process.env[key] || null
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Unregister all shortcuts when app is quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
