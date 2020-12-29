let invSelected;
let spellSelected;
function showPlayer() {
  blank();
  addBackButton();
  changeBackground("images/screens/blank.jpg");
  invSelected = 0;
  spellSelected = 0;
  let parent = $(`
  <div class='container' style='margin-top:150px; margin-left:215px'>
    <div class='row' id='main'>
      <div class='col-lg-4' id='stats' style='position:absolute;padding:0px;width:440px;'>
        <div class='row' id='items' style="border:solid gray; height:621px; width:440px;">
        </div>
        <div class='row' id='itemBtns' style="margin-top:8px; margin-left:-15px; margin-right:0px;">
        </div>
      </div>
      <div class='col-lg-4' id='me' style='position: absolute; margin-left: 470px;padding-left:0px'>
        <div class='row' id='meStats' style="border:solid black 3px; height: 675px; width: 581px;">
        </div>
      </div>
      <div class='col-lg-4' id='spells' style='position: absolute; margin: 0 0 0 1080px;padding:0px; width:440px;'>
        <div class='row' id='meSpells' style="border:solid gray; height: 621px; width: 440px; ">
        </div>
        <div class='row' id='spellBtns' style="margin-top:8px; margin-left:-15px;">
        </div>
      </div>
    </div>
  </div>`);
  $("#screen").append(parent);
  if (player.backpack.length > 0) changeInvItem();
  if (player.spellSlot.length > 0) changeSpell();
  backwardIBtn();
  putOnButton();
  forwardIBtn();
  //spells
  backwardSpellBtn();
  putOnSpellButton();
  upgradeSpellButton();
  forwardSpellBtn();
  showCharacter();
}

function changeSpell(){
  let parent = $("#meSpells");
  parent.empty();
  let selectedItem = player.spellSlot[spellSelected];
  parent.append($("<center><b><p style='height:55px; font-size:25px;width:440px'>" + selectedItem.name + "</p></b></center>"));
  parent.append($("<center><p style='height:55px; font-size:25px;width:440px'>" + "Damage: " + selectedItem.damage + "</p></center>"));
}

function showCharacter() {
  let parent = $("#meStats");
  parent.empty();
  parent.append($("<center><b><p style='height:45px; font-size:25px;width: 581px'>" + player.name + "</p></b></center>"));
  parent.append($("<center><p style='height:32px; font-size:17px;width: 581px'>" + "Lvl: " + player.lvl + "</p></center>"));
  parent.append($("<center><p style='height:32px; font-size:17px;width: 581px'>" + player.gold + "  <img src='images/gold.png' height='17px'> </p></center>"));
  for (let property in player.character) {
    parent.append(
      $('<center><p style="height:32px; font-size:17px;width: 581px">' + con(property) + ": " + player.character[property] + '</p></center>')
    );
  }
  for (let slot in player.slots) {
    parent.append($("<center><p style='height:32px; font-size:17px;width: 581px'> " + con(slot) + ": " + player.slots[slot].name + "</p></center>"))
  }
}

function changeInvItem() {
  let parent = $("#items");
  parent.empty();
  let selectedItem = player.backpack[invSelected];
  parent.append($("<center><b><p style='height:55px; font-size:25px;width:440px'>" + selectedItem.name + "</p></b></center>"));
  parent.append($("<center><p style='height:50px; font-size:20px;width:440px'>" + "Slot: " + con(selectedItem.slot) + "</p></center>"));
  parent.append($("<center><p style='height:50px; font-size:20px;width:440px'>" + "Price: " + selectedItem.price + " <img src='images/gold.png' height='17px'> </p></center>"));
  for (let property in selectedItem.properties) {
    parent.append(
      $('<center><p style="height:50px; font-size: 20px;width:440px">' + con(property) + ": " + selectedItem.properties[property] + '</p></center>')
    );
  }
}
// INVENTORY
function backwardIBtn() {
  $("#itemBtns").append($("<button class='btn btn-dark' style='margin-left:0'> <- </button>")
    .click(() => {
      invSelected--;
      if (invSelected < 0) invSelected = player.backpack.length - 1;
      changeInvItem();
    }));
}

function forwardIBtn() {
  $("#itemBtns").append($("<button class='btn btn-dark' style='margin-left:45px; '> -> </button>")
    .click(() => {
      invSelected++;
      if (invSelected > player.backpack.length - 1) invSelected = 0;
      changeInvItem();
    }));
}

function putOnButton() {
  screenButtons.putOnBtn = $("<button class='btn btn-dark' style='margin-left:50px;'>Equip</button>")
    .appendTo("#itemBtns");
  screenButtons.putOnBtn.click(async () => {
    await player.putOn(player.backpack[invSelected]);
  });
}
// SPELLS
function backwardSpellBtn() {
  $("#spellBtns").append($("<button class='btn btn-dark' style='margin-left:0px;width:100px;'> <- </button>")
    .click(() => {
      spellSelected--;
      if (spellSelected < 0) spellSelected = player.spellSlot.length - 1;
      changeSpell();
    }));
}

function putOnSpellButton() {
  $("#spellBtns").append($("<button class='btn btn-dark' style='margin-left:13px;width:100px;'>Equip</button>")
    .click(async () => {
      await player.putOnSpell(player.spellSlot[spellSelected]);
    }));
}

function upgradeSpellButton() {
  $("#spellBtns").append($("<button class='btn btn-dark' style='margin-left:14px;width:100px;'> + </button>")
    .click(() => {

    }));
}


function forwardSpellBtn() {
  $("#spellBtns").append($("<button class='btn btn-dark' style='margin-left:13px;width:100px;'> -> </button>")
    .click(() => {
      spellSelected++;
      if (spellSelected > player.spellSlot.length - 1) spellSelected = 0;
      changeInvItem();
    }));
}