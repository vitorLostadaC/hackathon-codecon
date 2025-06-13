import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { exec as callbackExec } from 'child_process'
import dotenv from 'dotenv'
import {
  app,
  BrowserWindow,
  desktopCapturer,
  globalShortcut,
  ipcMain,
  screen,
  shell
} from 'electron'
import { join } from 'path'
import { promisify } from 'util'
import icon from '../../resources/icon.png?asset'

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

async function lockScreen(): Promise<void> {
  try {
    if (process.platform === 'darwin') {
      await exec('pmset displaysleepnow')
    } else if (process.platform === 'linux') {
      await exec('xdg-screensaver lock')
    } else if (process.platform === 'win32') {
      await exec('rundll32.exe user32.dll,LockWorkStation')
    } else {
      throw new Error('Unsupported operating system')
    }
  } catch (err: unknown) {
    const error = err as Error
    console.error('Error locking screen:', error.message || error)
    throw error
  }
}

async function shutdownComputer(): Promise<void> {
  try {
    if (process.platform === 'darwin') {
      // For macOS, use the shutdown command with -h flag for immediate shutdown
      await exec('shutdown -h now')
    } else if (process.platform === 'linux') {
      // For Linux, use the shutdown command with -h flag for immediate shutdown
      await exec('shutdown -h now')
    } else if (process.platform === 'win32') {
      // For Windows, use the shutdown command with /s /t 0 for immediate shutdown
      await exec('shutdown /s /t 0')
    } else {
      throw new Error('Unsupported operating system')
    }
  } catch (err: unknown) {
    const error = err as Error
    console.error('Error shutting down computer:', error.message || error)
    throw error
  }
}

async function splitScreen(
  app: string,
  direction: 'left' | 'right' | 'top' | 'bottom'
): Promise<void> {
  if (process.platform === 'darwin') {
    try {
      const escapedAppForAppleScriptString = app.replace(/"/g, '\\"')

      const scriptCoreLines = [
        `set _app_name to "${escapedAppForAppleScriptString}"`,
        `tell application "System Events"`,
        `  tell application "Finder"`,
        `    set desktopBounds to bounds of window of desktop`,
        `  end tell`,
        `  set screenX to item 1 of desktopBounds`,
        `  set screenY to item 2 of desktopBounds`,
        `  set screenWidth to (item 3 of desktopBounds) - screenX`,
        `  set screenHeight to (item 4 of desktopBounds) - screenY`,
        `  tell application _app_name to activate`,
        `end tell`,
        `delay 0.5`,
        `tell application "System Events"`,
        `  tell process _app_name`,
        `    if not (exists window 1) then error "Application " & _app_name & " has no windows."`,
        `    set frontmost to true`,
        `    tell window 1`
      ]

      let positionSetter = ''
      let sizeSetter = ''

      switch (direction) {
        case 'left':
          positionSetter = `set position to {screenX, screenY}`
          sizeSetter = `set size to {(screenWidth / 2) as integer, screenHeight}`
          break
        case 'right':
          positionSetter = `set position to {screenX + (screenWidth / 2) as integer, screenY}`
          sizeSetter = `set size to {(screenWidth / 2) as integer, screenHeight}`
          break
        case 'top':
          positionSetter = `set position to {screenX, screenY}`
          sizeSetter = `set size to {screenWidth, (screenHeight / 2) as integer}`
          break
        case 'bottom':
          positionSetter = `set position to {screenX, screenY + (screenHeight / 2) as integer}`
          sizeSetter = `set size to {screenWidth, (screenHeight / 2) as integer}`
          break
        default:
          throw new Error(`Invalid direction: ${direction}`)
      }

      scriptCoreLines.push(positionSetter, sizeSetter)
      scriptCoreLines.push(`    end tell`, `  end tell`, `end tell`)

      const osascriptArgs = scriptCoreLines
        .map((line) => `-e '${line.replace(/'/g, "'''")}'`)
        .join(' ')
      const command = `osascript ${osascriptArgs}`

      await exec(command)
    } catch (e: any) {
      const err = e as { message?: string; stderr?: string; cmd?: string }
      console.error(`Error splitting screen on macOS for app ${app}:`, err.message || e)
      if (err.stderr) {
        console.error('AppleScript execution error:', err.stderr)
      }
      throw err
    }
  } else if (process.platform === 'linux') {
    try {
      const { stdout: dimOutput } = await exec("xdpyinfo | grep dimensions | awk '{print $2}'")
      const dimensions = dimOutput.trim().split('x')
      const screenWidth = parseInt(dimensions[0])
      const screenHeight = parseInt(dimensions[1])

      if (isNaN(screenWidth) || isNaN(screenHeight)) {
        throw new Error('Error parsing screen dimensions: ' + dimOutput)
      }

      let x, y, w, h
      switch (direction) {
        case 'left':
          x = 0
          y = 0
          w = Math.round(screenWidth / 2)
          h = screenHeight
          break
        case 'right':
          x = Math.round(screenWidth / 2)
          y = 0
          w = Math.round(screenWidth / 2)
          h = screenHeight
          break
        case 'top':
          x = 0
          y = 0
          w = screenWidth
          h = Math.round(screenHeight / 2)
          break
        case 'bottom':
          x = 0
          y = Math.round(screenHeight / 2)
          w = screenWidth
          h = Math.round(screenHeight / 2)
          break
        default:
          throw new Error(`Invalid direction: ${direction}`)
      }

      await exec(`wmctrl -R "${app}"`)
      await new Promise((resolve) => setTimeout(resolve, 300))

      try {
        await exec(`wmctrl -r :ACTIVE: -b remove,maximized_vert,maximized_horz`)
      } catch (e: any) {
        console.warn(`Could not unmaximize window (this might be okay): ${e.message || e}`)
      }
      await new Promise((resolve) => setTimeout(resolve, 100))

      const moveResizeCmd = `wmctrl -r :ACTIVE: -e 0,${x},${y},${w},${h}`
      await exec(moveResizeCmd)
    } catch (e: any) {
      const err = e as { message?: string; stderr?: string; cmd?: string }
      console.error(`Error splitting screen on Linux for app ${app}:`, err.message || e)
      if (err.stderr) {
        console.error('Shell command execution error:', err.stderr)
      }
      if (
        err.message &&
        (err.message.includes('wmctrl: not found') ||
          (err.message.includes('No such file or directory') &&
            err.cmd &&
            err.cmd.includes('wmctrl')))
      ) {
        throw new Error('wmctrl command not found. Please ensure it is installed.')
      } else if (err.message && err.message.includes('Cannot find window')) {
        throw new Error(`Window for application "${app}" not found by wmctrl.`)
      }
      throw err
    }
  } else {
    throw new Error('Unsupported operating system')
  }
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

  ipcMain.handle(
    'split-screen',
    async (_, app: string, direction: 'left' | 'right' | 'top' | 'bottom') => {
      try {
        await splitScreen(app, direction)
        return true
      } catch (error) {
        console.error(`Error splitting screen for ${app}:`, error)
        throw error
      }
    }
  )

  ipcMain.handle('shutdown-computer', async () => {
    try {
      await shutdownComputer()
      return true
    } catch (error) {
      console.error('Error shutting down computer:', error)
      throw error
    }
  })

  ipcMain.handle('lock-screen', async () => {
    try {
      await lockScreen()
      return true
    } catch (error) {
      console.error('Error locking screen:', error)
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
