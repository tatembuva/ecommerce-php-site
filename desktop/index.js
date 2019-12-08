const { app, BrowserWindow } = require('electron')

  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({ width: 1200, height: 600 })

    // and load the index.html of the app.
    win.loadURL('http://localhost:3001')
  }

  app.on('ready', createWindow)
