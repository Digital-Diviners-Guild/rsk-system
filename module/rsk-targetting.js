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

//todo: only valid targets / potentially self targeting?
export function getTargets(actor) {
    const targets = game.user.targets;
    return targets.map(t => t.actor.uuid);
}