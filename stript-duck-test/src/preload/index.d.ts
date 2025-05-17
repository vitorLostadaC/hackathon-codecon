import { ElectronAPI } from '@electron-toolkit/preload'

interface DuckAPI {
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void
  getDuckMessages: () => Promise<string[]>
  onNewMessage: (callback: (message: string) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: DuckAPI
  }
}
