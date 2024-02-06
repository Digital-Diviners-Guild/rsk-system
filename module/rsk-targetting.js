export const rangeDistance = {
    near: 10,
    far: 30,
    distant: 60,
}

export function isInRange(actorToken, targetToken, range) {
    const distance = canvas.grid.measureDistance(actorToken.center, targetToken.center);
    const maxDistance = rangeDistance[range];
    return distance < maxDistance;
}

//todo: multi targetting, range checking
export function getTarget(actor) {
    const targets = game.user.targets;
    let target = actor;
    for (const t of targets) {
        target = t.actor;
    }
    return target.uuid;
}