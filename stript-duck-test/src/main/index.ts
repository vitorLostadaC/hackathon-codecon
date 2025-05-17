import { app, shell, BrowserWindow, ipcMain, screen, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null = null
let chatWindow: BrowserWindow | null = null

// Sample duck messages - in a real app, these would come from an API
const duckMessages = [
  'Quack! Need help with your code?',
  'Did you remember to commit your changes?',
  "Take a break! You've been coding for a while.",
  'Have you tried turning it off and on again?',
  'Remember to stay hydrated while coding!',
  "Quack! Don't forget to write tests for your code.",
  "Maybe it's time to refactor this function?",
  'Quack quack! Your code looks great today!'
]

// This would be the actual API integration in a real app
async function fetchDuckMessagesFromAPI(): Promise<string[]> {
  // In a real implementation, this would be an API call
  // For now, we're just returning the sample messages
  return duckMessages
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

// Function to create a chat window to interact with the duck
function createChatWindow(): void {
  if (chatWindow) {
    // If window already exists, just focus it
    chatWindow.focus()
    return
  }

  // Get screen dimensions for positioning
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize

  // Create the chat window
  chatWindow = new BrowserWindow({
    width: 400,
    height: 500,
    x: screenWidth - 450, // Position near right edge
    y: screenHeight - 600, // Position above the duck
    title: 'Chat with Duck',
    resizable: true,
    minimizable: true,
    maximizable: false,
    alwaysOnTop: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Load the chat interface
  // For now, we'll reuse the main page, but in a real app
  // you would have a specific chat interface HTML file
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    chatWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#chat')
  } else {
    chatWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'chat' })
  }

  // Handle window closed event
  chatWindow.on('closed', () => {
    chatWindow = null
  })
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

  // Register global shortcut to open the chat window
  globalShortcut.register('CommandOrControl+D', () => {
    // Open the chat window when Ctrl+D is pressed
    createChatWindow()

    // Send a notification to the duck to show a message about the chat window
    if (mainWindow) {
      const chatMessage = "Quack! I'm ready to chat with you. What's on your mind?"
      mainWindow.webContents.send('new-duck-message', chatMessage)
    }
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Allow duck to be clickable
  ipcMain.on('set-ignore-mouse-events', (_, ignore, options) => {
    mainWindow?.setIgnoreMouseEvents(ignore, options)
  })

  // Handle duck message requests
  ipcMain.handle('get-duck-messages', async () => {
    try {
      return await fetchDuckMessagesFromAPI()
    } catch (error) {
      console.error('Error fetching duck messages:', error)
      return duckMessages // Fallback to default messages
    }
  })

  // Handle messages sent to the duck from the chat window
  ipcMain.on('send-message-to-duck', (_, message) => {
    if (mainWindow) {
      mainWindow.webContents.send('new-duck-message', message)
    }
  })

  createWindow()

  // In a real app, you might set up polling or a websocket to get new messages
  // This is just a simulation of receiving new messages periodically
  if (mainWindow) {
    // Simulate receiving new messages every 30-60 seconds
    setInterval(() => {
      if (mainWindow && Math.random() > 0.7 && !chatWindow) {
        // 30% chance to send a message, but only if chat window is not open
        const randomMessage = duckMessages[Math.floor(Math.random() * duckMessages.length)]
        mainWindow.webContents.send('new-duck-message', randomMessage)
      }
    }, 30000)
  }

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
