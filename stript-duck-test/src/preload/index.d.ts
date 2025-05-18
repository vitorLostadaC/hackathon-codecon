import { ElectronAPI } from '@electron-toolkit/preload'

interface DuckAPI {
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void
  getDuckMessages: () => Promise<string[]>
  onNewMessage: (callback: (message: string) => void) => () => void
  takeScreenshot: () => Promise<string>

  // AI tools
  getOpenedApps: () => Promise<string[]>
  quitApp: (app: string) => Promise<boolean>
  maximizeApp: (app: string) => Promise<boolean>
  getFocusedApp: () => Promise<string | undefined>
  getCodeEditor: () => Promise<string | undefined>

  // Shell commands
  executeShellCommand: (command: string) => Promise<{ stdout: string; stderr: string }>
  executeAppleScript: (script: string) => Promise<{ stdout: string; stderr: string }>

  // Environment
  getEnv: (key: string) => Promise<string | null>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: DuckAPI
  }
}
