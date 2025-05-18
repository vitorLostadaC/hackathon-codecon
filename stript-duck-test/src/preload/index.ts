import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Mouse event handling
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) =>
    ipcRenderer.send('set-ignore-mouse-events', ignore, options),

  // Take a screenshot using the main process
  takeScreenshot: async (): Promise<string> => {
    return await ipcRenderer.invoke('take-screenshot')
  },

  // AI tools functions
  getOpenedApps: async (): Promise<string[]> => {
    return await ipcRenderer.invoke('get-opened-apps')
  },

  quitApp: async (app: string): Promise<boolean> => {
    return await ipcRenderer.invoke('quit-app', app)
  },

  maximizeApp: async (app: string): Promise<boolean> => {
    return await ipcRenderer.invoke('maximize-app', app)
  },

  getFocusedApp: async (): Promise<string | undefined> => {
    return await ipcRenderer.invoke('get-focused-app')
  },

  getCodeEditor: async (): Promise<string | undefined> => {
    return await ipcRenderer.invoke('get-code-editor')
  },

  // Shell command execution
  executeShellCommand: async (command: string): Promise<{ stdout: string; stderr: string }> => {
    return await ipcRenderer.invoke('execute-shell-command', command)
  },

  executeAppleScript: async (script: string): Promise<{ stdout: string; stderr: string }> => {
    return await ipcRenderer.invoke('execute-apple-script', script)
  },

  // Environment variables
  getEnv: async (key: string): Promise<string | null> => {
    return await ipcRenderer.invoke('get-env', key)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
