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

export function getTarget(actor = {}) {
    const targets = game.user.targets;
    let target = actor;
    for (const t of targets) {
        //--- should we default to self target, or throw since we cannot do what they wanted?
        //if we go with the updated outcome that doesn't yet have targets assigned, then this logic
        //would need to be where ever we are handling the outcome.
        //though, how does this work for usage? we don't want to take the resources if no targets where in range
        //maybe we can just have an outcome undo and the player should be aware of if they have a target in range or not?
        //if (isInRange(actor.sheet.token, t, range)) {
        target = t.actor;
        //}
    }
    return target.uuid;
}