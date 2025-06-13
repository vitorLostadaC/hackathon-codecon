/// <reference types="vite/client" />

declare module '*.svg' {
  const svgContent: string
  export default svgContent
}

declare module '*.png' {
  const pngContent: string
  export default pngContent
}

declare module '*.jpg' {
  const jpgContent: string
  export default jpgContent
}

declare module '*.jpeg' {
  const jpegContent: string
  export default jpegContent
}

declare module '*.gif' {
  const gifContent: string
  export default gifContent
}

declare module '*.webp' {
  const webpContent: string
  export default webpContent
}
