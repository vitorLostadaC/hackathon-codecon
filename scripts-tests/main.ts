import dotenv from 'dotenv'
dotenv.config()

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { exec } from 'child_process'

import screenshot from 'screenshot-desktop'

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

const openedApps = async () => {
  try {
    return new Promise((resolve, reject) => {
      if (process.platform === 'darwin') {
        exec(
          'osascript -e \'tell application "System Events" to get name of every process whose visible is true\'',
          (error: any, stdout: string) => {
            if (error) {
              reject(error)
              return
            }
            const apps = stdout
              .split(', ')
              .map((app) => app.trim())
              .filter(Boolean)

            resolve(apps)
          }
        )
      } else if (process.platform === 'linux') {
        // TODO: test on linux
        exec('ps -e -o comm', (error: any, stdout: string) => {
          if (error) {
            reject(error)
            return
          }
          const apps = stdout
            .split('\n')
            .slice(1) // Skip header
            .map((line) => line.trim())
            .filter(Boolean)
            .map((app) => app.split('/').pop() || app) // Get just the app name without path
            .filter(
              (app) => !app.startsWith('kworker') && !app.startsWith('systemd')
            ) // Filter system processes
          resolve(apps)
        })
      } else {
        reject(new Error('Unsupported operating system'))
      }
    })
  } catch (err) {
    console.error('Error getting opened apps:', err)
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

const main = async () => {
  // const base64Image = await takeScreenshot()
  // const text = await readImage(base64Image)
  // console.log(text)

  console.log(await maximizeApp('Discord'))
}

main()
