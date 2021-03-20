

class product {
    constructor(name,category,price,image){
        this.name = name;
        this.category = category;
        this.price = price;
        this.image = image;
        
    };
    
    addToCart() {
        for (let i = 0; i < shoppingCart.length; i++) {
            if (shoppingCart[i].item === this) {
                shoppingCart[i].quantity++;
                return shoppingCart;
            };
        };
        shoppingCart.push({
            item : this ,
            quantity : 1
        });
        
        return shoppingCart;
    };
};

let shoppingCart = [];

shoppingCart.push({
    item : new product("hook1", "hooks", 50, "hook1.png") ,
    quantity : 1 
});


let hook1 = new product("hook1", "hooks", 50, "hook1.png");
let hook2 = new product("hook2", "hooks", 60, "hook2.png");
let rod = new product("Fishingrod", "rods", 200, "rod.png");


