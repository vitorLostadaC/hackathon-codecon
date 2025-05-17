import dotenv from 'dotenv'
dotenv.config()

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

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

const main = async () => {
  // const base64Image = await takeScreenshot()
  // const text = await readImage(base64Image)
  // console.log(text)
}

main()
