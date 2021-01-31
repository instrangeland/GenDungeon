import GameMenu from './GameMenu.js';

// noinspection JSUnresolvedVariable
export default class Preferences {
    static getPreferences() {
        window.ipc.send('getPreferences');
        window.ipc.receive('receivePreferences', response => {
            this.preferences = JSON.parse(response);
            GameMenu.isFullScreen = this.preferences.isFullScreen;
            GameMenu.setFullScreen();
        });
    }
}