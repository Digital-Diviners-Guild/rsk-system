export const rangeDistance = {
    near: 10,
    far: 30,
    distant: 60,
}

export function isInRange(actorToken, targetToken, range) {
    const distance = canvas.grid.measureDistance(
        { x: actorToken.x, y: actorToken.y },
        { x: targetToken.x, y: targetToken.y });
    const maxDistance = rangeDistance[range];
    return distance < maxDistance;
}