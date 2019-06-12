<!-- Original:  Adam Stock (adam@digital-biz.com) -->

<!-- (c) Copyright 1998-99 Adam L. Stock. All Rights Reserved -->
<!-- You have permission to republish this code provided -->
<!-- that you do not remove this copyright notice -->


// change this to where you upload the images to your site

imgdir = "img/";


function preload() {
    this.length = preload.arguments.length;
    for (let i = 0; i < this.length; i++) {
        this[i] = new Image();
        this[i].src = imgdir + preload.arguments[i];
    }
}

let pics = new preload("disk1.gif", "disk2.gif",
    "disk3.gif", "disk4.gif", "disk5.gif", "disk6.gif",
    "disk7.gif", "disk1h.gif", "disk2h.gif",
    "disk3h.gif", "disk4h.gif", "disk5h.gif", "disk6h.gif",
    "disk7h.gif");

let selected_row;
let selected_col;
let end_pole;
let game_is_over;

let max_poles = 3;
let max_disks = 7;
let all_poles = 3;
let start_pole = 1;
let disks = 3;

let show_messages = false;
let board = new Array(max_poles);
for (let i = 0; i < max_poles; i++) {
    board[i] = new Array(max_disks + 1);
}


function check_selection(j) {
    return selected_col === j;
}

function is_empty(num) {
    for (let i = 0; i < board[num].length; i++) {
        if (board[num][i] !== 0) return false;
    }
    return true;
}

function top_most(num) {
    for (let i = 0; i < board[num].length; i++) {
        if (board[num][i] !== 0) return i;
    }
    return -1;
}

function is_pole(i, j) {
    return (board[j][i] === 0);
}

function legal_step(j) {
    if (is_empty(j)) return true;
    return (board[j][top_most(j)] < board[selected_col][selected_row]);
}

function is_selection() {
    return selected_col != null;
}

function choose_disk(num) {
    let top_pos = top_most(num); //Check if the piece that was selected is the most top in the array

    if (selected_col === num && selected_row === top_pos) {
        selected_col = null;
        selected_row = null;
        animate(num, top_pos, "disk" + board[num][top_pos] + ".gif");
        message("Select a piece to move.");
        return;
    }
    if (is_selection()) {
        animate(selected_col, selected_row, "disk" + board[selected_col][selected_row] + ".gif");
    }
    selected_col = num;
    selected_row = top_pos;
    animate(num, top_pos, "disk" + board[num][top_pos] + "h.gif");
    message("Click on the pole to which you want to move the disk.");

}

function move(num) {
    let top_pos = (!is_empty(num) ? top_most(num) : board[num].length);
    board[num][top_pos - 1] = board[selected_col][selected_row];
    board[selected_col][selected_row] = 0;
    animate(selected_col, selected_row, "pole.gif");
    animate(num, top_pos - 1, "disk" + board[num][top_pos - 1] + ".gif");
    move_disk_to_poll(num, top_pos);
    selected_col = null;
    selected_row = null;
    message("Select a piece to move.");
}

function move_disk_to_poll(num, top_pos) {
    let disk_to_poll = document.getElementById("disk(" + selected_row + "," + selected_col + ")");
    let poll_to_disk = document.getElementById("poll(" + (top_pos - 1) + "," + num + ")");

    disk_to_poll.setAttribute("id", "poll(" + selected_row + "," + selected_col + ")");
    disk_to_poll.setAttribute("href", "javascript:poll_clicked(" + selected_col + ")");

    poll_to_disk.setAttribute("id", "disk(" + (top_pos - 1) + "," + num + ")");
    poll_to_disk.setAttribute("href", "javascript:disk_clicked(" + (top_pos - 1) + "," + num + ")");
}

function hanoi(no_of_disks, start_pole, goal_pole) {
    if (no_of_disks > 0) {
        let free_pole = all_poles - start_pole - goal_pole;
        hanoi(no_of_disks - 1, start_pole, free_pole);
        disk_clicked(top_most(start_pole), start_pole);
        poll_clicked(goal_pole);
        hanoi(no_of_disks - 1, free_pole, goal_pole);
    }
}

function check_game_status() {
    let filled_pole = null;
    let val = 0;
    for (let k = 0; k < board.length; k++) {
        val += (is_empty(k) ? 1 : 0);
        if (!is_empty(k)) filled_pole = k;
    }

    if (val === 2 && is_empty(start_pole)) {
        game_end(filled_pole);
    }
}


