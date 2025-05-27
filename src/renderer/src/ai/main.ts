import { catchError } from '@renderer/lib/utils'
import { generateText } from 'ai'
import { openai } from '../services/openai'
import type { AiResponse, GetScreenContextReplyResponse, Memory } from './types/ai'

const safeMode = false

let shortTimeMemories: Memory[] = []

const longTimeMemories: Memory[] = []

// Stress system
// TODO: Implement stress system
// const INCREMENTAL_STRESS = 5
// let stress = 0

const readImage = async (base64Image: string): Promise<AiResponse<string>> => {
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
      usage,
      response: text
    }
  } catch (err) {
    console.error('Error reading image:', err)
    throw err
  }
}

export const generateShortMemory = async (message: string): Promise<AiResponse<string>> => {
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

  return {
    usage,
    response: text
  }
}

export const generateLongMemory = async (
  shortTimeMemory: Memory[]
): Promise<AiResponse<string>> => {
  const { text, usage } = await generateText({
    model: openai('gpt-4.1-nano'),
    maxTokens: 150,
    messages: [
      {
        role: 'system',
        content: `Você é um assistente de memória. Sua tarefa é ler uma lista de memórias de curto prazo e criar um resumo curto e claro, destacando apenas os fatos mais importantes e únicos. Ignore detalhes repetidos ou irrelevantes. Resuma tudo em uma frase. Responda apenas em português. Não inclua exemplos na resposta, apenas o resumo.

Exemplo:

Entrada:

O usuário adicionou um novo contato chamado João na lista de contatos.
O usuário abriu a página de configurações do aplicativo.
O usuário tentou adicionar um contato, mas esqueceu de preencher o telefone.
O usuário adicionou um novo contato chamado João na lista de contatos.

Saída:
O usuário adicionou o contato João e abriu a página de configurações.
`
      },
      {
        role: 'user',
        content: shortTimeMemory
          .filter((memory) => memory.role === 'user')
          .map((memory) => memory.content)
          .join('\n')
      }
    ]
  })
  return {
    usage,
    response: text
  }
}

export const generateSwearingText = async (
  imageTranscription: string
): Promise<AiResponse<string>> => {
  const { text, usage } = await generateText({
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
        content: `Descrição da tela: ${imageTranscription}`
      },
      ...shortTimeMemories
    ]
  })

  return {
    usage,
    response: text
  }
}

export const getScreenContextReply = async (): Promise<GetScreenContextReplyResponse | null> => {
  console.log('\x1b[36m taking screenshot')

  const [base64ImageError, base64Image] = await catchError(window.api.takeScreenshot())

  if (base64ImageError) {
    console.error('Error taking screenshot:', base64ImageError)
    return null // TODO: replate this with a better error handling when implement the api
  }

  console.log('\x1b[36m reading image')
  const [imageTranscriptionError, imageTranscriptionResult] = await catchError(
    readImage(base64Image)
  )

  if (imageTranscriptionError) {
    console.error('Error reading image:', imageTranscriptionError)
    return null // TODO: replate this with a better error handling when implement the api
  }

  console.log('\x1b[33m image transcription: ', imageTranscriptionResult.response)

  console.log('\x1b[36m generating memory and text')

  const [[, memoryResult], [responseResultError, responseResult], [, longMemoryResult]] =
    await Promise.all([
      catchError(generateShortMemory(imageTranscriptionResult.response)),
      catchError(generateSwearingText(imageTranscriptionResult.response)),
      ...(shortTimeMemories.length === 10
        ? [catchError(generateLongMemory(shortTimeMemories))]
        : [])
    ])

  if (longMemoryResult) {
    if (longTimeMemories.length === 6) {
      longTimeMemories.shift()
    }

    longTimeMemories.push({
      role: 'user',
      content: longMemoryResult.response,
      date: new Date().toISOString()
    })
    shortTimeMemories = shortTimeMemories.slice(0, 10)
  }

  if (memoryResult?.response) {
    shortTimeMemories.push({
      role: 'user',
      content: `Descrição da tela: ${memoryResult.response}`,
      date: new Date().toISOString()
    })
  }

  const responseText = responseResultError
    ? 'puta que pariu, deu ruim aqui (500). Aparentemente o dev que fez essa IA não sabe programar tb.'
    : responseResult?.response

  shortTimeMemories.push({
    role: 'assistant',
    content: responseText,
    date: new Date().toISOString()
  })

  console.log('\x1b[33m response: ', responseResult)
  console.log('\x1b[33m result: ', responseText)
  console.log('\x1b[36m ----------done----------')

  const tokens = {
    'gpt-4.1-nano': {
      input:
        imageTranscriptionResult.usage.promptTokens +
        (memoryResult?.usage.promptTokens ?? 0) +
        (longMemoryResult?.usage.promptTokens ?? 0),
      output:
        (responseResult?.usage.completionTokens ?? 0) +
        (memoryResult?.usage.completionTokens ?? 0) +
        (longMemoryResult?.usage.completionTokens ?? 0)
    },
    'gpt-4.1': {
      input: responseResult?.usage.promptTokens ?? 0,
      output: responseResult?.usage.completionTokens ?? 0
    }
  }

  console.log(tokens)
  console.log(shortTimeMemories)

  return {
    tokens,
    response: responseText
  }
}
