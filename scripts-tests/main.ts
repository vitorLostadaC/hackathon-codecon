import dotenv from 'dotenv'
dotenv.config()

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { exec as callbackExec } from 'child_process'
import { promisify } from 'util'

import screenshot from 'screenshot-desktop'

const exec = promisify(callbackExec)

const takeScreenshot = async () => {
  try {
    const img = await screenshot()
    const base64Image = img.toString('base64')
    return `data:image/webp;base64,${base64Image}`
  } catch (err) {
    console.error('Error taking screenshot:', err)
    throw err
  }
}

const readImage = async (base64Image: string) => {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'O que você vê nesta imagem? Por favor, descreva em detalhes.'
            },
            {
              type: 'image',
              image: base64Image,
              providerOptions: {
                openai: { imageDetail: 'high' }
              }
            }
          ]
        }
      ]
    })

    return text
  } catch (err) {
    console.error('Error reading image:', err)
    throw err
  }
}

const openedApps = async (): Promise<string[]> => {
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
      // TODO: test on linux
      const { stdout } = await exec('ps -e -o comm')
      const apps = stdout
        .split('\n')
        .slice(1) // Skip header
        .map((line) => line.trim())
        .filter(Boolean)
        .map((app) => app.split('/').pop() || app) // Get just the app name without path
        .filter(
          (app) => !app.startsWith('kworker') && !app.startsWith('systemd')
        ) // Filter system processes
      return apps
    } else {
      throw new Error('Unsupported operating system')
    }
  } catch (err: any) {
    console.error('Error getting opened apps:', err.message || err)
    throw err
  }
}

const quitApp = async (app: string) => {
  if (process.platform === 'darwin') {
    exec(`osascript -e 'tell application "${app}" to quit'`)
  } else if (process.platform === 'linux') {
    exec(`pkill -f "${app}"`)
  }
}

const maximizeApp = async (app: string) => {
  if (process.platform === 'darwin') {
    exec(`osascript -e 'tell application "${app}" to activate'`)
    exec(
      `osascript -e 'tell application "System Events" to set frontmost of process "${app}" to true'`
    )
  } else if (process.platform === 'linux') {
    exec(`wmctrl -r "${app}" -b add,maximized_vert,maximized_horz`)
  }
}

const splitScreen = async (
  app: string,
  direction: 'left' | 'right' | 'top' | 'bottom'
) => {
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
          console.error('Invalid direction for macOS:', direction)
          throw new Error(`Invalid direction: ${direction}`)
      }

      scriptCoreLines.push(positionSetter, sizeSetter)
      scriptCoreLines.push(`    end tell`, `  end tell`, `end tell`)

      const osascriptArgs = scriptCoreLines
        .map((line) => `-e '${line.replace(/'/g, "'''")}'`)
        .join(' ')
      const command = `osascript ${osascriptArgs}`

      await exec(command)
      console.log(`App ${app} split ${direction} on macOS`)
    } catch (e: any) {
      const err = e as { message?: string; stderr?: string; cmd?: string }
      console.error(
        `Error splitting screen on macOS for app ${app}:`,
        err.message || e
      )
      if (err.stderr) {
        console.error('AppleScript execution error:', err.stderr)
      }
    }
  } else if (process.platform === 'linux') {
    try {
      const { stdout: dimOutput } = await exec(
        "xdpyinfo | grep dimensions | awk '{print $2}'"
      )
      const dimensions = dimOutput.trim().split('x')
      const screenWidth = parseInt(dimensions[0])
      const screenHeight = parseInt(dimensions[1])

      if (isNaN(screenWidth) || isNaN(screenHeight)) {
        console.error('Error parsing screen dimensions:', dimOutput)
        return
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
          console.error('Invalid direction for Linux:', direction)
          return
      }

      await exec(`wmctrl -R "${app}"`)
      await new Promise((resolve) => setTimeout(resolve, 300))

      try {
        await exec(`wmctrl -r :ACTIVE: -b remove,maximized_vert,maximized_horz`)
      } catch (e: any) {
        console.warn(
          `Could not unmaximize window (this might be okay): ${e.message || e}`
        )
      }
      await new Promise((resolve) => setTimeout(resolve, 100))

      const moveResizeCmd = `wmctrl -r :ACTIVE: -e 0,${x},${y},${w},${h}`
      await exec(moveResizeCmd)
      console.log(`App ${app} split ${direction} on Linux`)
    } catch (e: any) {
      const err = e as { message?: string; stderr?: string; cmd?: string }
      console.error(
        `Error splitting screen on Linux for app ${app}:`,
        err.message || e
      )
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
        console.error(
          'wmctrl command not found. Please ensure it is installed.'
        )
      } else if (err.message && err.message.includes('Cannot find window')) {
        console.error(`Window for application "${app}" not found by wmctrl.`)
      }
    }
  }
}

const openUrlOnGoogle = (url: string) => {
  if (process.platform === 'darwin') {
    exec(`open "${url}"`)
  } else if (process.platform === 'linux') {
    exec(`xdg-open "${url}"`)
  }
}

const main = async () => {
  // const base64Image = await takeScreenshot()
  // const text = await readImage(base64Image)
  // console.log(text)
  openUrlOnGoogle('https://www.youtube.com/watch?v=Zj3a5-0QYas')
}

main()
