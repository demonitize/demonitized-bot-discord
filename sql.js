const sqlite3 = require("sqlite3")

const db = new sqlite3.Database('./data.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the blacklist database.');
	db.run("CREATE TABLE IF NOT EXISTS blacklisted (reason TEXT, id TEXT)")

});

const blackListUser = db.prepare("INSERT INTO blacklisted VALUES (?,?)")

const checkBlackListUser = db.prepare("SELECT reason FROM blacklisted WHERE id = ?")

function autoBlackList(id, reason) {
	blackListUser.run(reason, id)
};

function checkBlackList(id, cb) {
	checkBlackListUser.get(id, cb)
};

module.exports = {
	autoBlackList : autoBlackList,
	checkBlackList : checkBlackList
}
