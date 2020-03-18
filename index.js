const express = require("express")
const fs = require("fs");
const app = express()
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("listening at port 5000");
});
app.use(express.static("public"));
app.use(express.json({
    limit: "1mb"
}));
const _ = JSON.parse(fs.readFileSync("firebasedatabase.json"))
let db = _;
const weapons = JSON.parse(fs.readFileSync("public/weapons.json"))

app.post("/login", (request, response) => {
    let found = false;
    console.log("New loging request!")
    console.log("Id is:" + request.body.id);
    for (let user in db) {
        if (db[user].password == request.body.id) {
            response.json(db[user]);
            console.log("It was: " + user);
            found = true;
        }
    }
    if (!found) {
        response.json("undefined");
        console.log("User not found in the database");
    }
})

app.post("/signup", (request, response) => {
    console.log("New signup request!")
    console.log("Id is: " + request.body.id);
    console.log("Name is: " + request.body.name);
    let failed = false
    for (let user in db) {
        if (db[user].name == request.body.name.split(" ")[0]) {
            failed = true;
        }
    }
    switch (request.body.name) {
        case undefined:
            failed = true
            break;
        case "":
            failed = true
            break;
        case " ":
            failed = true
            break;
        case null:
            failed = true
            break;
        case "null":
            failed = true
            break;
        case "undefined":
            failed = true
            break;
    }
    if (!failed) {
        const name = request.body.name.split(" ")[0];
        const password = request.body.id;
        const newP = new newPlayer(name, password);
        db[name] = newP
        stringedDb = JSON.stringify(db);
        fs.writeFile('firebasedatabase.json', stringedDb, 'utf8', () => {
            console.log("Successfully signed up!");
        });
        response.json(db[name]);
    }
    if (failed) {
        console.log(request.body.name + " failed")
        response.json("undefined");
    }
})

app.post("/times", (request, response) => {
    let found = false;
    //console.log("New times update!");
    //console.log("Id is:" + request.body.id);
    for (let user in db) {
        if (db[user].password == request.body.id) {
            response.json(db[user].times);
            // console.log("It was: " + user);
            found = true;
        }
    }
    if (!found) {
        response.json("undefined");
    }
})

app.post("/shopRefresh", (request, response) => {
    let found = false;
    console.log("New shopTime update!");
    console.log("Id is:" + request.body.id);
    for (let user in db) {
        if (db[user].password == request.body.id) {
            found = true;
            console.log("It was: " + user);
            db[user].times.shop = request.body.time;
            stringedDb = JSON.stringify(db);
            fs.writeFile('firebasedatabase.json', stringedDb, 'utf8', () => {
                console.log("Successfully saved up!");
            });
            response.end();
        }
    }
    if (!found) {
        response.json("undefined");
    }
})

app.post("/shopItemsUpdate", (request, response) => {
    let found = false;
    console.log("New shop items update!");
    console.log("Id is:" + request.body.id);
    for (let user in db) {
        if (db[user].password == request.body.id) {
            found = true;
            console.log("It was: " + user);
            db[user].shopItems = request.body.items;
            stringedDb = JSON.stringify(db);
            fs.writeFile('firebasedatabase.json', stringedDb, 'utf8', () => {
                console.log("Successfully saved up!");
            });
            response.end();
        }
    }
    if (!found) {
        response.json("undefined");
    }
})

app.post("/arenaTime", (request, response) => {
    let found = false;
    console.log("New arena time update!");
    console.log("Id is:" + request.body.id);
    for (let user in db) {
        if (db[user].password == request.body.id) {
            found = true;
            console.log("It was: " + user);
            db[user].times.arena = request.body.time;
            stringedDb = JSON.stringify(db);
            fs.writeFile('firebasedatabase.json', stringedDb, 'utf8', () => {
                console.log("Successfully saved up!");
            });
            response.end();
        }
    }
    if (!found) {
        response.end();
    }
})

app.post("/monsterTime", (request, response) => {
    let found = false;
    console.log("New monster time update!");
    console.log("Id is:" + request.body.id);
    for (let user in db) {
        if (db[user].password == request.body.id) {
            found = true;
            console.log("It was: " + user);
            db[user].times.monsters = request.body.time;
            stringedDb = JSON.stringify(db);
            fs.writeFile('firebasedatabase.json', stringedDb, 'utf8', () => {
                console.log("Successfully saved up!");
            });
            response.end();
        }
    }
    if (!found) {
        response.end();
    }
})

