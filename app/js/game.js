import GameMenu from './modules/GameMenu.js';
import Preferences from './modules/Preferences.js';

$(() => {
    Preferences.getPreferences();
});

$('.options-button').on('click', () => {
    GameMenu.showOptions();
});

$('.leaderboard-button').on('click', () => {
    GameMenu.showLeaderboard();
});

$('.quit-button').on('click', () => {
    GameMenu.closeGame();
});

$('.fullscreen-button').on('click', () => {
    GameMenu.isFullScreen = !GameMenu.isFullScreen;
    console.log(GameMenu.isFullScreen);
    GameMenu.setFullScreen();
});

$('.back-button').on('click', () => {
    GameMenu.showMainMenu();
});

$('.version-text').on('click', () => {
    GameMenu.openWebsite();
});

const clickSound = new Audio('audio/click.flac');

$('button').on('click', () => {
    clickSound.currentTime = 0;
    clickSound.play().then();
});