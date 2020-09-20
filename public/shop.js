let selected;

function redirectToShop() {
  blank();
  changeBackground("images/screens/shop.jpg");
  addBackButton();
  selected = 0;
  let parent = $(`<div class='container' style='margin-top:225px;'>
                      <div class='row' id='shopItem'></div>
                      <div id='shopBtns'style='margin-top:572px;'class='row'></div>
                  </div>`);
  $("#screen").append(parent);
  $("#shopItem").append(
    $("<div class='col-lg-6' id='itemStats' style='position: absolute; height:560px; width:560px;margin-left:-80px'></div>")
  );
  $("#shopItem").append(
    $(`<div class='col-lg-6' id='itemImg' style='position: absolute; height:560px; width:560px; margin-left:635px;'>
         <img id='itemImagePNG' width='560' height='560' style='margin-left:-15px'>
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
    $("<center><b><p style='height:65px; font-size: 40px; margin-top:15px;'>" + itemName + "</p></b></center>")
    .css("color", titleColor)
  );

  parent.append(
    $("<center><p style='height:52px; font-size: 29px'>" + "Slot: " + itemSlot + "</p></center>")
  );

  let itemPriceHTML = $("<center><p style='height:52px; font-size: 29px'>" + "Price: " + itemPriceValue + " <img src='images/gold.png' height='29' ><center>");
  parent.append(itemPriceHTML);
  $("#itemImagePNG").attr("src", 'images/items/' + itemName + '.png');
  (player.gold >= player.shopItems[selected].price) ? itemPriceHTML.css('color', 'Chartreuse'): itemPriceHTML.css('color', 'red');

  for (let property in player.shopItems[selected].properties) {
    let propertyVal = player.shopItems[selected].properties[property]
    parent.append($('<center><p style="height:52px; font-size: 29px " >' + con(property) + ": " + propertyVal + '</p></center>'));
  }

  if (player.shopItems[selected].sold == true) {
    itemPriceHTML.html("SOLD")
      .css("color", "red")
      .css("font-size", "29px")
      .css("height", "52px")
  }
}

function forwardSBtn() {
  $("#shopBtns").append(
    $("<button class='btn btn-dark' style='margin-left:1080px'> -> </button>")
    .css('position', 'absolute')
    .click(() => {
      selected++;
      if (selected > player.shopItems.length - 1) selected = 0;
      changeSelItem();
    })
  );
}

function backwardSBtn() {
  $("#shopBtns").append($("<button class='btn btn-dark' style='margin-left:-82px'> <- </button>")
    .css('position', 'absolute')
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
  $("#shopBtns").append($("<button class='btn btn-dark' style='margin-left:366px'>Buy</button>")
    .css('position', 'absolute')
    .appendTo("#shopBtns").click(() => {
      player.buyFromShop(selected);
    }));
}

function reloadShopBtn() {
  $("<button id='reloadShop' class='btn btn-dark' style='margin-left:631px'>Reload</button>")
    .css('position', 'absolute')
    .appendTo("#shopBtns")
    .mouseover(showShopTime)
    .mouseout(showShopTitle)
    .click(() => {
      showShop();
    })
}