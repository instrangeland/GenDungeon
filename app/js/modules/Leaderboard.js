export default class Leaderboard {
    static update() {
        $.get('https://gendungeon.com/api/leaderboard/get.php', response => {
            $('.loading-text').hide();
            const leaderboard = $('.leaderboard');
            leaderboard.empty();
            for (const scoreRow of response.split('\n').slice(0, -1)) {
                const scoreData = scoreRow.split(',');

                const rank = scoreData[0];
                const initials = scoreData[1];
                const score = scoreData[2];

                leaderboard.append(`<tr><td>${rank}</td><td>${initials}</td><td>${score}</td></tr>`);
            }
        }).fail(() => {
            $('.loading-text').text('Could not load leaderboard.');
        });
    }
}