let invSelected;
let spellSelected;

function showPlayer() {
  blank();
  addBackButton();
  changeBackground("images/screens/blank.jpg");
  invSelected = 0;
  spellSelected = 0;
  let parent = $(`
  <div class='container' style='margin-top:13.88vh; margin-left:11.1979vw'>
    <div class='row' id='main'>
      <div class='col-lg-4' id='stats' style='position:absolute;padding:0vw;width:22.916vw;'>
        <div class='row' id='items' style="border:solid gray; height:57.5vh; width:22.916vw;">
        </div>
        <div class='row' id='itemBtns' style="margin-top:0.7407vh; margin-left:-0.78vw; margin-right:0vw;">
        </div>
      </div>
      <div class='col-lg-4' id='me' style='position: absolute; margin-left: 24.47vw;padding-left:0vw'>
        <div class='row' id='meStats' style="border:solid black 0.156vw; height: 62.5vh; width: 30.26vw;">
        </div>
      </div>
      <div class='col-lg-4' id='spells' style='position: absolute; margin: 0 0 0 56.25vw;padding: 0vw; 22.916vw;'>
        <div class='row' id='meSpells' style="border:solid gray; height: 57.5vh; width: 22.916vw; ">
        </div>
        <div class='row' id='spellBtns' style="margin-top:0.7407vh; margin-left:-0.78vw;">
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

function changeSpell() {
  let parent = $("#meSpells");
  parent.empty();
  let selectedItem = player.spellSlot[spellSelected];
  parent.append($("<center><b><p style='height:5.0925vh; font-size:2.3148vh;width:22.916vw'>" + selectedItem.name + "</p></b></center>"));
  parent.append($("<center><p style='height:5.0925vh; font-size:2.3148vh;width:22.916vw'>" + "Damage: " + selectedItem.damage + "</p></center>"));
}

function showCharacter() {
  let parent = $("#meStats");
  parent.empty();
  parent.append($("<center><b><p style='height:4.166vh; font-size:2.3148vh;width: 30.26vw'>" + player.name + "</p></b></center>"));
  parent.append($("<center><p style='height:2.9629vh; font-size:1.574vh;width: 30.26vw'>" + "Lvl: " + player.lvl + "</p></center>"));
  parent.append($("<center><p style='height:2.9629vh; font-size:1.574vh;width: 30.26vw'>" + player.gold + "  <img src='images/gold.png' height='1.574vh'> </p></center>"));
  for (let property in player.character) {
    parent.append(
      $('<center><p style="height:2.9629vh; font-size:1.574vh;width: 30.26vw">' + con(property) + ": " + player.character[property] + '</p></center>')
    );
  }
  for (let slot in player.slots) {
    parent.append($("<center><p style='height:2.9629vh; font-size:1.574vh;width: 30.26vw'> " + con(slot) + ": " + player.slots[slot].name + "</p></center>"))
  }
}

function changeInvItem() {
  let parent = $("#items");
  parent.empty();
  let selectedItem = player.backpack[invSelected];
  parent.append($("<center><b><p style='height:5.0925vh; font-size:2.3148vh;width:22.916vw'>" + selectedItem.name + "</p></b></center>"));
  parent.append($("<center><p style='height:4.6296vh; font-size:1.85vh;width:22.916vw'>" + "Slot: " + con(selectedItem.slot) + "</p></center>"));
  parent.append($("<center><p style='height:4.6296vh; font-size:1.85vh;width:22.916vw'>" + "Price: " + selectedItem.price + " <img src='images/gold.png' height='1.574vh'> </p></center>"));
  for (let property in selectedItem.properties) {
    parent.append(
      $('<center><p style="height:4.6296vh; font-size: 1.85vh;width:22.916vw">' + con(property) + ": " + selectedItem.properties[property] + '</p></center>')
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
  $("#itemBtns").append($("<button class='btn btn-dark' style='margin-left:2.34375vw; '> -> </button>")
    .click(() => {
      invSelected++;
      if (invSelected > player.backpack.length - 1) invSelected = 0;
      changeInvItem();
    }));
}

function putOnButton() {
  screenButtons.putOnBtn = $("<button class='btn btn-dark' style='margin-left:4.6296vh;'>Equip</button>")
    .appendTo("#itemBtns");
  screenButtons.putOnBtn.click(async () => {
    await player.putOn(player.backpack[invSelected]);
  });
}
// SPELLS
function backwardSpellBtn() {
  $("#spellBtns").append($("<button class='btn btn-dark' style='margin-left:0vw;width:5.20833vw;'> <- </button>")
    .click(() => {
      spellSelected--;
      if (spellSelected < 0) spellSelected = player.spellSlot.length - 1;
      changeSpell();
    }));
}

function putOnSpellButton() {
  $("#spellBtns").append($("<button class='btn btn-dark' style='margin-left:0.677vw;width:5.20833vw;'>Equip</button>")
    .click(async () => {
      await player.putOnSpell(player.spellSlot[spellSelected]);
    }));
}

function upgradeSpellButton() {
  $("#spellBtns").append($("<button class='btn btn-dark' style='margin-left:0.729vw;width:5.20833vw;'> + </button>")
    .click(() => {

    }));
}


function forwardSpellBtn() {
  $("#spellBtns").append($("<button class='btn btn-dark' style='margin-left:0.677vw;width:5.20833vw;'> -> </button>")
    .click(() => {
      spellSelected++;
      if (spellSelected > player.spellSlot.length - 1) spellSelected = 0;
      changeInvItem();
    }));
}