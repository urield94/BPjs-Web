function getName(num) {
    return num === 0 ? "pole.gif" : "disk" + num + ".gif";
}

function message(str, force) {
    if (force || !game_is_over && !show_messages)
        document.disp.message.value = str;
}

function draw_board() {
    for (let j = 0; j < board.length; j++) {
        let td = document.createElement("td");
        let a1 = document.createElement("a");
        a1.setAttribute("href", "javascript:poll_clicked(" + j + ")");
        a1.setAttribute("class", "poll("+j+")");

        let img1 = document.createElement("img");
        img1.setAttribute("src", imgdir + "poletop.gif");

        a1.appendChild(img1);
        a1.appendChild(document.createElement("br"));
        td.appendChild(a1);

        for (let i = 0; i < board[j].length; i++) {
            let a2 = document.createElement("a");
            if (board[j][i] === 0) {
                a2.setAttribute("href", "javascript:poll_clicked(" + j + ")");
                a2.setAttribute("id", "poll("+i+","+j+")");
            } else {
                a2.setAttribute("href", "javascript:disk_clicked(" + i + "," + j + ")");
                a2.setAttribute("id", "disk("+i+","+j+")");
            }
            let img2 = document.createElement("img");
            img2.setAttribute("src", imgdir + getName(board[j][i]));
            img2.setAttribute("name", "pos" + j + i);

            a2.appendChild(img2);
            a2.appendChild(document.createElement("br"));
            td.appendChild(a2);
        }
        document.getElementById("gameTableRow").appendChild(td);
    }
    message("You may begin! Select a piece to move.");
}



function init_board(start_pole, disks) {
    let len = max_disks + 1;
    selected_col = null;
    selected_row = null;
    game_is_over = false;
    end_pole = (start_pole - 1 < 0 ? max_poles - 1 : start_pole - 1);

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < max_poles; j++) {
            board[j][i] = 0;
        }
    }

    for (let i = len - disks, j = 0; i < len; i++, j++) {
        board[start_pole][i] = len - j - 1;
    }
}

function init() {
    init_board(start_pole, disks);
    start();
    draw_board();
}

