function Animation() {
    this.imageNum = [];  // Array of indicies document.images to be changed
    this.imageSrc = [];  // Array of new srcs for imageNum array
    this.frameIndex = 0;          // the frame to play next
    this.alreadyPlaying = false;  // semaphore to ensure we play smoothly

    this.getFrameCount = get_frame_count;   // the total numebr of frame so far
    this.moreFrames = more_frames;         // tells us if there are more frames to play
    this.addFrame = add_frame;             // add a frame to the animation
    this.drawNextFrame = draw_next_frame;   // draws the next frame
    this.startAnimation = start_animation; // init the animation if necessary
}

function get_frame_count() {
    return this.imageNum.length;
}

function more_frames() {
    return this.frameIndex < this.getFrameCount();
}

function start_animation() {
    if (!this.alreadyPlaying) {
        theAnim.alreadyPlaying = true;
        setTimeout('theAnim.drawNextFrame()', 5);
    }
}

function add_frame(num, src) {
    let theIndex = theAnim.imageNum.length;
    theAnim.imageSrc[theIndex] = src;
    theAnim.imageNum[theIndex] = num;
    theAnim.startAnimation();
}

function draw_next_frame() {
    if (theAnim.moreFrames()) {
        document.images[theAnim.imageNum[theAnim.frameIndex]].src = theAnim.imageSrc[theAnim.frameIndex];
        theAnim.frameIndex++;
        setTimeout('theAnim.drawNextFrame()', 30);
    } else {
        theAnim.alreadyPlaying = false;
    }
}

function animate(x, y, name) {
    theAnim.addFrame("pos" + x + "" + y, imgdir + name);
}

let theAnim = new Animation();
