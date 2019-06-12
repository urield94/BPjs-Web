let controller;

let diskClick = [];
let pollClick = [];
let restartEvents = [];
let terminate = [];

function start() {
    console.log("starting...");
    for (let j = 0; j < max_poles; j++) {
        restartEvents.push('restarter(' + j + ')');
        pollClick.push("poll_clicker(" + j + ")");
        terminate.push('terminate(' + j + ')');
        for (let i = 0; i < max_disks + 1; i++) {
            diskClick.push("disk_clicker(" + i + ',' + j + ')');
        }
    }

    controller = run([ disk_clicker(), poll_clicker(), restarter(), terminator()]);
    controller.next();
}

function restart(start_pole) {
    controller.next("restarter(" + start_pole + ")");
}

function disk_clicked(i, j) {
    controller.next('disk_clicker(' + i + ',' + j + ')');
}

function poll_clicked(j) {
    controller.next('poll_clicker(' + j + ')');
    check_game_status();
}

function game_end(filled_pole) {
    controller.next('terminate(' + filled_pole + ')');
}

function hanoi_solve(disks, start_pole, end_pole) {
    restart(start_pole);
    hanoi(disks, start_pole, end_pole);
}

function change_start_pole() {
    start_pole = document.forms[0].start_select.options[document.forms[0].start_select.selectedIndex].text - 1;
    restart(start_pole);
}

