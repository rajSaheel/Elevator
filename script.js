const maxLevel = document.querySelectorAll(".level").length - 1
const lift = document.querySelector("#lift")
const timePerLevel = 2000

const liftState = {
    level: maxLevel,
    moving: false,
    queue: { UP: [], DOWN: [] },
}

const filler = new Audio("./assets/filler.mp3")
const ding = new Audio("./assets/ding.mp3")

function callLift(level, direction) {
    console.log(liftState)
    switch (direction) {
        case "UP":
            if (liftState.level < maxLevel) {
                lift.style.top = `${16 * maxLevel + 3}vw`
                filler.play()
                lift.style.animation = createAnimation(maxLevel, direction)
                liftState.moving = direction
                const targets = [...liftState.queue.UP]
                targets.push(maxLevel)
                liftState.queue[direction] = []
                let pauseDuration = timePerLevel * targets[0]
                let resumeDuration = timePerLevel * targets[0] + timePerLevel
                for (let i = 0; i < targets.length; i++) {
                    let interval = Math.abs(targets[i] - targets[i + 1])
                    globalThis.stoppageTimeout = setTimeout(() => {
                        liftState.level = targets[i]
                        liftState.moving = false
                        filler.pause()
                        ding.play()
                        lift.style.animationPlayState = "paused"
                        removeHighlight(targets[i], direction)
                    }, pauseDuration)
                    globalThis.resumeTimeout = setTimeout(() => {
                        if (targets[i] === maxLevel) {
                            if (
                                liftState.queue.DOWN.length !== 0 ||
                                liftState.queue.DOWN.length !== 0
                            ) {
                                callLift(maxLevel, "DOWN")
                            }
                        } else {
                            liftState.moving = direction
                            filler.play()
                            lift.style.animationPlayState = "running"
                        }
                    }, resumeDuration)
                    pauseDuration += timePerLevel * (interval + 1)
                    resumeDuration += timePerLevel * (interval + 1)
                }
            }
            break
        case "DOWN":
            if (liftState.level > 0) {
                lift.style.top = `${3}vw`
                filler.play()
                lift.style.animation = createAnimation(maxLevel, direction)
                liftState.moving = direction
                const targets = [...liftState.queue.DOWN]
                targets.push(maxLevel)
                liftState.queue[direction] = []
                let pauseDuration = timePerLevel * targets[0]
                let resumeDuration = timePerLevel * targets[0] + timePerLevel
                for (let i = 0; i < targets.length; i++) {
                    let interval = Math.abs(targets[i] - targets[i + 1])
                    globalThis.stoppageTimeout = setTimeout(() => {
                        liftState.level = maxLevel - targets[i]
                        liftState.moving = false
                        filler.pause()
                        ding.play()
                        lift.style.animationPlayState = "paused"
                        removeHighlight(maxLevel - targets[i], direction)
                    }, pauseDuration)
                    globalThis.resumeTimeout = setTimeout(() => {
                        if (targets[i] === maxLevel) {
                            if (
                                liftState.queue.UP.length !== 0 ||
                                liftState.queue.DOWN.length !== 0
                            ) {
                                callLift(0, "UP")
                            }
                        } else {
                            liftState.moving = direction
                            filler.play()
                            lift.style.animationPlayState = "running"
                        }
                    }, resumeDuration)
                    pauseDuration += timePerLevel * (interval + 1)
                    resumeDuration += timePerLevel * (interval + 1)
                }
            }
            break
        default:
    }
}

function createAnimation(interval, direction) {
    const value = `${interval * 16}vw`
    document.documentElement.style.setProperty("--transform-length", value)
    return `move-${direction} ${2 * interval}s linear 1 forwards `
}

function pushCall(level, direction) {
    let i = 0
    if (direction === "UP") {
        for (let item of liftState.queue.UP) {
            if (item === level) return
            i++
        }
        liftState.queue.UP.push(level)
        liftState.queue.UP.sort()
    } else if (direction === "DOWN") {
        for (let item of liftState.queue.DOWN) {
            if (item === maxLevel - level) return
            i++
        }
        liftState.queue.DOWN.push(maxLevel - level)
        liftState.queue.DOWN.sort()
    }
}

function buttonPressed(level, direction) {
    if (!(level === 0 || level === maxLevel)) {
        addHighlight(level, direction)
        pushCall(level, direction)
    } else if (liftState.level === 0 || liftState.level === maxLevel)
        callLift(level, direction)
}

function addHighlight(level, direction) {
    document
        .getElementById(`level-${level}-${direction}`)
        .firstElementChild.classList.add("highlight")
}

function removeHighlight(level, direction) {
    document
        .getElementById(`level-${level}-${direction}`)
        .firstElementChild.classList.remove("highlight")
}
