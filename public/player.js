let baseCharacter = {
  hp: 150,
  damage: 20,
  armor: 10,
  luck: 50,
  weight: 70,
  regen: 1,
  magicResistance: 5
};

class Player {
  constructor(obj) {
    this.onQuest = obj.onQuest || 0;
    this.upgradeCharacter = obj.upgradeCharacter;
    this.character = baseCharacter;
    this.gold = obj.gold;
    this.bossLvl = obj.bossLvl;
    this.lvl = obj.lvl;
    this.name = obj.name;
    this.xp = obj.xp;
    this.fame = obj.fame;
    this.password = obj.password;
    this.slots = obj.slots;
    this.spellSlot = obj.spellSlot;
    this.backpack = obj.backpack || [];
    //    this.messages = obj.messages || [];
    this.shopItems = obj.shopItems;
    this.times = obj.times;
    this.questAvailable = obj.questAvailable || [];
    // this.readMessages();
    this.calculateCharacter();
  }

  calculateCharacter() {
    this.character = {
      hp: 150,
      damage: 20,
      armor: 10,
      luck: 50,
      weight: 70,
      regen: 1,
      magicResistance: 5
    };
    for (let property in this.character) {
      this.character[property] += this.upgradeCharacter[property];
    }
    for (const item in this.slots) {
      for (const property in this.character) {
        if (this.slots[item].properties[property] && this.character[property]) {
          this.character[property] += parseInt(this.slots[item].properties[property]);
        }
      }
    }
    this.saveState();
  }
  //-------------------------------------------------------------------------------------
  //                                  SHOP
  showShop() {
    let oldDate = times.shop;
    let newDate = Date.parse(new Date());
    if (newDate - oldDate > 600000) { // 10min
      this.shopItems = [];
      let shoppingWeapons = [];
      for (let part in weapons) {
        for (let item in weapons[part]) {
          if (weapons[part][item].name != "Nothing" && part != "Monsters" && part != "Quests" && part != "Npcs") {
            if (!this.backpackContains(weapons[part][item]) && !this.playerContains(weapons[part][item])) {
              shoppingWeapons.push(weapons[part][item]);
            }
          }
        }
      }
      if (shoppingWeapons.length >= 3) {
        for (let i = 0; i < 3; i++) {
          let randomIndex = Math.floor(Math.random() * shoppingWeapons.length);
          this.shopItems.push(shoppingWeapons[randomIndex]);
          shoppingWeapons.splice(randomIndex, 1);
        }
      } else {
        console.log("You cant buy anything in this moment :)");
      }
      this.updateShopItems();
      this.times.shop = Date.parse(new Date());
      fetch("/shopRefresh", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "id": this.password,
          "time": this.times.shop,
        })
      });
      if (selected == 0) {
        selected = 1;
      } else {
        selected = 0;
      }
      changeSelItem();
    }
  }

  updateShopItems() {
    fetch("/shopItemsUpdate", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": player.password,
        "items": this.shopItems,
      })
    });
  }

  async buyFromShop(index) {
    let item = this.shopItems[index];
    if (item.sold == true) {
      // idk
    } else {
      if (parseInt(this.gold) >= parseInt(item.price)) {
        const response = await fetch("/shopBuy", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "id": this.password,
            "price": item.price,
          })
        });
        const result = await response.json();
        if (result == "True") {
          this.gold -= parseInt(item.price);
          this.backpack.push(item);
          this.shopItems[index].sold = true;
          this.updateShopItems();
          this.saveState();
          changeSelItem();
        }
      }
    }
  }

  //-------------------------------------------------------------------------------------
  //                                        QUESTS
  async redirectToQuests() {
    const response = await fetch("/questVerification", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": this.password
      })
    });
    const oldTime = await response.json();
    let newTime = Date.parse(new Date());
    if (newTime - oldTime > this.onQuest) {
      if (this.onQuest) { // player finished the quest and now its fight time!
        blank();
        changeBackground("images/blank.jpg");
        for (let q in this.questAvailable) {
          if (this.questAvailable[q].sel) {
            //await this.getState();
            this.doQuest(this.questAvailable[q]);
            await this.saveState();
          }
        }
      } else { // selecting a quest and quests are shown
        blank();
        changeBackground("images/blank.jpg");
        addBackButton();
        let quests;
        if (this.questAvailable.length != 3) {
          await this.getState();
          quests = randomQuests(3);
          this.questAvailable = quests;
          this.saveState();
        } else {
          quests = this.questAvailable;
        }
        let selected = 0;
        $("#screen").append($("<center><div class='container'><div id='questDiv' class='row'><div class='col-lg-8'> <ul id='questSelector' class='selectpicker' data-style='btn-dark'> </ul> </div></div></div></center>"));
        $("#questDiv").append($("<div class='col-lg-4' id='questDescription'><p id='des'>" + quests[selected].description + "</p></div>"))
        $("#questDiv").append($("<div class='col-lg-4' id='questXpDiv'><p id='xpRew'>" + quests[selected].xpReward + " xp </p></div>"));
        $("#questDiv").append($("<div class='col-lg-4' id='questTimeDiv'><p id='questTime'>" + quests[selected].time / 60000 + " min </p></div>"));
        $("#questDiv").append($("<div class='col-lg-4' id='questGoldRewDiv'><p id='goldRew'>" + quests[selected].goldReward + " gold </p></div>"))
        for (let i = 0; i < quests.length; i++) {
          $("#questSelector").append($("<li>" + quests[i].name + "</li>").click(() => {
            selected = i;
            $("#des").html(quests[selected].description);
            $("#xpRew").html(quests[selected].xpReward + " xp");
            $("#goldRew").html(quests[selected].goldReward + " gold");
            $("#questTime").html(quests[selected].time / 60000 + " min");
          }));
        }
        $("#questDescription").append($("<div class='row'><div class='col-lg-12'><button class='btn btn-dark'>GO</button></div></div>").click(async () => {
          this.onQuest = quests[selected].time;
          this.questAvailable[selected].sel = true;
          this.saveState();
          fetch("/questTime", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "id": this.password,
              "time": Date.parse(new Date()),
            })
          });
          showQuests();
        }));
      }
    } else { // player is in quest and waiting screen is shown
      blank();
      addBackButton();
      changeBackground("images/blank.jpg");
      $("#screen").append($("<center><p id='pbTime' style=''> </p></center>"));
      $("#screen").append(progressBarCode);
      let time = (this.onQuest - (newTime - oldTime)) / 1000
      let min = Math.floor(time / 60);
      let sec = Math.floor(time - min * 60);
      let remaining = 100 - (time / (this.onQuest / 1000)) * 100;
      $("#pb").css("width", remaining + "%");
      $("#pbTime").html(min + " : " + sec);
      loadingTimeout = setTimeout(showQuests, 1000);
    }
  }

  doQuest(quest) {
    let NPC = this.makeNpc();
    this.attack(NPC).then((result) => {
      if (result) {
        this.xp += quest.xpReward;
        this.gold += quest.goldReward;
      } else {
        this.xp += this.lvl;
      }
      this.questAvailable = randomQuests(3);
      this.onQuest = 0;
      this.saveState();
    })
  }

  makeNpc() {
    let npcCharacter = this.character;
    for (let stat in npcCharacter) {
      npcCharacter[stat] *= Math.random() + 0.3;
      npcCharacter[stat] = Math.floor(npcCharacter[stat]);
    }
    this.calculateCharacter();
    let npcName = npcArr[Math.floor(Math.random() * npcArr.length)]
    return new Enemy(npcName, npcCharacter);
  }

  //-------------------------------------------------------------------------------------
  async saveState() {
    this.lvlUp();
    await fetch("/saveState", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": this.password,
        "questAvailable": this.questAvailable,
        "onQuest": this.onQuest,
        "upgradeCharacter": this.upgradeCharacter,
        "gold": parseInt(this.gold),
        "character": this.character,
        "messages": this.messages,
        "lvl": this.lvl,
        "xp": this.xp,
        "bossLvl": this.bossLvl,
        "fame": this.fame,
        "slots": this.slots,
        "backpack": this.backpack,
      })
    });
    return
  }

  getState() {
    return new Promise(async (resolve) => {
      const response = await fetch("/getState", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "id": this.password,
        })
      });
      const data = await response.json();
      this.questAvailable = data.questAvailable;
      this.onQuest = data.onQuest;
      this.upgradeCharacter = data.upgradeCharacter;
      this.gold = data.gold;
      this.character = data.character;
      this.messages = data.messages;
      this.lvl = data.lvl;
      this.xp = data.xp;
      this.bossLvl = data.bossLvl;
      this.fame = data.fame;
      this.slots = data.slots;
      this.backpack = data.backpack;
      resolve(true);
    })
  }

  async putOn(object) {
    if (this.backpack.indexOf(object) != -1 && object != undefined) {
      await this.getState();
      let prevItem = this.slots[object.slot];
      this.slots[object.slot] = object;
      this.backpack.splice(this.backpack.indexOf(object), 1);
      this.backpack.push(prevItem);
      this.calculateCharacter();
      // console.log("You just putted " + object.name + " on.");
      console.log(this.character);
      console.log(this.slots);
      this.saveState();
      changeInvItem();
      showCharacter();
    }
  }

  async updateStats(stat) {
    await this.getState();
    for (let i = 0; i < Object.keys(this.upgradeCharacter).length; i++) {
      if (Object.keys(this.upgradeCharacter)[i] == stat) {
        let price = this.upgradeCharacter[stat] * 5;
        let ans = prompt("Do you really want to update " + stat + " for " + price + " gold y/n");
        if (ans == "y" && parseInt(this.gold) >= price) {
          console.log("Updating " + stat);
          this.upgradeCharacter[stat] += 2;
          this.gold -= parseInt(price);
          this.saveState();
        } else {
          console.log("Not enough gold");
        }
      }
    }
  }
  /*
    readMessages() { // TODO!!
      for (let i = 0; i < this.messages.length; i++) {
        console.log(this.messages[i]);
      }
      this.messages = [];
    }*/
  //-------------------------------------------------------------------------------------
  //                                FIGHTING
  async fightInArena() {
    await this.getState();
    console.log(this);
    let oldDate = times.arena;
    let newDate = Date.parse(new Date());
    if (newDate - oldDate > 600000) {
      //firebase.database().ref("users").once("value").then((u) => {
      //let userObj = u.val();
      //let enemy = pickRandomEnemy(userObj, this.name);
      const result = await fetch("/randomEnemyArena", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "id": this.password,
        })
      });
      const enemy = await result.json();
      this.attack(enemy).then((result) => {
        if (result) {
          this.gold += 10;
          this.fame += 1;
          this.xp += enemy.lvl * 5;
          this.saveState();
          console.log(this);
          console.log("you won!!")
        } else {
          console.log("you lost!!")
          /*firebase.database().ref("users/" + enemy.name + "/gold").transaction((gold) => {
            return gold += 10;
          });
          firebase.database().ref("users/" + enemy.name + "/fame").transaction((fame) => {
            return fame += 1;
          });
          */
        }
      });
      //  });
      this.times.arena = Date.parse(new Date());
      this.saveState();
      fetch("/arenaTime", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "id": this.password,
          "time": this.times.arena,
        })
      });
    }
  }

  async fightNext() {
    await this.getState();
    let oldDate = times.monster;
    let thisDate = Date.parse(new Date());
    if (thisDate - oldDate > 600000 * 6) {
      if (this.bossLvl >= enemies.length) {
        console.log("No enemies left");
      } else {
        this.attack(enemies[this.bossLvl]).then((result) => {
          if (result) {
            let drop = enemies[this.bossLvl].reward;
            let slot;
            for (let part in weapons) {
              if (weapons[part][drop]) {
                slot = part;
              }
            }
            this.backpack.push(weapons[slot][drop]);
            console.log("You won " + enemies[this.bossLvl].reward);
            console.log("You won " + parseInt(enemies[this.bossLvl].gold) + " gold");
            this.gold += parseInt(enemies[this.bossLvl].gold);
            this.xp += this.bossLvl * 10;
            this.bossLvl++;
            this.saveState();
          }
        });
        this.times.monsters = Date.parse(new Date());
        fetch("/monsterTime", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "id": this.password,
            "time": this.times.monsters,
          })
        });
      }
    }
  }

  attack(others) {
    return new Promise((resolve) => {
      let timeInterval;
      let timeOnBar = -1
      let attackBtn, regenBtn, spellBtn;
      let END = false;
      let enemy = others;
      let me = this;
      let delay = 5000;
      let timeOut = false
      let fight_round = 1
      let myHp = parseInt(me.character.hp);
      let enemyHp = parseInt(others.character.hp);
      attackButtonCreate();
      regenButtonCreate();
      spellButtonCreate();
      myHpBarCreate();
      roundTimeBarCreate();
      enemyHpBarCreate();

      function myHpBarCreate() {
        let _ = $('<div class="progress" id="myHpText" style="width:300px; height:30px; margin: auto;margin-top:15px;"> <div class="progress-bar" id="myHpB" style="width:100%;  background-color: DarkSeaGreen; aria-valuemin ="0";aria-valuemax="100""></div></div>');
        $("#screen").append(_)
      }

      function enemyHpBarCreate() {
        let _ = $('<div class="progress" id="EnemyHpText" style="width:300px; height:30px; margin: auto;margin-top:15px;"> <div class="progress-bar" id="enemyHpB" style="width:100%; background-color: Crimson; aria-valuemin ="0";aria-valuemax="100""></div></div>');
        $("#screen").append(_)
      }

      function roundTimeBarCreate() {
        let _ = $('<div class="progress" style="width:300px; height:30px; margin: auto;margin-top:15px;"> <div class="progress-bar" id="roundTimeBar" style="width:100%; background-color: Gray; aria-valuemin ="0";aria-valuemax="100""></div></div>');
        $("#screen").append(_)
      }

      function regenButtonCreate() {
        regenBtn = $("<button>REGEN</button>").click(() => {
          if (!END) {
            timeOnBar = -1;
            timeInterval = clearInterval(timeInterval);
            timeOut = clearTimeout(timeOut);
            timeOut = false;
            myHp += parseInt(me.character.regen); // potions later
            console.log("REGEN HP: " + parseInt(me.character.regen));
            checkIfDead();
            enemyHit();
            checkIfDead();
            setT();
          }
        });
        $("#screen").append(regenBtn);
      }

      function spellButtonCreate() {
        spellBtn = $("<button>SPELL</button>").click(() => {
          if (!END) {
            timeOnBar = -1;
            timeInterval = clearInterval(timeInterval);
            timeOut = clearTimeout(timeOut);
            timeOut = false;
            if (parseInt(me.spellSlot[0].damage) - parseInt(enemy.character.magicResistance) / 2 > 0) {
              enemyHp -= parseInt(me.spellSlot[0].damage) - parseInt(enemy.character.magicResistance) / 2;
              console.log("SPELL DMG: " + (parseInt(me.spellSlot[0].damage) - parseInt(enemy.character.magicResistance) / 2));
            } else {
              console.log("YOUR SPELL DMG: " + parseInt(me.spellSlot[0].damage), "ENEMY EfMR: " + parseInt(enemy.character.magicResistance) / 2);
            }
            checkIfDead();
            enemyHit();
            checkIfDead();
            setT();
          }
        });
        $("#screen").append(spellBtn);
      }

      function attackButtonCreate() {
        attackBtn = $("<button>ATTACK</button>").click(() => {
          if (!END) {
            timeOnBar = -1;
            timeInterval = clearInterval(timeInterval);
            timeOut = clearTimeout(timeOut);
            timeOut = false;
            let r = Math.random() * 100;
            let luck = me.character.luck;
            if (r < luck / 10) { //CRIT
              let dmg = Math.floor((parseInt(me.character.damage) - parseInt(enemy.character.armor) / 2) * (r / 100 + 1));
              myHp += parseInt(me.character.regen);
              if (dmg > 0) {
                enemyHp -= dmg;
                console.log("YOUR CRIT DMG: " + dmg);
                console.log("YOU REGENERATED: " + me.character.regen);
              } else {
                console.log("Your DMG: " + dmg, "His AfA: " + parseInt(enemy.character.armor) / 2);
                console.log("YOU REGENERATED: " + me.character.regen);
              }
            } else if (r < luck) { //NORMAL
              if (parseInt(me.character.damage) - parseInt(enemy.character.armor) / 2 > 0) {
                enemyHp -= parseInt(me.character.damage) - parseInt(enemy.character.armor) / 2;
                console.log("YOUR ATTACK DMG: " + (parseInt(me.character.damage) - parseInt(enemy.character.armor) / 2));
              } else {
                console.log("YOUR DMG: " + parseInt(me.character.damage), "His EfA: " + parseInt(enemy.character.armor) / 2)
              }
            } else { //MISS
              console.log("YOU MISSED");
            }
            checkIfDead();
            enemyHit();
            checkIfDead();
            setT();
          }
        });
        $("#screen").append(attackBtn);
      }

      function enemyHit() {
        let roundDmg;
        if (!END) {
          let r = Math.random() * 100;
          let luck = enemy.character.luck;
          if (r < luck / 10) { //CRIT
            let dmg = Math.floor((parseInt(enemy.character.damage) - parseInt(me.character.armor) / 2) * (r / 100 + 1));
            roundDmg = dmg;
            enemyHp += parseInt(enemy.character.regen)
            if (dmg > 0) {
              myHp -= dmg;
              console.log("ENEMY CRIT DMG: " + dmg);
              console.log("ENEMY REGENERATED: " + parseInt(enemy.character.regen))
            } else {
              console.log("ENEMY DMG: " + dmg, "Your AfA: " + parseInt(me.character.armor) / 2);
              console.log("ENEMY REGENERATED: " + parseInt(enemy.character.regen))
            }
          } else if (r < luck) { //NORMAL
            if (parseInt(enemy.character.damage) - parseInt(me.character.armor) / 2 > 0) {
              myHp -= parseInt(enemy.character.damage) - parseInt(me.character.armor) / 2;
              roundDmg = parseInt(enemy.character.damage) - parseInt(me.character.armor) / 2;
              console.log("ENEMY ATTACK DMG: " + (parseInt(enemy.character.damage) - parseInt(me.character.armor) / 2));
            } else {
              console.log("ENEMY DMG: " + parseInt(enemy.character.damage), "Your EfA: " + parseInt(me.character.armor) / 2)
            }
          } else { //
            roundDmg = "Missed";
            console.log("ENEMY MISSED");
          }
          fight_round += 1;
          console.log("your HP: " + myHp, "enemy HP:" + enemyHp, "round :" + fight_round);
        }
        let enemyRemainingHp = (enemyHp / enemy.character.hp) * 100
        $("#enemyHpB").css("width", enemyRemainingHp + "%");
        let myRemainingHp = (myHp / me.character.hp) * 100
        $("#myHpB").css("width", myRemainingHp + "%");
        $("#myHpB").html("<b><p style='color:black;font-size:25px '>" + myHp + "</p></b>");
        $("#enemyHpB").html("<b><p style='color:black;font-size:25px '>" + enemyHp + "</p></b>");
      }

      function checkIfDead() {
        if (fight_round >= 100 && !END) {
          timeInterval = clearInterval(timeInterval);
          console.log("fightRounds");
          console.log("Its a draw");
          timeOut = clearTimeout(timeOut);
          attackBtn.remove();
          regenBtn.remove();
          spellBtn.remove();
          addBackButton();
          $("#screen").append("<b><p>Maximum rounds reached</p></b>")
          END = true;
          resolve(false);
        }
        if ((myHp <= 0 || enemyHp <= 0) && !END) {
          timeInterval = clearInterval(timeInterval);
          timeOut = clearTimeout(timeOut);
          attackBtn.remove();
          regenBtn.remove();
          spellBtn.remove();
          addBackButton();
          END = true;
          if (myHp <= 0) {
            $("#screen").append("<b><p>YOU LOST</p></b>")
            console.log("You lost");
            resolve(false);
          }
          if (enemyHp <= 0) {
            $("#screen").append("<b><p>YOU WON</p></b>")
            console.log("You won");
            resolve(true);
          }
        }
      }

      function setT() {
        if (timeOut == false) {
          timeInterval = setInterval(() => {
            timeOnBar++;
            let w = 100 - ((timeOnBar / ((delay / 1000) - 1)) * 100)
            $("#roundTimeBar").css("width", w + "%");
            $("#roundTimeBar").html("<b><p style='color:black;font-size:25px'>" + (5 - (timeOnBar + 1)) + "</p></b>");
          }, 1000);
          timeOut = setTimeout(() => {
            attackBtn.trigger("click");
          }, delay);
        }
      }
      setT();
    });
  }
  //-------------------------------------------------------------------------------------
  //                                    HELP FUNCTIONS
  lvlUp() {
    if (this.xp > Math.pow(3, this.lvl)) {
      this.xp -= Math.pow(3, this.lvl);
      this.gold += Math.pow(2, this.lvl);
      this.lvl++;
      console.log("You received " + Math.pow(2, this.lvl) + " gold!");
      console.log("You reached " + this.lvl + " lvl!");
      this.lvlUp();
    }
  }

  backpackContains(item) {
    for (let backpackItem in this.backpack) {
      if (item.name == this.backpack[backpackItem].name) {
        return true
      }
    }
    return false
  }

  playerContains(item) {
    for (let _ in this.slots[item.slot]) {
      if (item.name == this.slots[item.slot].name) {
        return true
      }
    }
    return false
  }
}