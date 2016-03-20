function Queue() {

    /*hybrid queue, not exactly fifo
    elements can be added to the front after dequeue
    backwards button can be implemented*/

    this.storage = [];
}

Queue.prototype.size = function() {
    return this.storage.length;
};

Queue.prototype.enqueue = function(data) {
    this.storage.push(data);
};

Queue.prototype.peek = function() {
    return this.storage[0];
};

Queue.prototype.dequeue = function() {
    return this.storage.shift();
};

Queue.prototype.putAtFront = function(data) {
    this.storage.unshift(data);
};