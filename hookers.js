

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


const shoppingCart = [];

//------------------------ 
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
    
};


//--------------------- Lagrer alle butikkens produkter i ett objekt, slik at dette er letter å finne spesifike produkter enn i en array, og mer oversiktlig enn bare som individuelle variabler. ---
const stock = {};
stock.hook1 = new product("hook1", "hooks", 50, "hook1.png");
stock.hook2 = new product("hook2", "hooks", 60, "hook2.png");
stock.rod = new product("Fishingrod", "rods", 200, "rod.png");





