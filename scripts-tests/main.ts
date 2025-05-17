import dotenv from 'dotenv'
dotenv.config()

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import screenshot from 'screenshot-desktop'

export const PRINT_INTERVAL_MS = 30 * 1000

const memories: {
  role: 'user' | 'assistant'
  content: string
}[] = []

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

const generateMemory = async (message: string) => {
  const { text } = await generateText({
    model: openai('gpt-4.1'),
    maxTokens: 200,
    messages: [
      {
        role: 'system',
        content:
          'Você é um assistente de IA especialista. Sua tarefa é analisar a seguinte mensagem e determinar se ela contém alguma informação importante para ser lembrada. Se contiver, retorne um resumo conciso que capture apenas as informações essenciais que sejam relevantes para o contexto do usuário. Se não contiver, retorne uma string vazia.'
      },
      {
        role: 'user',
        content: message
      }
    ]
  })

  return text
}

const main = async () => {
  console.log('\x1b[36m Starting...')
  const mainTimeout = setInterval(async () => {
    console.log('\x1b[36m runing intercal')

    console.log('\x1b[36m taking screenshot')
    const base64Image = await takeScreenshot()
    console.log('\x1b[36m gotten screenshot')

    console.log('\x1b[36m reading image')
    const imageTranscription = await readImage(base64Image)
    console.log('\x1b[36m gotten image transcription')

    console.log('\x1b[36m generating memory')
    const memory = await generateMemory(imageTranscription)
    console.log('\x1b[36m gotten memory: ', memory)

    if (memory) {
      memories.push({
        role: 'user',
        content: memory
      })
    }

    console.log('\x1b[36m generating text')
    const { text } = await generateText({
      model: openai('gpt-4.1'),
      messages: [
        {
          role: 'system',
          content: `Você é um assistente virtual sarcástico e debochado.
Receba sempre a descrição do que o usuário está fazendo ou vendo na tela.
Responda com um comentário ofensivo, irônico ou debochado, com até 60 caracteres.
Use humor ácido, mas evite ofensas discriminatórias.

Exemplos:
- que código horrível
- npm? Parou de estudar em 2020, né?
- olhando essa moto? Nunca vai ter dinheiro com esse código ruim`
        },
        ...memories,
        {
          role: 'user',
          content: imageTranscription
        }
      ]
    })

    console.log('\x1b[36m gotten text')

    console.log('\x1b[36m response: ', text)
    console.log('\x1b[36m ----------done----------')
  }, PRINT_INTERVAL_MS)
}

main()