app.post("/questTime", (request, response) => {
    let found = false;
    console.log("New quest time update!");
    console.log("Id is:" + request.body.id);
    for (let user in db) {
        if (db[user].password == request.body.id) {
            found = true;
            console.log("It was: " + user);
            db[user].times.quest = request.body.time;
            stringedDb = JSON.stringify(db);
            fs.writeFile('firebasedatabase.json', stringedDb, 'utf8', () => {
                console.log("Successfully saved up!");
            });
            response.end();
        }
    }
    if (!found) {
        response.end();
    }
})

app.post("/saveState", (request, response) => {
    let found = false;
    console.log("New state update!");
    console.log("Id is:" + request.body.id);
    stringedDb = JSON.stringify(db);
    fs.writeFile('firebasedatabase.json', stringedDb, 'utf8', () => {
        console.log("Successfully saved up!");
    });
    for (let user in db) {
        if (db[user].password == request.body.id) {
            found = true;
            console.log("It was: " + user);
            db[user].questAvailable = request.body.questAvailable;
            db[user].onQuest = request.body.onQuest;
            db[user].upgradeCharacter = request.body.upgradeCharacter;
            db[user].gold = request.body.gold;
            db[user].character = request.body.character;
            db[user].messages = request.body.messages;
            db[user].lvl = request.body.lvl;
            db[user].xp = request.body.xp;
            db[user].bossLvl = request.body.bossLvl;
            db[user].fame = request.body.fame;
            db[user].slots = request.body.slots;
            db[user].backpack = request.body.backpack;
            response.end();
        }
    }
    if (!found) {
        response.end();
    }
})

app.post("/questVerification", (request, response) => {
    let found = false;
    console.log("New quest verification time update!");
    console.log("Id is:" + request.body.id);
    for (let user in db) {
        if (db[user].password == request.body.id) {
            found = true;
            console.log("It was: " + user);
            response.json(db[user].times.quest);
        }
    }
    if (!found) {
        response.end();
    }
})

app.post("/randomEnemyArena", (request, response) => {
    let found = false;
    console.log("New arena time update!");
    console.log("Id is:" + request.body.id);
    for (let user in db) {
        if (db[user].password == request.body.id) {
            found = true;
            console.log("It was: " + user);
            let users = db;
            const enemy = pickRandomEnemy(users, user)
            response.json(enemy);
        }
    }


    if (!found) {
        response.end();
    }

    function pickRandomEnemy(obj, me) {
        //delete obj[me];
        let names = Object.keys(obj);
        let other = Math.floor(Math.random() * names.length);
        let index = names[other];
        if (obj[index] == me) {
            pickRandomEnemy(db, me)
        }
        return obj[index];
    }
})


let baseCharacter = {
    hp: 150,
    damage: 20,
    armor: 10,
    luck: 50,
    weight: 70,
    regen: 1,
    magicResistance: 5
};

class newPlayer {
    constructor(name, password) {
        this.onQuest = false;
        this.name = name;
        this.password = password;
        this.bossLvl = parseInt(0);
        this.lvl = parseInt(1);
        this.xp = parseInt(0);
        this.gold = parseInt(0);
        this.fame = parseInt(0);
        this.messages = [];
        this.questAvailable = [];
        this.character = baseCharacter;
        let fireball = {
            "damage": 20,
            "name": "Fireball"
        }
        this.spellSlot = [fireball];
        this.shopItems = [];
        this.upgradeCharacter = {
            hp: 0,
            damage: 0,
            armor: 0,
            luck: 0,
            weight: 0,
            regen: 0,
            magicResistance: 0,
        }

        this.slots = {
            body: weapons.body["Nothing"],
            leftArm: weapons.leftArm["Nothing"],
            rightArm: weapons.rightArm["Nothing"],
            ring: weapons.ring["Nothing"],
            neck: weapons.neck["Nothing"],
        }

        this.times = {
            arena: 0,
            monsters: 0,
            quest: 0,
            shop: 0,
        }
    }
}