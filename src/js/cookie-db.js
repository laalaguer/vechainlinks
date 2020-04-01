/**
 * Depends on: Cookies.js https://www.npmjs.com/package/cookies-js
 * Usage:
 * 
 * const db = new CookieDB()        - Create a database.
 * 
 * db.hasTable(tableName)           - Check if table exists.
 * db.createTable(tableName)        - Create a table. If table exist, don't create.
 * 
 * db.getTable(tableName)           - Return a table as {key:value, key:value}, if not found return {}
 * db.dropTable(tableName)          - Delete a table.
 * 
 * db.setKey(tableName, key, value) - Insert a key:value into a table, if table not found, create table then insert.
 * db.getKey(tableName, key)        - Get a key:value from a table, if table not found/key not found, return undefined.
 * 
 * db.removeKey(tableName, key)     - Remove a key:value from a table, this will always success regardless table not found/key not found.
 * 
 * tableName: String
 * key: String
 * value: Plain Object
*/
function CookieDB() {
    this.expireSeconds = 30 * 24 * 3600 // 30 Days.
}

/**
 * @returns {Boolean}
 */
CookieDB.prototype.hasTable = function (tableName) {
    const t = Cookies.get(tableName)
    if (t) { return true } else { return false}
}

/**
 * @returns {void}
 */
CookieDB.prototype.createTable = function (tableName) {
    if (!this.hasTable(tableName)) {
        Cookies.set(tableName, JSON.stringify({}), { expires: this.expireSeconds })
    }
}

/**
 * @returns {void}
 */
CookieDB.prototype.dropTable = function (tableName) {
    if (this.hasTable(tableName)) {
        Cookies.expire(tableName)
    }
}

/**
 * @returns {Object}
 */
CookieDB.prototype.getTable = function (tableName) {
    if (!this.hasTable(tableName)){
        return {}
    } else {
        const t = Cookies.get(tableName)
        return JSON.parse(t)
    }
}

/**
 * @returns {void}
 */
CookieDB.prototype.setKey = function (tableName, key, value) {
    if (!this.hasTable(tableName)){
        this.createTable(tableName)
    }

    const keyValues = this.getTable(tableName)
    // set key:value to it.
    keyValues[key] = value
    // Store it.
    Cookies.set(tableName, JSON.stringify(keyValues))
}

/**
 * @returns {Object or null}
 */
CookieDB.prototype.getKey = function (tableName, key) {
    if (!this.hasTable(tableName)) {
        return null
    }
    const keyValues = this.getTable(tableName)
    if (keyValues[key] == undefined) { return null } else { return keyValues[key] }
}

CookieDB.prototype.removeKey = function (tableName, key) {
    if (!this.hasTable(tableName)) {
        return;
    }

    const keyValues = this.getTable(tableName)
    // Delete it.
    delete keyValues[key]
    // Store it.
    Cookies.set(tableName, JSON.stringify(keyValues))
}
