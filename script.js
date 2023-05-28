const liftState = {
    level: 2,
    moving: false,

    queue: [],
}

const lift = document.querySelector("#lift")

function createAnimation(interval, direction) {
    const value = `${interval * 16}vw`
    document.documentElement.style.setProperty("--transform-length", value)
    return `move-${direction} ${5 * interval}s ease-in-out 1 forwards`
}
let time = 0
let timeInterval = setInterval(() => {
    time += 100
    // console.log(time)
}, 100)
function callLift(level, direction) {
    if (liftState.moving === false && level !== 1) {
        time = 0
        console.log(time)
        liftState.queue.push(level)
        const interval = 2
        switch (direction) {
            case "UP":
                if (liftState.level !== 2) {
                    const upwardAnimation = createAnimation(interval, direction)
                    lift.style.animation = upwardAnimation
                    liftState.moving = direction
                }

                break
            case "DOWN":
                if (liftState.level !== 0) {
                    const downwardAnimation = createAnimation(
                        interval,
                        direction
                    )
                    lift.style.animation = downwardAnimation
                    liftState.moving = direction
                }

                break
            default:
        }

        setTimeout(() => {
            liftState.level = 1
            console.log("crossed level 1")
        }, 5000)
        setTimeout(() => {
            liftState.level = level
            liftState.moving = false
            console.log("reached extreme")
            time = 0
        }, 10000)
        switch (liftState.level) {
            case 0:
                lift.style.top = "37vw"
                break
            case 1:
                lift.style.top = "21vw"
                break
            case 2:
                lift.style.top = "5vw"
        }
    } else if (liftState.moving === direction && liftState.level !== 1) {
        liftState.queue.push(level)
        console.log(5000 - time)
        setTimeout(() => {
            lift.style.animationPlayState = "paused"
        }, 5000 - time)
        setTimeout(() => {
            lift.style.animationPlayState = "running"
        }, 5000 - time + 500)
    }
}
