import React, { useEffect, useState } from 'react'
declare global {
  interface Window {
    electronUpdater: {
      onUpdateAvailable: (callback: (info: any) => void) => void;
      onDownloadProgress: (callback: (progress: any) => void) => void;
      onUpdateDownloaded: (callback: () => void) => void;
      onUpdateError?: (callback: (error: string) => void) => void;
      checkForUpdates?: () => Promise<void>;
    }
  }
}

interface ProgressInfo {
  percent: number
  bytesPerSecond: number
  total: number
  transferred: number
}

const UpdateNotification: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    // Listen for update events from main process
    // Use 'electronUpdater' instead of 'electronAPI'
    if (window.electronUpdater) {
      window.electronUpdater.onUpdateAvailable((info: any) => {
        console.log('Update available:', info)
        setUpdateAvailable(true)
      })
      
      window.electronUpdater.onDownloadProgress((progress: ProgressInfo) => {
        setDownloadProgress(Math.round(progress.percent))
      })
      
      window.electronUpdater.onUpdateDownloaded(() => {
        setDownloadProgress(null)
        setUpdateReady(true)
      })
    }
  }, [])

  if (!updateAvailable && !downloadProgress && !updateReady) return null

  return (
    <div className="update-notification">
      {updateAvailable && (
        <div className="update-message">
          ⬇️ New version available! Downloading...
        </div>
      )}
      
      {downloadProgress !== null && (
        <div className="update-progress">
          Downloading: {downloadProgress}%
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}
      
      {updateReady && (
        <div className="update-ready">
          ✅ Update ready! Restart to apply.
        </div>
      )}
    </div>
  )
}

export default UpdateNotification