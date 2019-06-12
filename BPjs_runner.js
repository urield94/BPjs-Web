/**
 * collect_initial_snapshot - For every generator, invoke and restore the returned value along with the generator.
 *
 * @param bThreads - List of generator functions received at initialisation.
 *
 * @return - snapshots:  List of snapshot as described at update_snapshot.
 **/
function collect_initial_snapshot(bThreads) {
    let snapshots = [];
    bThreads.forEach(function (bt) {
        let snapshot = bt.next();
        snapshot['bt'] = bt;
        snapshots.push(snapshot);
    });
    return snapshots;
}
/**
 * next_event - Collect all 'request' event that aren't blocked.
 *
 * @param snapshots - List of snapshot as described at update_snapshot.
 *
 * @return - List of 'request' event, or false if there are none or they all blocked.
 **/
function next_event(snapshots) {
    let requested = [];
    blocked = [];
    snapshots.forEach(function (snapshot) {
        if (snapshot.value) {
            if (snapshot.value['request']) {
                requested = requested.concat(snapshot.value['request']);
            }
            if (snapshot.value['block']) {
                blocked = blocked.concat(snapshot.value['block']);
            }
        }
    });
    // candidates = requested - blocked
    let candidates = requested.filter(function (x) {
        return blocked.includes(x);
    });

    if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
    } else {
        return false;
    }
}

/**
 * update_snapshot - Invoke event e out of snapshot['bt'], and change the value of snapshot with the returned value of the event.
 *
 * @param snapshot -
 *      snapshot.value - Dict of b-threads {'wait-for': list, 'request': list, 'block': list}.
 *      snapshot['bt'] - The generator that wait-for\request the event e.
 * @param e - The event that will be invoked
 **/
function update_snapshot(snapshot, e) {
    snapshot.value['wait_for'] = [];
    snapshot.value['request'] = [];
    snapshot.value['block'] = [];
    snapshot.value = snapshot['bt'].next(e).value; //Wait here for the b-thread to finish it job and return new yield value.
}

/**
 * advance_bthrads - Search the event e in every snapshot wait-for/request entry, and invoke if found.
 *
 * @param snapshots - List of snapshot as described at update_snapshot.
 * @param e - The event that will be invoked.
 *
 * @return - snapshots
 **/
function advance_bthrads(snapshots, e) {
    snapshots.forEach(function (snapshot) {
        if (snapshot.value) {
            let wf = snapshot.value['wait_for'];
            let req = snapshot.value['request'];
            if ((wf && wf.includes(e)) || (req && req.includes(e))) {
                update_snapshot(snapshot, e);
            }
        }
    });
    return snapshots;
}

/**
 * run (Generator)- Collect snapshot from the received b-threads, and get the new requested events.
 *                  If there were no 'request' events that aren't blocked, wait for the controller to receive an event.
 *                  When event e occur, the run generator will activate and will invoke the e unless it blocked.
 *                  In every iteration the b-threads that were activated by the generator invoke new b-threads, unless they dead.
 *
 * @param bThreads - List of generator functions.
 **/
function* run(bThreads) {
    let snapshots = collect_initial_snapshot(bThreads);
    while (true) {
        let e = next_event(snapshots);
        if (!e) {
            do {
                e = yield;
            } while (blocked.includes(e))
        }
        snapshots = advance_bthrads(snapshots, e);
    }
}

