const {contextBridge } = require('electron');

contextBridge.exposeInMainWorld("timerAPI", {
    //for future features like notifications
});