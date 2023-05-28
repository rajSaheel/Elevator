const maxLevel = document.querySelectorAll(".level").length - 1
const lift = document.querySelector("#lift")
const timePerLevel = 5000

const liftState = {
    level: maxLevel,
    moving: false,
}

const filler = new Audio("./assets/filler.mp3")
const ding = new Audio("./assets/ding.mp3")

let time = 0
let timeInterval = setInterval(() => {
    time += 100
}, 100)

function callLift(level, direction) {
    if (liftState.moving === false && (level == 0 || level == maxLevel)) {
        time = 0
        const interval = maxLevel
        switch (direction) {
            case "UP":
                if (liftState.level < maxLevel) {
                    lift.style.top = `${16 * maxLevel + 5}vw`
                    filler.play()
                    lift.style.animation = createAnimation(interval, direction)
                    liftState.moving = direction
                    for (let i = 0; i < maxLevel; i++) {
                        globalThis.stepInterval = setTimeout(() => {
                            liftState.level = liftState.level + 1
                            console.log(`crossed level-${i}`)
                        }, timePerLevel * (i + 1))
                    }
                }
                break
            case "DOWN":
                if (liftState.level > 0) {
                    filler.play()
                    lift.style.top = "5vw"
                    lift.style.animation = createAnimation(interval, direction)
                    liftState.moving = direction

                    for (let i = maxLevel; i > 0; i--) {
                        globalThis.stepInterval = setTimeout(() => {
                            liftState.level = liftState.level - 1
                            console.log(`crossed level-${i}`)
                        }, timePerLevel * (maxLevel - i + 1))
                    }
                }
                break
            default:
        }
        globalThis.fullInterval = setTimeout(() => {
            filler.pause()
            ding.play()
            liftState.level = direction === "UP" ? maxLevel : 0
            liftState.moving = false
            console.log("reached extreme")
            time = 0
        }, timePerLevel * maxLevel)
    } else if (liftState.moving === direction) {
        switch (direction) {
            case "UP":
                console.log(time)
                if (liftState.level <= level && timePerLevel * level > time) {
                    setTimeout(() => {
                        clearTimeout(globalThis.stepInterval)
                        clearTimeout(globalThis.fullInterval)
                        lift.style.animationPlayState = "paused"
                        filler.pause()
                        ding.play()
                        console.log("pressed at" + level)
                        time = 0
                    }, timePerLevel * level - time)
                }
                break

            case "DOWN":
                console.log(time)
                if (
                    liftState.level >= level &&
                    timePerLevel * (maxLevel - level) > time
                ) {
                    setTimeout(() => {
                        clearTimeout(globalThis.stepInterval)
                        clearTimeout(globalThis.fullInterval)
                        filler.pause()
                        ding.play()
                        lift.style.animationPlayState = "paused"
                        time = 0
                    }, timePerLevel * (maxLevel - level) - time)
                }
                break
        }
    }
}

function createAnimation(interval, direction) {
    const value = `${interval * 16}vw`
    document.documentElement.style.setProperty("--transform-length", value)
    return `move-${direction} ${5 * interval}s ease-in-out 1 forwards`
}
