function orderDetailFromCart(){
    var cart = localStorage.getItem("cart");
    if(cart){
        cart = JSON.parse(orderDetail);
    }

    //order the currentAdictionals by menuId desc
    var currentAdictionals = cart.currentAdictionals;
    currentAdictionals.sort(function(a,b){
        return b.menuId - a.menuId;
    });
   
   
}

