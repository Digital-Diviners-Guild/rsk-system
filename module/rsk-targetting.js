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

//todo: improve targetting
// - I think there are 'target' types like self, many, undead, etc..
//  could be nice to configure that and validate the target is correct
// - when an action targets 'self', that should just auto target self
// - could validate range as well
export function getTargets(actor) {
    const targets = game.user.targets;
    return targets.map(t => t.actor.uuid);
}