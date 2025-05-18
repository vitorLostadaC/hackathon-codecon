/* eslint-disable */

export const openedApps = async (): Promise<string[]> => {
  try {
    return await (window.api as any).getOpenedApps()
  } catch (err) {
    console.error('Error getting opened apps:', err)
    throw err
  }
}

export const quitApp = async (app: string) => {
  try {
    return await (window.api as any).quitApp(app)
  } catch (err) {
    console.error(`Error quitting app ${app}:`, err)
    throw err
  }
}

export const maximizeApp = async (app: string) => {
  try {
    return await (window.api as any).maximizeApp(app)
  } catch (err) {
    console.error(`Error maximizing app ${app}:`, err)
    throw err
  }
}

export const splitScreen = async (app: string, direction: 'left' | 'right' | 'top' | 'bottom') => {
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

      await (window.api as any).executeAppleScript(command)
    } catch (e: any) {
      const err = e as { message?: string; stderr?: string; cmd?: string }
      console.error(`Error splitting screen on macOS for app ${app}:`, err.message || e)
      if (err.stderr) {
        console.error('AppleScript execution error:', err.stderr)
      }
    }
  } else if (process.platform === 'linux') {
    try {
      const { stdout: dimOutput } = await (window.api as any).executeShellCommand(
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

      await (window.api as any).executeShellCommand(`wmctrl -R "${app}"`)
      await new Promise((resolve) => setTimeout(resolve, 300))

      try {
        await (window.api as any).executeShellCommand(
          `wmctrl -r :ACTIVE: -b remove,maximized_vert,maximized_horz`
        )
      } catch (e: any) {
        console.warn(`Could not unmaximize window (this might be okay): ${e.message || e}`)
      }
      await new Promise((resolve) => setTimeout(resolve, 100))

      const moveResizeCmd = `wmctrl -r :ACTIVE: -e 0,${x},${y},${w},${h}`
      await (window.api as any).executeShellCommand(moveResizeCmd)
      console.log(`App ${app} split ${direction} on Linux`)
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
        console.error('wmctrl command not found. Please ensure it is installed.')
      } else if (err.message && err.message.includes('Cannot find window')) {
        console.error(`Window for application "${app}" not found by wmctrl.`)
      }
    }
  }
}

export const openUrlOnGoogle = (url: string) => {
  try {
    if (process.platform === 'darwin') {
      ;(window.api as any).executeShellCommand(`open "${url}"`)
    } else if (process.platform === 'linux') {
      ;(window.api as any).executeShellCommand(`xdg-open "${url}"`)
    }
  } catch (err) {
    console.error(`Error opening URL ${url}:`, err)
  }
}

export const getFocusedApp = async () => {
  try {
    return await (window.api as any).getFocusedApp()
  } catch (err) {
    console.error('Error getting focused app:', err)
    throw err
  }
}

export const getBrowser = async () => {
  // I know there are other smarter ways to build it, but for the hackathon, I will keep it like this. Just to focus my time on the other parts.

  const apps = await openedApps()

  const mostUsedBrowsers = [
    'Google Chrome',
    'Firefox',
    'Safari',
    'Edge',
    'Arc',
    'Brave',
    'Opera',
    'Arc',
    'Zen'
  ]

  const currentBrowser = mostUsedBrowsers.find((browser) => apps.includes(browser))

  return currentBrowser
}

export const getCodeEditor = async () => {
  try {
    return await (window.api as any).getCodeEditor()
  } catch (err) {
    console.error('Error getting code editor:', err)
    throw err
  }
}
