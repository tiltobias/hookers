

//-------------------- definerer klasse for hvert produkt som selges i butikken, slik at hvert objekt ser likt ut -----------------
class product {
    constructor(name,category,price,image){
        this.name = name;
        this.category = category;
        this.price = price;
        this.image = image;
        
    };
    
    //-------------------- Gir produkt-objektet en metode som legger protuktet til i handlelista, eller øker antallet ------------
    addToCart() {
        for (let i = 0; i < shoppingCart.length; i++) {
            if (shoppingCart[i].item === this) {
                shoppingCart[i].quantity++;
                return shoppingCart;
            };
        };
        shoppingCart.push(
            new order(this, 1)
        );
        
        return shoppingCart;
    };
};

//------------------------ Definerer klasse for hver bestilling som legges til i handlelista, med produkt og antall -------------
class order {
    constructor(item, quantity){
        this.item = item;
        this.quantity = quantity;
    };
};

let shoppingCart = [];

//--------------------------------- Shortcut funksjoner for å lagre handlelista til nettleseren -----
function storeShoppingCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
};
function fetchShoppingCart() {
    shoppingCart = JSON.parse(sessionStorage.getItem("shoppingCart"));
};



/*
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





function addBtnEventlisteners() {
    let btns = document.querySelectorAll(".card p button");
    
    btns.forEach(function(e){e.addEventListener("click", function(e){addToCart(e)})});
    
    
};

addBtnEventlisteners()



function addToCart(e) {
    fetchShoppingCart();
    
    let card = e.srcElement.parentElement.parentElement;
    
    let name = card.querySelector("h3").innerHTML;
    let price = card.querySelector(".price").innerHTML;
    let image = card.querySelector("img").getAttribute("src");
    
    let item = new product(name,"",price,image);
    /*
    for (let i = 0; i < shoppingCart.length; i++) {
        if (shoppingCart[i].item === item) {
            shoppingCart[i].quantity++;
            return shoppingCart;
        };
    };*/
    shoppingCart.push(
        new order(item, 1)
    );
    
    storeShoppingCart();
};


function loadShoppingCart() {
    const cont = document.getElementById("cartContainer");
    fetchShoppingCart();
    
    //--------------------------------------------------- Loopen lager hver bestilling, og alle elementene i hver av dem ------------
    for (i = 0; i < shoppingCart.length; i++) {
        let data = shoppingCart[i];
        
        let item = document.createElement("div");
        item.classList.add("cart-item");
        
        let img = document.createElement("img");
        img.setAttribute("src", data.item.image);
        item.appendChild(img);
        
        let name = document.createElement("p");
        name.innerHTML = data.item.name;
        name.classList.add("cartItemName")
        item.appendChild(name);
        
        let price = document.createElement("p");
        price.innerHTML = data.item.price;
        price.classList.add("cartItemPrice");
        item.appendChild(price);
        
        item.innerHTML += `<input type="number" name="quantity" id="no-of-items" value="${data.quantity}" min="1" max="6" step="1">`;
        item.innerHTML += `<button class="remove"><i class="fas fa-trash fa-2x"></i></button>`;
        
        item.querySelector("button.remove").addEventListener("click", function(e){
            for (let i = 0; i < shoppingCart.length; i++) {
                if (shoppingCart[i].item.name === item.querySelector(".cartItemName").innerHTML ) {
                    shoppingCart.splice(i, 1);
                    storeShoppingCart();
                };
            };
            item.remove();
            printTotalPrice();
        });     
        
        cont.appendChild(item);
    };
    
    printTotalPrice();
};


function printTotalPrice() {
    const priceCont = document.getElementById("totalPrice");
    const cont = document.getElementById("cartContainer");
    
    let prices = cont.querySelectorAll(".cartItemPrice");
    let totalPrice = 0;
    
    for (i = 0; i < prices.length; i++) {
        totalPrice += Number(prices[i].innerHTML.replace("kr", "").split(" ").join(""));
    };
    priceCont.innerHTML = totalPrice + " kr";
};







//--------------------- Lagrer alle butikkens produkter i ett objekt, slik at dette er letter å finne spesifike produkter enn i en array, og mer oversiktlig enn bare som individuelle variabler. ---
const stock = {};
stock.hook1 = new product("Klassisk Krok", "Kroker", 10, "productImages/Krok.png");
stock.hook = new product("hook", "hooks", 60, "hook2.png");
stock.rod = new product("Isfiske Drill", "Annet", 5999, "productImages/Drill.png");





