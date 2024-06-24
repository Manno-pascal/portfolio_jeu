

let sounds = {
    ambiance: './src/sound/ambiance.mp3',
    thomas: './src/sound/thomas.mp3',
    pas: './src/sound/pas.mp3',
    close: './src/sound/close.mp3',
    open: './src/sound/open.mp3',
    bubble: './src/sound/bubble.mp3',
    success: './src/sound/success.mp3'
};

let musicPlays = {};


export function play(name, isLoop = false) {
    if (!musicPlays.hasOwnProperty(name)) {
        const audio = new Audio();
        audio.src = sounds[name]
        audio.loop = isLoop;
        audio.play();
        if (audio.loop) {
            musicPlays[name] = audio
        }
    }

}

export function isPlay(name) {
    return musicPlays.hasOwnProperty(name)
}

export function stop(name) {
    if (musicPlays.hasOwnProperty(name)) {
        musicPlays[name].pause();
        musicPlays[name].currentTime = 0;
        delete musicPlays[name];
    }
}

export function pause(name) {
    if (musicPlays.hasOwnProperty(name)) {
        musicPlays[name].suspend();
    }
}

export function setVolume(name, volume) {
    if (musicPlays.hasOwnProperty(name)) {
        musicPlays[name].volume = volume;
    }
}
