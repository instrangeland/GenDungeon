import Leaderboard from './Leaderboard.js';

// noinspection JSUnresolvedVariable
export default class GameMenu {
    static showMainMenu() {
        $('#options-menu').hide();
        $('#leaderboard-screen').hide();
        $('#main-menu').show();
    }

    static showOptions() {
        $('#main-menu').hide();
        $('#options-menu').show();
    }

    static showLeaderboard() {
        $('#main-menu').hide();
        $('#leaderboard-screen').show();
        Leaderboard.update();
    }

    static closeGame() {
        window.ipc.send('closeGame');
    }

    static setFullScreen() {
        window.ipc.send('setFullScreen', this.isFullScreen);
        $('.fullscreen-button').html(`Fullscreen (${this.isFullScreen ? 'Enabled' : 'Disabled'})`);
    }

    static openWebsite() {
        window.ipc.send('openWebsite');
    }
}