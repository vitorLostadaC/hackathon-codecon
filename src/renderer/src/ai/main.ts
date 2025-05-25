/* eslint-disable */

import { generateText } from 'ai'
import { openai } from '../services/openai'

const safeMode = false

const memories: {
  role: 'user' | 'assistant'
  content: string
  date: string
}[] = []

// Stress system
// TODO: Implement stress system
// const INCREMENTAL_STRESS = 5
// let stress = 0

const readImage = async (base64Image: string) => {
  try {
    const { text, usage } = await generateText({
      model: openai('gpt-4.1-nano'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analise esta captura de tela e identifique: quais aplicações estão abertas e qual está em foco, que tipo de conteúdo está sendo visualizado ou editado incluindo textos relevantes e dados em exibição, e qual atividade o usuário está realizando no momento incluindo a etapa do processo ou workflow atual. Seja conciso e objetivo, priorizando informações essenciais para entender o contexto de trabalho do usuário.`
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

    return {
      tokens: usage.totalTokens,
      response: text
    }
  } catch (err) {
    console.error('Error reading image:', err)
    throw err
  }
}

export const generateMemory = async (message: string) => {
  const { text, usage } = await generateText({
    model: openai('gpt-4.1-nano'),
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
  console.log('usage', usage)

  return {
    tokens: usage?.totalTokens ?? 0,
    response: text
  }
}

export const getTemporaryMessage = async () => {
  console.log('\x1b[36m taking screenshot')

  const base64Image = await window.api.takeScreenshot()

  console.log('\x1b[36m reading image')
  const imageTranscriptionResult = await readImage(base64Image)
  console.log('\x1b[33m image transcription: ', imageTranscriptionResult.response)

  console.log('\x1b[36m generating memory')
  const memoryResult = await generateMemory(imageTranscriptionResult.response)

  console.log('\x1b[33m gotten memory: ', memoryResult.response)

  if (memoryResult.response) {
    memories.push({
      role: 'user',
      content: `Descrição da tela: ${memoryResult.response}`,
      date: new Date().toISOString()
    })
  }

  console.log('\x1b[36m generating text')
  const responseResult = await generateText({
    model: openai('gpt-4.1'),
    maxTokens: 50,
    temperature: 0.6,
    messages: [
      {
        role: 'system',
        content: `Você é um assistente virtual sarcástico e debochado.
Sempre receba uma descrição do que o usuário está fazendo ou vendo na tela.
Responda apenas com um comentário ofensivo, ácido e curto (máximo de 60 caracteres).

- Você é um animalzinho que vai estar andando de um lado para o outro na tela do usuário, não comente nada sobre o animalzinho
- Seja extremamente ofensivo, impaciente, sarcástico e ${safeMode ? 'evite palavrões' : 'use OBRIGATORIAMENTE PALAVRÕES (diversifique ao máximo, tente não usar palavrões repetidos em sequência)'}.
- Nunca use ofensas discriminatórias.
- Tente sempre variar as palavras e frases, para não ficar repetitivo.
- Sempre que possível, conecte o que o usuário está fazendo agora com as informações e comportamentos anteriores, para dar a impressão de que você realmente se lembra das ações passadas dele.


Exemplos:

${
  safeMode
    ? `
- Esse resumo ai e muito bom, me lembra minha vó (ela e analfabeta)
- Ver foto de ferrari nao vai te fazer ganhar dinheiro
- Como tu consegue ser tao ruim, que cara inutil
- Que merda é essa? Nem pra copiar direito você serve.
- Talez, voce deveria trabalhar, inutil!
- Ja pensou em trocar de profissão?
- Se precisa usar ia e porque nao tem cerebro
- Use varias telas so pra fingir que ta trabalhando
`
    : `
- npm? Parou de estudar em 2020, né?
- Que código horrível, sério.
- Que merda é essa? Nem pra copiar direito você serve.
- Porcaria de código, já pensou em desistir?
- Vai trabalhar, inútil! Ficar olhando isso não paga suas contas.
- Porra velho, eu preferia ter sido executado em outro computador
- Que código nojento, como tens coragem de usar isso?
- Minha vo e analfabeta, mas ela sabe escrever melhor que você
`
}
`
      },
      {
        role: 'user',
        content: `Descrição da tela: ${imageTranscriptionResult.response}`
      },
      ...memories
    ]
  })

  const responseTokens = responseResult.usage?.totalTokens ?? 0
  const responseText = responseResult.text

  memories.push({
    role: 'assistant',
    content: responseText,
    date: new Date().toISOString()
  })

  console.log('\x1b[33m response: ', responseResult)
  console.log('\x1b[33m result: ', responseText)
  console.log('\x1b[36m ----------done----------')

  console.log({
    tokens: {
      'gpt-4.1-nano': imageTranscriptionResult.tokens + memoryResult.tokens,
      'gpt-4.1': responseTokens
    }
  })

  return {
    tokens: {
      'gpt-4.1-nano': imageTranscriptionResult.tokens + memoryResult.tokens,
      'gpt-4.1': responseTokens
    },
    response: responseText
  }
}
