let player, myName;
let password, select, shopSelect;
let loadingTimeout;
let indexPlayFight = 0;
let speedPlayFight = 500;
let enemies = [];
let npcArr = [];
let times = {
	monsterS: undefined,
	monsterM: undefined,
	monster: undefined,
	arenaS: undefined,
	arenaM: undefined,
	arena: undefined,
	shopS: undefined,
	shopM: undefined,
	shop: undefined,
	questM: undefined,
	questS: undefined,
	quest: undefined,
}
let screenButtons = {
	signout: undefined,
	arenaBtn: undefined,
	monsterBtn: undefined,
	playerBtn: undefined,
	putOnBtn: undefined,
	fameBtn: undefined,
	questBtn: undefined,
}
/*
TODO:
FIREBALL - UPGRADES ////
HEALING BTN WITH POTIONS - 20%HP UP (MAX)
ABSOLUTE POSITIONS
QUESTS LAYOUT
INVENTORY LAYOUT
FAME TREE
*/

//--------------------------------------------------------------------------------------------
//                                   MAIN FUNCTION
// loads weapons, when site loads
function setup() {
	$.getJSON("weapons.json", function (json) {
		weapons = json;
		loadEnemies();
		loadNpcs();
	});
}

//-----------------------------------------------------------------------------------------
//MAINSCREEN, sets all things, append all buttons...
function loadWorld() {
	clearTimeout(loadingTimeout);
	changeBackground("images/village.jpg")
	$("#buttons").empty();
	$("#shopSel").empty();
	$("#selector").empty();
	blank();
	let parent = $("#buttons");
	screenButtons.signout = $("<button class='btn btn-dark' id='signoutButt'>Sign Out</button>").click(signOut);
	screenButtons.arenaBtn = $("<button class='btn btn-dark' id='arenaButt'>Arena</button>").click(arenaFight);
	screenButtons.monsterBtn = $("<button class='btn btn-dark' id='monstersButt'>Monsters</button>").click(fightMonsters);
	screenButtons.playerBtn = $("<button class='btn btn-dark' id='playerButt'>Player</button>").click(showPlayer);
	screenButtons.fameBtn = $("<button class='btn btn-dark' id='fameButt'>Fame</button>").click(showBestPlayers);
	screenButtons.questBtn = $("<button class='btn btn-dark' id='questButt'>Quests</button>").click(showQuests);
	screenButtons.showShopBtn = $("<button class='btn btn-dark' id='showShopButt'>Shop</button>").click(redirectToShop);
	screenButtons.arenaBtn.mouseover(showArenaTime);
	screenButtons.arenaBtn.mouseout(showArenaTitle);
	screenButtons.monsterBtn.mouseover(showMonsterTime);
	screenButtons.monsterBtn.mouseout(showMonsterTitle);
	screenButtons.questBtn.mouseover(showQuestTime);
	screenButtons.questBtn.mouseout(showQuestTitle);
	parent.append(screenButtons.signout);
	parent.append(screenButtons.arenaBtn);
	parent.append(screenButtons.monsterBtn);
	parent.append(screenButtons.playerBtn);
	parent.append(screenButtons.fameBtn);
	parent.append(screenButtons.questBtn);
	parent.append(screenButtons.showShopBtn);
}
//---------------------------------------------------------------------------------------
//                                       BUTTON CLICKS

// shows the "tree" of best players and their fame
function showBestPlayers() {
	console.log("Currently unavailable :(");
	blank();
	addBackButton();
	changeBackground("images/blank.jpg");
	/*
	let bestPlayers = [];
	firebase.database().ref("users").on("value", function (snapshot) {
		snapshot.forEach(function (data) {
			let user = data.val();
			bestPlayers.push({
				name: user.name,
				fame: user.fame
			});
		});
		bestPlayers.sort((a, b) => {
			return b.fame - a.fame;
		});
		let bp = []; //bestPlayers
		let bpf = []; //bestPlayers fame
		if (bestPlayers[0].name) {
			bp.push(bestPlayers[0].name);
			bpf.push(bestPlayers[0].fame);
		}
		if (bestPlayers[1].name) {
			bp.push(bestPlayers[1].name);
			bpf.push(bestPlayers[1].fame);
		}
		if (bestPlayers[2].name) {
			bp.push(bestPlayers[2].name);
			bpf.push(bestPlayers[2].fame);
		}
		console.log(bp, bpf);
	});*/
}

