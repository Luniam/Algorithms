function Stack() {
    this.storage = [];
}

Stack.prototype.size = function() {
    return this.storage.length;
};

Stack.prototype.push = function(data) {
    this.storage.push(data);
};

Stack.prototype.pop = function() {
    return this.storage.pop();
};