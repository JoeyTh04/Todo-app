import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    electronUpdater: {
      onUpdateAvailable: (callback: (info: any) => void) => void
      onUpdateNotAvailable: (callback: (info: any) => void) => void
      onDownloadProgress: (callback: (progress: any) => void) => void
      onUpdateDownloaded: (callback: (info: any) => void) => void
      onUpdateError: (callback: (error: string) => void) => void
      checkForUpdates: () => Promise<void>
    }
  }
}
