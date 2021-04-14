//------------ Popup til Produktinfo --------------------------

const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.parentNode.querySelector("#modal");
    openModal(modal);
  });
});

if (overlay){
      overlay.addEventListener("click", () => {
      const modals = document.querySelectorAll(".modal.active");
      modals.forEach((modal) => {
        closeModal(modal);
      });
    });
};


closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}


//-------------------- definerer klasse for hvert produkt som selges i butikken, slik at hvert objekt ser likt ut -----------------
class product {
  constructor(name, category, price, image) {
    this.name = name;
    this.category = category;
    this.price = price;
    this.image = image;
  }

  //-------------------- Gir produkt-objektet en metode som legger protuktet til i handlelista, eller øker antallet ------------
  addToCart() {
    for (let i = 0; i < shoppingCart.length; i++) {
      if (shoppingCart[i].item === this) {
        shoppingCart[i].quantity++;
        return shoppingCart;
      }
    }
    shoppingCart.push(new order(this, 1));

    return shoppingCart;
  }
}

//------------------------ Definerer klasse for hver bestilling som legges til i handlelista, med produkt og antall -------------
class order {
  constructor(item, quantity) {
    this.item = item;
    this.quantity = quantity;
  }
}

let shoppingCart = [];

//--------------------------------- Shortcut funksjoner for å lagre handlelista lokalt i nettleseren - Nødvendig for at handlelista skal overføres mellom html-filene.
function storeShoppingCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    uploadShoppingCart();
}
function fetchShoppingCart() {
  let storedCart = JSON.parse(sessionStorage.getItem("shoppingCart"));
  if (storedCart) {
    shoppingCart = storedCart;
  }
}

/* ---------------------------- Førsteutkast i en vis-handleliste funksjon, som ikke er slettet av sentimentale årsaker.
function purchaseCart(customCart) {
    let cart = customCart || shoppingCart;
    console.log(cart);
    
    for (i = 0; i < cart.length; i++) {
        let item = cart[i].item;
        let quantity = cart[i].quantity;
        
        let price = item.price * quantity;
        console.log(price);
        
        let name = item.name;
        let url = item.image;
    };
    
};*/

//-------------------- gir alle "kjøp" knappene eventlistener som ved klikk kjører funksjonen "addToCart", sender også med parameteret "e" slik at funksjonen kan target-e det aktuelle produktet
function addBtnEventlisteners() {
  let btns = document.querySelectorAll(".card span button.buy");

  btns.forEach(function (e) {
    e.addEventListener("click", function (e) {
      addToCart(e);
    });
  });
}
addBtnEventlisteners();

//------------------- Funksjonen finner hele produktet ved å gå utover i nestinga fra knappen. Finner dermed aktuell info om produktet ut i fra text-nodene til de forskjellige barnene.
function addToCart(e) {
    fetchShoppingCart();

    let card = e.srcElement.parentElement.parentElement;

    let name = card.querySelector("h3").innerHTML;
    let price = card.querySelector(".price").innerHTML;
    let image = card.querySelector("img").getAttribute("src");

    let item = new product(name, "", price, image);
  
    for (let i = 0; i < shoppingCart.length; i++) {
        if (shoppingCart[i].item.name === item.name) {
            shoppingCart[i].quantity++;
            
            storeShoppingCart();
            return shoppingCart;
        };
    };
    console.log(item);
    shoppingCart.push(new order(item, 1));

    storeShoppingCart();
}

