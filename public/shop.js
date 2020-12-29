let selected;

function redirectToShop() {
  blank();
  changeBackground("images/screens/shop.jpg");
  addBackButton();
  selected = 0;
  let parent = $(`<div style='margin-top:21vh;'>
                      <div id='shopItem' style="margin-left:16.166vw"></div>
                      <div id='shopBtns'style='margin-top:1vh;'></div>
                  </div>`);
  $("#screen").append(parent);
  $("#shopItem").append(
    $("<div id='itemStats' style='height:51.85vh; width:29.166vw'></div>")
  );
  $("#shopItem").append(
    $(`<div id='itemImg' style='height:51.85vh; width:29.166vw; margin-left:38.0729vw; margin-top:-52vh'>
         <img id='itemImagePNG' style='margin-left:-0.78vw;width:29.166vw;height:51.851vh'>
      </div>`)
  );
  changeSelItem();
  backwardSBtn();
  reloadShopBtn();
  buyButton();
  forwardSBtn();
}

function changeSelItem() {
  let parent = $("#itemStats")
    .css("color", "white");
  parent.empty();
  let titleColor;
  let itemPriceValue = player.shopItems[selected].price
  let itemName = player.shopItems[selected].name
  let itemSlot = con(player.shopItems[selected].slot)

  titleColor = (player.shopItems[selected].price >= 10000) ? "Tomato" : "White";
  if (player.shopItems[selected].price >= 100000) titleColor = "MediumSpringGreen"
  if (player.shopItems[selected].price >= 500000) titleColor = "DeepPink"

  parent.append(
    $("<center><b><p style='height:6.018vh; font-size: 3.703vh; margin-top:1.388vh;'>" + itemName + "</p></b></center>")
    .css("color", titleColor)
  );

  parent.append(
    $("<center><p style='height:4.8148vh; font-size: 2.6851vh'>" + "Slot: " + itemSlot + "</p></center>")
  );

  let itemPriceHTML = $("<center><p style='height:4.8148vh; font-size: 2.6851vh'>" + "Price: " + itemPriceValue + " <img src='images/gold.png' height='29' ><center>");
  parent.append(itemPriceHTML);
  $("#itemImagePNG").attr("src", 'images/items/' + itemName + '.png');
  (player.gold >= player.shopItems[selected].price) ? itemPriceHTML.css('color', 'Chartreuse'): itemPriceHTML.css('color', 'red');

  for (let property in player.shopItems[selected].properties) {
    let propertyVal = player.shopItems[selected].properties[property]
    parent.append($('<center><p style="height:4.8148vh; font-size: 2.6851vh" >' + con(property) + ": " + propertyVal + '</p></center>'));
  }

  if (player.shopItems[selected].sold == true) {
    itemPriceHTML.html("SOLD")
      .css("color", "red")
      .css("font-size", "2.6851vh")
      .css("height", "4.8148vh")
  }
}

function forwardSBtn() {
  $("#shopBtns").append(
    $("<button class='btn btn-dark' style='margin-left:76.8vw;margin-top:-4.7vh'> -> </button>")
    .click(() => {
      selected++;
      if (selected > player.shopItems.length - 1) selected = 0;
      changeSelItem();
    })
  );
}

function backwardSBtn() {
  $("#shopBtns").append($("<button class='btn btn-dark' style='margin-left:16vw'> <- </button>")
    .click(() => {
      selected--;
      if (selected < 0) selected = player.shopItems.length - 1;
      changeSelItem();
    }));

}

function showShop() {
  player.showShop();
}

function buyButton() {
  $("#shopBtns").append($("<button class='btn btn-dark' style='margin-left:39.5vw;margin-top:-4.7vh'>Buy</button>")
    .appendTo("#shopBtns").click(() => {
      player.buyFromShop(selected);
    }));
}

function reloadShopBtn() {
  $("<button id='reloadShop' class='btn btn-dark' style='margin-left:53.3vw;margin-top:-4.7vh'>Reload</button>")
    .appendTo("#shopBtns")
    .mouseover(showShopTime)
    .mouseout(showShopTitle)
    .click(() => {
      showShop();
    })
}