// ProceduralTA is licensed under GNU General Public License v3.0.

const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    receive: (channel, callback) => {
        ipcRenderer.on(channel, (event, args) => {
            callback(args);
        })
    }
});