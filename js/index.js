//create this file like a module and export it

$(document).ready(function(){    
    updateCart();
  })

function addToCart(id,name, image, price) {
    
    const newCombo = {
        id: id,
        name: name,
        image: image,
        price: price,
        cont:1,
        totalPrice:price
    };
    
    var cart = JSON.parse(localStorage.getItem('cart'));
    if(cart == null) {

        let cart = {
            items: [],
            totalPrice:0
        };        
        //add property total price to cart
        cart.totalPrice = newCombo.price;   

        cart.items.push(newCombo);
        localStorage.setItem('cart', JSON.stringify(cart));
    }else{
        var index = cart.items.findIndex(x => x.id == id);
        if(index == -1){
            cart.items.push(newCombo);            
        }else{
            cart.items[index].cont++;
            cart.items[index].totalPrice = cart.items[index].cont * cart.items[index].price;            
        }

        //calculate the total sum the totalPrice of each item
        cart.totalPrice = 0;
        cart.items.forEach(element => {
            //cast to number
            cart.totalPrice += Number(element.totalPrice);            
        }); 
        localStorage.setItem('cart', JSON.stringify(cart));

    }
       
    updateCart();
    
}

function updateCart(){
    //get cart from local storage
    var cart = JSON.parse(localStorage.getItem('cart'));
    //get the cart element
    var cartElement = document.getElementById('cart_div_id');
    //clear the cart element
    cartElement.innerHTML = '';
    //add the cart items to the cart element
    cart.items.forEach(element => {

       cartElement.innerHTML += 
              `
                            <li class="list_img"><img src="https://www.google.com/imgres?imgurl=https%3A%2F%2Fphotos.bigoven.com%2Frecipe%2Fhero%2Fgarlic-ginger-chicken-wings-39730d.jpg%3Fh%3D300%26w%3D300&imgrefurl=https%3A%2F%2Fwww.bigoven.com%2Frecipe%2Fgarlic-ginger-chicken-wings%2F2367387&tbnid=GXsltK55QfHSRM&vet=12ahUKEwjHmK-w2PXzAhXFBd8KHT1cC4sQMygDegUIARDKAQ..i&docid=MX0isnFxWj45gM&w=256&h=256&itg=1&q=chicken%20wing&hl=es-419&ved=2ahUKEwjHmK-w2PXzAhXFBd8KHT1cC4sQMygDegUIARDKAQ" alt=""/></li>
						  <li class="list_desc"><h4><a href="#">${element.name}</a></h4><span class="actual">${element.cont} x
                          ${element.price}</span></li>
              `;
    }); 



}

