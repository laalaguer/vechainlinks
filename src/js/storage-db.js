/**
 * The database that utilizes localStorage API.
 * 
 * const db = new StorageDB()
 * 
 * db.hasTable(tableName)
 * db.createTable(tableName)
 * db.getTable(tableName)
 * db.dropTable(tableName)
 * 
 * db.setKey(tableName, key, value)
 * db.getKey(tableName, key)
 * 
 * db.hasKey(tableName, key)
 * 
 * db.removeKey(tableName, key)
 * 
 * db.nuke()
 */

if (!window.localStorage) {
    throw Error('localStorage API is needed!')
}

/**
 * @property {Window.localStorage} storage
 */
function StorageDB() {
    this.storage = window.localStorage
}

StorageDB.prototype.hasTable = function (tableName) {
    const result = this.storage.getItem(tableName)
    if (result) { return true } else { return false }
}

StorageDB.prototype.createTable = function (tableName) {
    if (!this.hasTable(tableName)) {
        this.storage.setItem(tableName, JSON.stringify({}))
    }
}

StorageDB.prototype.dropTable = function (tableName) {
    if (this.hasTable(tableName)) {
        this.storage.removeItem(tableName)
    }
}

StorageDB.prototype.getTable = function (tableName) {
    if (!this.hasTable(tableName)) {
        return {}
    } else {
        const result = this.storage.getItem(tableName)
        return JSON.parse(result)
    }
}

StorageDB.prototype.setKey = function (tableName, key, value) {
    if (!this.hasTable(tableName)) {
        this.createTable(tableName)
    }

    const keyValues = this.getTable(tableName)
    keyValues[key] = value
    this.storage.setItem(tableName, JSON.stringify(keyValues))
}

StorageDB.prototype.getKey = function (tableName, key) {
    if (!this.hasTable(tableName)) {
        return null
    }

    const keyValues = this.getTable(tableName)
    if (keyValues[key] === undefined) { return null } else { return keyValues[key] }
}


StorageDB.prototype.removeKey = function (tableName, key) {
    if (!this.hasTable(tableName)) {
        return;
    }

    const keyValues = this.getTable(tableName)
    // Delete it.
    delete keyValues[key]
    // Store it.
    this.storage.setItem(tableName, JSON.stringify(keyValues))
}

StorageDB.prototype.nuke = function () {
    this.storage.clear()
}