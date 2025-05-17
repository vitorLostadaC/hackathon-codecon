import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Mouse event handling
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) =>
    ipcRenderer.send('set-ignore-mouse-events', ignore, options),

  // Duck message API - for future integration with external message API
  getDuckMessages: () => ipcRenderer.invoke('get-duck-messages'),

  // Subscribe to new messages (for real-time updates)
  onNewMessage: (callback: (message: string) => void): (() => void) => {
    const newMessageListener = (_event: Electron.IpcRendererEvent, message: string): void => {
      callback(message)
    }

    ipcRenderer.on('new-duck-message', newMessageListener)

    // Return a function to remove the listener
    return () => {
      ipcRenderer.removeListener('new-duck-message', newMessageListener)
    }
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