// redirect to quests
async function showQuests() {
	player.saveState()
	const response = await fetch("/questVerification", {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"id": player.password
		})
	});
	const oldTime = await response.json();
	let newTime = Date.parse(new Date());
	if (newTime - oldTime > player.onQuest) {
		if (player.onQuest) { // player finished the quest and now its fight time!
			blank();
			changeBackground("images/blank.jpg");
			for (let q in player.questAvailable) {
				if (player.questAvailable[q].sel) {
					player.doQuest(player.questAvailable[q]);
				}
			}
		} else { // selecting a quest and quests are shown
			blank();
			changeBackground("images/blank.jpg");
			addBackButton();
			let quests;
			if (player.questAvailable.length != 3) {
				quests = randomQuests(3);
				player.questAvailable = quests;
				player.saveState();
			} else {
				quests = player.questAvailable;
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
			$("#questDescription").append($("<div class='row'><div class='col-lg-12'><button class='btn btn-dark'>GO</button></div></div>").click(() => {
				player.onQuest = quests[selected].time;
				player.questAvailable[selected].sel = true;
				player.saveState();
				fetch("/questTime", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"id": player.password,
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
		let time = (player.onQuest - (newTime - oldTime)) / 1000
		let min = Math.floor(time / 60);
		let sec = Math.floor(time - min * 60);
		let remaining = 100 - (time / (player.onQuest / 1000)) * 100;
		$("#pb").css("width", remaining + "%");
		$("#pbTime").html(min + " : " + sec);
		loadingTimeout = setTimeout(showQuests, 1000);
	}
}

// fight in arena
function arenaFight() {
	blank();
	changeBackground("images/blank.jpg");
	if ((times.arenaM == undefined && times.arenaS == undefined) || (times.arenaM == 0 && times.arenaS == 0)) {
		player.fightInArena();
	} else {
		addBackButton();
		$("#screen").append($("<center><p id='pbTime' style=''> </p></center>"));
		$("#screen").append(progressBarCode);
		let sec = times.arenaS;
		let min = times.arenaM;
		let remaining = (1 - ((min * 60 + sec) / 600)) * 100;
		$("#pb").css("width", remaining + "%");
		$("#pbTime").html(min + " : " + sec);
		loadingTimeout = setTimeout(arenaFight, 1000);
	}
}

// fight the next monster 
function fightMonsters() {
	blank();
	changeBackground("images/blank.jpg");
	if ((times.monsterM == undefined && times.monsterS == undefined) || (times.monsterM == 0 && times.monsterS == 0)) {
		player.fightNext();
	} else {
		addBackButton();
		$("#screen").append($("<center><p id='pbTime' style=''> </p></center>"));
		$("#screen").append(progressBarCode);
		let sec = times.monsterS;
		let min = times.monsterM;
		let remaining = (1 - ((min * 60 + sec) / 3600)) * 100;
		$("#pb").css("width", remaining + "%");
		$("#pbTime").html(min + " : " + sec);
		loadingTimeout = setTimeout(fightMonsters, 1000);
	}
}

//-----------------------------------------------------------------------------------------
// 							HELPING FUNCTIONS

// empty the screen element 
function emptyScreen() {
	$("#screen").empty();
}

//deletes all elements on site
function blank() {
	$("#buttons").empty();
	$("#shopSel").empty();
	$("#selector").empty();
	emptyScreen();
}

//adds a backbutton to #screen
function addBackButton() {
	$("#buttons").append($("<button class='btn btn-dark' id='bb'>Back</button>").click(loadWorld));
}

//creates num of quest with random rewards
function randomQuests(num) {
	let quests = [];
	let returnList = [];
	for (quest in weapons["Quests"]) {
		quests.push(weapons["Quests"][quest]);
	}
	for (let i = 0; i < num; i++) {
		let index = Math.floor(Math.random() * quests.length);
		returnList.push(quests[index]);
		quests.splice(index, 1);
	}
	for (let j = 0; j < returnList.length; j++) {
		returnList[j].goldReward = 1 + Math.floor(Math.random() * player.lvl * 12);
		returnList[j].xpReward = Math.floor(1 + Math.random() * player.lvl * 7);
		returnList[j].time = Math.floor(((returnList[j].goldReward + returnList[j].xpReward) * 60000) * (player.character.weight / 100));
	}
	return returnList;
}

//changes background to image located on str
function changeBackground(str) {
	$("body").css("background-image", `url(${str})`);
}

//updates all times(quest time, arena time...) 
async function updateTimes(str) {
	const options = {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"id": player.password
		})
	}
	const response = await fetch("/times", options)
	const serverTimes = await response.json();
	if (serverTimes == "undefined") {
		console.log("Failed to update times");
		return;
	}
	if (str === "load") { // just for loading into the game 
		loadWorld();
		setInterval(updateTimes, 1000);
	}
	let oldTime = serverTimes.monsters;
	let newTime = Date.parse(new Date());
	times.monster = oldTime;
	if (newTime - oldTime > 600000 * 6) {
		times.monsterM = 0;
		times.monsterS = 0;
	} else {
		let time = (600000 * 6 - (newTime - oldTime)) / 1000;
		times.monsterM = Math.floor(time / 60);
		times.monsterS = Math.floor(time - times.monsterM * 60);
	}
	oldTime = serverTimes.shop
	times.shop = oldTime;
	if (player.shopItems == undefined || player.shopItems.length == 0) {
		player.showShop();
	}
	if (newTime - oldTime > 600000) {
		times.shopM = 0;
		times.shopS = 0;

	} else {
		let time = (600000 - (newTime - oldTime)) / 1000
		times.shopM = Math.floor(time / 60);
		times.shopS = Math.floor(time - times.shopM * 60);
	}
	oldTime = serverTimes.arena;
	times.arena = oldTime;
	if (newTime - oldTime > 600000) {
		times.arenaS = 0;
		times.arenaM = 0;

	} else {
		let time = (600000 - (newTime - oldTime)) / 1000
		times.arenaM = Math.floor(time / 60);
		times.arenaS = Math.floor(time - times.arenaM * 60);
	}
	oldTime = serverTimes.quest;
	times.quest = oldTime;
	if (newTime - oldTime > player.onQuest) {
		times.questS = 0;
		times.questM = 0;
	} else {
		let time = (player.onQuest - (newTime - oldTime)) / 1000
		times.questM = Math.floor(time / 60);
		times.questS = Math.floor(time - times.questM * 60);
	}
	if (times.questM == 0 && times.questS == 0 && player.onQuest) {
		screenButtons.questBtn.removeClass();
		screenButtons.questBtn.addClass("btn");
		screenButtons.questBtn.addClass("btn-success");
	} else {
		screenButtons.questBtn.addClass("btn");
		screenButtons.questBtn.addClass("btn-dark");
	}
}

//takes a programming string and replace it with actual word
function con(str) {
	let string;
	switch (str) {
		case "armor":
			string = "Armor";
			break;
		case "hp":
			string = "HP";
			break;
		case "damage":
			string = "Damage";
			break;
		case "luck":
			string = "Luck";
			break;
		case "magicResistance":
			string = "Magic Resistance";
			break;
		case "regen":
			string = "Regeneration";
			break;
		case "weight":
			string = "Weight";
			break;
		case "rightArm":
			string = "Right Arm";
			break;
		case "leftArm":
			string = "Left Arm";
			break;
		case "ring":
			string = "Ring";
			break;
		case "head":
			string = "Head";
			break;
		case "body":
			string = "Body";
			break;
		case "neck":
			string = "Neck";
			break;
	}
	return string;
}