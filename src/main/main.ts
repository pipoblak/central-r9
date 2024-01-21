import { BrowserWindow, app, ipcMain, shell } from 'electron';
import { Client, utils } from 'openrgb-sdk';
import path from 'path';
import { v4 } from 'uuid';
import { WebSocket, WebSocketServer } from 'ws';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const colorByMode: any = {
  fenomeno: utils.color(255, 64, 0),
  brasil: utils.color(255, 64, 0),
  cruzeiro: utils.color(0, 0, 255),
  valladolid: utils.color(255, 0, 255),
  gaming: utils.color(255, 0, 255),
};

// Board serial for OpenRGB
const configById: any = {
  '1': {
    serial: '0x57010100',
    url: 'r9-gaming.local',
  },
  '3': {
    serial: '0x57010100',
    url: 'r9-stream.local',
  },
};

async function connectAndSendCommand(id: string, color: string) {
  try {
    const config = configById[id];
    if (config) {
      const client = new Client('r9Central', 6742, config.url);

      await client.connect();
      const amount = await client.getControllerCount();
      let deviceList = [];
      for (let deviceId = 0; deviceId < amount; deviceId++) {
        deviceList.push(await client.getControllerData(deviceId));
      }
      const promises = [];
      for (let i = 0; i < deviceList?.length; i += 1) {
        try {
          const device = deviceList[i];
          const modeName = 'Static';
          let mode = device.modes.find((mode) =>
            [modeName].includes(mode.name)
          );
          if (!mode)
            mode = device.modes.find(
              (mode) =>
                ['Color Shift', 'Direct'].includes(mode.name) &&
                mode?.colors.length > 0
            );
          if (mode) {
            const colors = Array(mode.colors.length).fill(color);
            promises.push(
              client.updateMode(device.deviceId, mode.name, { colors })
            );
          }
        } catch (error) {}
      }
      await Promise.all(promises);
      await client.disconnect();
    }
  } catch (err) {}
}

const port = 8080;
const wss = new WebSocketServer({ port });

const wsClients = new Map<WebSocket, string>();

const broadcastMessage = (message: string): void => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

wss.on('connection', function connection(ws) {
  wsClients.set(ws, v4());
  ws.on('error', console.error);
  ws.on('message', function message(message) {
    const origin = wsClients.get(ws);
    try {
      const parsed = JSON.parse(message.toString());
      if (parsed?.currentPlayingMode) {
        const color =
          colorByMode[parsed.currentPlayingMode] || colorByMode.fenomeno;

        connectAndSendCommand('1', color);
        connectAndSendCommand('3', color);
      }
    } catch (err) {}
    broadcastMessage(JSON.stringify({ origin, message: message.toString() }));
  });
  ws.on('close', () => {
    console.log(`Client ${wsClients.get(ws)} disconnected.`);
    wsClients.delete(ws);
  });
});

console.log(`✅ Running WSS Server at ${port}`);
let windows: Map<string, BrowserWindow> = new Map();

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  // require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const addWindow = async (window: any) => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const newWindow = new BrowserWindow({
    show: false,
    width: window.width,
    height: window.height,
    x: window.x,
    y: window.y,
    icon: getAssetPath('icon.png'),
    frame: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      additionalArguments: [`id=${window.id}&resources_path=${RESOURCES_PATH}`],
      webSecurity: false,
    },
    alwaysOnTop: false,
    enableLargerThanScreen: true,
    fullscreen: false,
    maximizable: false,
  });

  newWindow.loadURL(
    `${resolveHtmlPath('index.html')}?id=${
      window.id
    }&resources_path=${RESOURCES_PATH}`
  );

  newWindow.on('ready-to-show', () => {
    if (!newWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      newWindow.minimize();
    } else {
      newWindow.show();
    }
  });

  newWindow.on('closed', () => {
    windows.delete(window.id);
  });

  const menuBuilder = new MenuBuilder(newWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  newWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  windows.set(window.id, newWindow);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    // Add screen #1(Left)
    addWindow({
      id: '1',
      width: 275,
      height: 960,
      x: 0,
      y: 0,
    });

    // Add screen #2(Center)
    addWindow({
      id: '2',
      width: 480,
      height: 1920,
      x: 276,
      y: 0,
    });

    // Add screen #3(Right)
    addWindow({
      id: '3',
      width: 275,
      height: 960,
      x: 276 + 481,
      y: 0,
    });
  })
  .catch(console.log);
