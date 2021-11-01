//create this file like a module and export it
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-analytics.js";
import { getFirestore,getDocs,collection,where, orderBy } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";

$(document).ready(function(){        
    updateCart();
  })

  //search component by id "total_items_cart"



function addToCart(id,name, image, price) {
       
    const newCombo = {
        id: id,
        name: name,
        image: image,
        price: price,
        cont:1,
        totalPrice:price
    };
   
    showAditionalOrder();
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
    
    //showToastAdded();
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

    let totalItemsCart = 0;
    const totalItemsCartElement = document.getElementById('total_items_cart');    
    const goToPayElement = document.getElementById('go_to_pay_id');
    const trashbinIcon = document.getElementById('trashbin_icon_id');

    if(cart != null){
        cart.items.forEach(element => {
            //convert to number
            totalItemsCart += Number(element.cont);        
        cartElement.innerHTML += 
                `
                                <li class="list_img"><img src="https://www.google.com/imgres?imgurl=https%3A%2F%2Fphotos.bigoven.com%2Frecipe%2Fhero%2Fgarlic-ginger-chicken-wings-39730d.jpg%3Fh%3D300%26w%3D300&imgrefurl=https%3A%2F%2Fwww.bigoven.com%2Frecipe%2Fgarlic-ginger-chicken-wings%2F2367387&tbnid=GXsltK55QfHSRM&vet=12ahUKEwjHmK-w2PXzAhXFBd8KHT1cC4sQMygDegUIARDKAQ..i&docid=MX0isnFxWj45gM&w=256&h=256&itg=1&q=chicken%20wing&hl=es-419&ved=2ahUKEwjHmK-w2PXzAhXFBd8KHT1cC4sQMygDegUIARDKAQ" alt=""/></li>
                            <li class="list_desc"><h4><a href="#">${element.name}</a></h4><span class="actual">${element.cont} x
                            ${element.price}</span></li>
                `;
        }); 

        if(totalItemsCart === 0){
            //delete all classes from the element
            totalItemsCartElement.classList.remove('total_items_cart');
            totalItemsCartElement.innerHTML = '';
            goToPayElement.innerHTML = `Ver menú`;
        }else{ 
            totalItemsCartElement.innerHTML = `${totalItemsCart}
            `;
            //add class to totalItemsCartElement
            totalItemsCartElement.classList.add('total_items_cart');
            goToPayElement.innerHTML = `Ir a Pagar: $${formatNumberToMil(cart.totalPrice)}`;
           
            //display trashbin inline
            trashbinIcon.style.display = 'inline'

        }
    }else{
         //delete all classes from the element
         totalItemsCartElement.classList.remove('total_items_cart');
         totalItemsCartElement.innerHTML = '';
         goToPayElement.innerHTML = `Ver menú`;
         trashbinIcon.style.display = 'none';
    }

}

function showToastAdded(){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        iconColor: 'white',
        customClass: {
          popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      })
      Toast.fire({
        icon: 'success',
        title: 'Producto agregado'
      })
}

function formatNumberToMil(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function showAditionalOrder(){

    console.log("showing aditionals")
     //show Swal alert dialog
     Swal.fire({  
        title: 'Seguro que desea eliminar todos los productos?',  
        showDenyButton: true,  showCancelButton: false,  
        confirmButtonText: `Si`,  
        denyButtonText: `Cancelar`,
      }).then((result) => {  
          /* Read more about isConfirmed, isDenied below */  
          if (result.isConfirmed) {    
            const trashbinIcon = document.getElementById('trashbin_icon_id');
            localStorage.removeItem('cart');
            updateCart();
            //hide the trashbin icon
            trashbinIcon.style.display = 'none';
            
          }
      });

}

function deleteAllCart(){

    //create amazing confirm dialog
    Swal.fire({  
        title: 'Seguro que desea eliminar todos los productos?',  
        showDenyButton: true,  showCancelButton: false,  
        confirmButtonText: `Si`,  
        denyButtonText: `Cancelar`,
      }).then((result) => {  
          /* Read more about isConfirmed, isDenied below */  
          if (result.isConfirmed) {    
            const trashbinIcon = document.getElementById('trashbin_icon_id');
            localStorage.removeItem('cart');
            updateCart();
            //hide the trashbin icon
            trashbinIcon.style.display = 'none';
            
          }
      });

}