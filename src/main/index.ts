import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'
import * as log from 'electron-log'

// Configure logging
log.transports.file.level = 'info'
autoUpdater.logger = log

// Disable auto-download - we'll prompt user first
autoUpdater.autoDownload = false

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: 'Todo',
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    
    // Check for updates after window is shown (only in production)
    if (!is.dev) {
      setTimeout(() => {
        checkForUpdates(mainWindow)
      }, 2000)
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  
}

// Auto-update functions
function checkForUpdates(mainWindow: BrowserWindow) {
  log.info('Checking for updates...')
  autoUpdater.checkForUpdates()
  
  // Update events
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...')
  })
  
  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info)
    mainWindow.webContents.send('update-available', info)
    
    // Ask user if they want to download
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: `Version ${info.version} is available. Would you like to download it now?`,
      buttons: ['Yes', 'No'],
      defaultId: 0
    }).then(({ response }) => {
      if (response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
  })
  
  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available:', info)
    mainWindow.webContents.send('update-not-available', info)
  })
  
  autoUpdater.on('download-progress', (progress) => {
    log.info(`Download progress: ${progress.percent}%`)
    mainWindow.webContents.send('download-progress', progress)
  })
  
  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info)
    mainWindow.webContents.send('update-downloaded', info)
    
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Ready',
      message: 'Update downloaded. Restart now to install?',
      buttons: ['Restart', 'Later'],
      defaultId: 0
    }).then(({ response }) => {
      if (response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })
  
  autoUpdater.on('error', (err) => {
    log.error('Update error:', err)
    mainWindow.webContents.send('update-error', err.message)
  })
}

// IPC handlers for renderer to trigger updates
ipcMain.handle('check-for-updates', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) checkForUpdates(win)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})