//------------------------------- Funksjonen skal kjøre når handlelista åpnes, slik at den oppdateres med riktige produkter.
function loadShoppingCart() {
  const cont = document.getElementById("cartContainer");
  fetchShoppingCart();

  //--------------------------------------- Loopen for hvert produkt i handlelista, og lager alle elementene som trengs til hver av dem, som bilde, navn etc.
  for (i = 0; i < shoppingCart.length; i++) {
    let data = shoppingCart[i];

    let item = document.createElement("div");
    item.classList.add("cart-item");

    let img = document.createElement("img");
    img.setAttribute("src", data.item.image);
    item.appendChild(img);

    let name = document.createElement("p");
    name.innerHTML = data.item.name;
    name.classList.add("cartItemName");
    item.appendChild(name);

    let price = document.createElement("p");
    price.innerHTML = data.item.price;
    price.classList.add("cartItemPrice");
    item.appendChild(price);

    item.innerHTML += `<input type="number" name="quantity" id="no-of-items" class="inpQuantity" data-itemName="${data.item.name}" value="${data.quantity}" min="1" max="10" step="1">`;
    item.innerHTML += `<button class="remove"><i class="fas fa-trash fa-2x"></i></button>`;

    //------------------------------------- Legger til en anonym funksjon på antall-inputen som endrer quantity på riktig produkt i handlelista. --
    item.querySelector("input.inpQuantity").addEventListener("input", function (e){
        for (let i = 0; i < shoppingCart.length; i++) {
            if (shoppingCart[i].item.name === this.getAttribute("data-itemName")){
                shoppingCart[i].quantity = this.value;
            };
        };
        printTotalPrice();
        storeShoppingCart();
    });
      
      
    //------------------------------------ Legger til en anonym funksjon på søppelbøtteikonet som sletter hele produktet fra handlelista, og arrayen så det ikke vises på reload.
    item.querySelector("button.remove").addEventListener("click", function (e) {
      for (let i = 0; i < shoppingCart.length; i++) {
        if (
          shoppingCart[i].item.name ===
          item.querySelector(".cartItemName").innerHTML
        ) {
          shoppingCart.splice(i, 1);
          storeShoppingCart();
        }
      };
      item.remove();
      printTotalPrice();
    });

    cont.appendChild(item);
  }

  printTotalPrice();
}

//----------------------------- Egen funksjon som summerer prisene på alle produktene i handlelista, slik summen kan oppdateres uten å gjenta mye kode.

function printTotalPrice() {
    const priceCont = document.getElementById("totalPrice");
    let total = 0;
    
    for (i = 0; i < shoppingCart.length; i++){
        let itemPrice = shoppingCart[i].item.price.replace("kr", "").split(" ").join("");
        
        total += +itemPrice * +shoppingCart[i].quantity;
    };
    
    priceCont.innerHTML = total + " kr";
};

//--------------------------------- Tidligere versjon av funksjonen som ikke regnet med kvantitet.----------------------
/*function printTotalPrice() {
  const priceCont = document.getElementById("totalPrice");
  const cont = document.getElementById("cartContainer");

  let prices = cont.querySelectorAll(".cartItemPrice");
  let totalPrice = 0;

  for (i = 0; i < prices.length; i++) {
    totalPrice += Number(
      prices[i].innerHTML.replace("kr", "").split(" ").join("")
    );
  }
  priceCont.innerHTML = totalPrice + " kr";
}*/



//----------------------------------------------------------- INNLOGGING RELATERTE FUNKSJONER---------------

function checkSignIn() {
    let localUserInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (localUserInfo) {
        userInfo = localUserInfo;
        txtSignIn.innerHTML = userInfo.username;
    };
};
checkSignIn();



let dbUser = db.ref("userAccounts/" + userInfo.username);

function uploadShoppingCart() {
    if (userInfo.username) {
        dbUser = db.ref("userAccounts/" + userInfo.username);
    
        let newObject = dbUser.child("shoppingCart");
        newObject.set(JSON.stringify(shoppingCart));
    };
};

function downloadShoppingCart() {
    function getUserInfoHelper(snapshot) {
        if (snapshot.key === userInfo.username) {
            usernameExists = true;
            userInfo = snapshot.val();
        };
    };
    dbUserAccounts.on("child_added", getUserInfoHelper);
    
    if (userInfo.shoppingCart) {
        shoppingCart = JSON.parse(userInfo.shoppingCart);
    };
    return shoppingCart;
};
downloadShoppingCart();


//--------------------- Lagrer alle butikkens produkter i ett objekt, slik at dette er letter å finne spesifike produkter enn i en array, og mer oversiktlig enn bare som individuelle variabler. ---
/* ------------------ Vi valgte heller å legge inn produktene i html og lagde en egen funksjon for å hente denne dataen. Beholder koden i tilfelle det kan bli brukt i sprint 2.
const stock = {};
stock.hook1 = new product("Klassisk Krok", "Kroker", 10, "productImages/Krok.png");
stock.hook = new product("hook", "hooks", 60, "hook2.png");
stock.rod = new product("Isfiske Drill", "Annet", 5999, "productImages/Drill.png");
*/
