import fs from 'fs'
import screenshot from 'screenshot-desktop'

const takeScreenshot = async () => {
  try {
    const img = await screenshot()
    // You can save the screenshot to a file
    fs.writeFileSync('screenshot.png', img)
    console.log('Screenshot taken and saved as screenshot.png')
  } catch (err) {
    console.error('Error taking screenshot:', err)
  }
}

const main = () => {
  takeScreenshot()
}

main()
