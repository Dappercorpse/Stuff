export function playNext(id, queue, position) {
    return [...queue.slice(0, position + 1), id, ...queue.slice(position + 1)];
}

export function addToQueue(id, queue){
    return [...queue, id];
}

export function removeFromQueue(id, queue){
    return queue.filter((x) => x !== id);
}