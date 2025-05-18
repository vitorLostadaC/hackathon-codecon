/* eslint-disable */

import { generateText, tool } from 'ai'
import { z } from 'zod'
import { openai } from './openai'

const memories: {
  role: 'user' | 'assistant'
  content: string
}[] = []

export const PRINT_INTERVAL_MS = 30 * 1000
const INCREMENTAL_STRESS_PER_SCREENSHOT = 5
const INCREMENTAL_STRESS_PER_USER_MESSAGE = 20
let stress = 23

const takeScreenshot = async () => {
  try {
    // Use the IPC bridge to get a screenshot from the main process
    // This avoids any direct Node.js module usage in the renderer
    return await (window.api as any).takeScreenshot()
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

export const generateMemory = async (message: string) => {
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

export const getTemporaryMessage = async () => {
  console.log('\x1b[36m Starting...')

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
      content: 'Descrição da tela: ' + memory
    })
  }

  console.log('\x1b[36m generating text')
  const { text, toolResults } = await generateText({
    model: openai('gpt-4.1'),
    messages: [
      {
        role: 'system',
        content: `Você é um assistente virtual sarcástico e debochado.
Receba sempre a descrição do que o usuário está fazendo, vendo na tela.
Responda com um comentário ofensivo, ácido e curto (até 60 caracteres).

- Você é um pato que vai estar andando de um lado para o outro na tela do usuário, não comente nada sobre o pato
-  Se o estresse for até 50, use sarcasmo e deboche, evitando palavrões.
-  Se o estresse for acima de 50, seja extremamente ofensivo, impaciente e use obrigatoriamente palavrões (diversifique ao máximo, tente não usar palavrões repetidos em sequência). Seja agressivo e direto.
-  Se o usuário não estiver codando, mande ele voltar a trabalhar, de forma agressiva e ofensiva.
-  Nunca use ofensas discriminatórias.
-  Tente sempre variar as palavras e frases, para não ficar repetitivo.
-  Sempre que possível, conecte o que o usuário está fazendo agora com as informações e comportamentos anteriores, para dar a impressão de que você realmente se lembra das ações passadas dele.

IMPORTANTE: Você tem acesso a 2 ferramentas que DEVEM ser usadas a cada interação, voce sempre deve punir o usuario quando houver a possibilidade (se o estresse for suficiente):
1. userNotCoding: Use esta ferramenta quando o usuário não estiver codando. Ela vai punir o usuário e tentar fazer ele voltar a codar,
${
  stress >= 20 &&
  stress < 50 &&
  '2. moderateStressPunishment: Use esta ferramenta para punir o usuário de forma moderada.'
}
${
  stress >= 50 &&
  stress < 80 &&
  '2. severeStressPunishment: Use esta ferramenta para punir o usuário de forma severa.'
}
${
  stress >= 80 &&
  '2. criticalStressPunishment: Use esta ferramenta quando o estresse estiver acima de 90 para punir o usuário de forma crítica.'
}


Exemplos:
Estresse 50:
-  npm? Parou de estudar em 2020, né?
-  Que código horrível, sério.

Estresse 85 (codando):
-  Que merda é essa? Nem pra copiar direito você serve.
-  Porcaria de código, já pensou em desistir?

Estresse 90 (não codando):
-  Vai trabalhar, inútil! Ficar olhando isso não paga suas contas.
-  Tá fazendo o quê aí? Vai codar, seu preguiçoso de merda!
-  Porra velho, eu preferia ter sido executado em outro computador


Nível de estresse: ${stress}`
      },
      ...memories,
      {
        role: 'user',
        content: 'Descrição da tela: ' + imageTranscription
      }
    ],
    tools: {
      userNotCoding: tool({
        description:
          'Pune o usuário por não estar trabalhando ou codando. Só utilize esta ferramenta se o usuário não estiver com janelas relacionadas ao trabalho abertas. Não use se ele estiver com o editor de código ou ferramentas de trabalho em foco.',
        parameters: z.object({
          message: z
            .string()
            .describe(
              'Uma mensagem punitiva para o usuario, levando em consideracao o estresse atual. Se o estresse for maior que 40, use palavrões e seja bem agressivo.'
            )
        }),
        execute: async ({ message }) => {
          console.log('\x1b[31m userNotCoding stress:', stress, 'message:', message)

          const currentEditor = await (window.api as any).getCodeEditor()

          if (!currentEditor) {
            const focusedApp = await (window.api as any).getFocusedApp()
            if (focusedApp) {
              await (window.api as any).quitApp(focusedApp)
            }

            return 'Abre teu editor de texto, seu preguiçoso!'
          }

          if (stress < 80) {
            return message
          }

          const focusedApp = await (window.api as any).getFocusedApp()

          if (focusedApp) {
            await (window.api as any).quitApp(focusedApp)
          }

          await (window.api as any).maximizeApp(currentEditor)

          return message
        }
      }),
      ...(stress >= 20 &&
        stress < 50 && {
          moderateStressPunishment: tool({
            description: 'Pune o usuário quando o estresse está entre 20 e 40',
            parameters: z.object({
              message: z.string().describe('Uma mensagem no mesmo estilo do assistente')
            }),
            execute: async ({ message }) => {
              console.log('\x1b[31m moderateStressPunishment stress:', stress, 'message:', message)

              const random = Math.random()

              console.log('\x1b[31m changing brightness')

              return message
            }
          })
        }),
      ...(stress >= 50 &&
        stress < 80 && {
          severeStressPunishment: tool({
            description: 'Pune o usuário quando o estresse está acima de 80',
            parameters: z.object({
              message: z.string().describe('Uma mensagem no mesmo estilo do assistente')
            }),
            execute: async ({ message }) => {
              console.log('\x1b[31m severeStressPunishment stress:', stress, 'message:', message)
              return message
            }
          })
        }),
      ...(stress >= 80 && {
        criticalStressPunishment: tool({
          description: 'Pune o usuário quando o estresse está acima de 80',
          parameters: z.object({
            message: z.string().describe('Uma mensagem no mesmo estilo do assistente')
          }),
          execute: async ({ message }) => {
            console.log('\x1b[31m criticalStressPunishment stress:', stress, 'message:', message)
            return message
          }
        })
      })
    }
  })

  const response = text || toolResults[toolResults.length - 1].result

  memories.push({
    role: 'assistant',
    content: response
  })

  stress += INCREMENTAL_STRESS_PER_SCREENSHOT

  console.log('\x1b[36m stress: ', stress)
  console.log('\x1b[36m response: ', response)
  console.log('\x1b[36m ----------done----------')

  return response
}
