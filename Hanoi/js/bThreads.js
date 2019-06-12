/***
 * Thread activate by clicking on a poll.
 * Legal step - source disk is smaller than the most top disk at the destination poll
 * If legal step were made, move the disk to the chosen poll and wait for the thread to be activate.
 * If the game was over, wait for the restart thread to activate and then reactivating the clicks threads.
 **/
function* poll_clicker() {
    let e;

    while (true) {

        e = yield {'wait_for': pollClick};

        let j = e.match(/\d+/g)[0];

        if (!is_selection()) { //empty selection
            message("Select a piece to move.");
        } else if (check_selection(j)) {
            message("Move the piece to a different pole.");
        } else if (!legal_step(j)) {
            message("That is not a legal move. Try again.");
        } else {
            move(j);
        }
    }
}

/***
 * Thread activate by clicking on a disk.
 * If the game was over, wait for the restart thread to activate and then reactivating the clicks threads
 **/
function* disk_clicker() {

    let e;
    while (true) {

        e = yield {'wait_for': diskClick};
        let arr = e.match(/\d+/g);
        let i = arr[0];
        let j = arr[1];

        if (!is_selection() && is_pole(i, j)) { //empty selection
            message("Select a piece to move.");
        } else {
            choose_disk(j);
        }
    }
}


/***
 * Thread activate by clicking on the restart button.
 * After finishing the game this is the only thread waiting for activate.
 **/
function* restarter() {
    while (true) {
        let e = yield {'wait_for': restartEvents};
        let start_pole = e.match(/\d+/g)[0]; //Find the start_pole by using regex, start_pole is the only digit in e.
        disks = document.forms[0].disc.options[document.forms[0].disc.selectedIndex].text;
        init_board(start_pole, disks);
        document.getElementById("gameTableRow").innerHTML = "";
        draw_board();
        theAnim = new Animation();
    }
}

/***
 * Thread activate when the user or the computer finish the game.
 * After invoking, the function will wait for restarting the game.
 **/
function* terminator() {
    let e;
    while (true) {
        e = yield {'wait_for': terminate};
        let filled_pole = e.match(/\d+/g)[0];
        game_is_over = true;
        end_pole = filled_pole;
        for (let i = 0; i < disks; i++) {
            animate(end_pole, max_disks - i, "disk" + board[end_pole][max_disks - i] + "h.gif");
        }
        message("You won!", true);
        e = yield {'block': pollClick.concat(diskClick), 'wait_for': restartEvents};
    }
}
