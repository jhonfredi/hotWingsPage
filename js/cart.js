//create this file like a module and export it
var currentSubtotal=0;

$(document).ready(function(){        
    updateCart();
  })

  //search component by id "total_items_cart"

  var globalCategory = null;

async function addToCart(id,name, description,image, price,categoryId) {
       
  currentSubtotal=price;
    //const myCategory=await getItemBycategoryId(categoryId);
    globalCategory = null;
  await getCategorieById(categoryId,(snapshot) => {      
      const data = snapshot.data();
      var myCategory = {
        id: snapshot.id,
        name: data.name,
        order: data.order,
        status: data.status,
        menuOptions:[]
      };   
    globalCategory = myCategory;
      //at the end onFinishCallback is called
       getMenuOptionByCategoryId(myCategory,onCompleteMenuOptionsByCategory, (category) => {       
        showModalToAditionals(id,name, description,image, price,category);   
      });
  });  
}

async function onCompleteMenuOptionsByCategory(querySnapshot,category, onFinishCallback){
  
  querySnapshot.forEach(function(doc) {
    var menuOption = doc.data();
    menuOption.id = doc.id;
    menuOption.optionItems = [];  
    category.menuOptions.push(menuOption);
    globalCategory = category;
    
  });

  getItemsMenuByMenuOptionId(category,onFinishCallback);
}

async function getItemsMenuByMenuOptionId(category,onFinishCallback){

  for (let index = 0; index < category.menuOptions.length; index++) {
    menuOption= category.menuOptions[index];
    getMenuOptionOnItemByMenuId(menuOption,index,category,onCompleteGetItemsMenuByMenuOptionId,onFinishCallback);   
  }  
  onFinishCallback(category);
}

function onCompleteGetItemsMenuByMenuOptionId(querySnapshot, menuOption,index, category,onFinishCallback){
  
  querySnapshot.forEach(function(doc) {
    var data = doc.data();

    let optionItem = data;
    optionItem.id = doc.id;

    category.menuOptions[index].optionItems.push(optionItem);
    globalCategory.menuOptions[index].optionItems.push(optionItem);    
    
    createField(optionItem,menuOption);
    
  });
}

function createField(optionItem,menuOption){ 

  //var optionItem = menuOption.optionItems[optionItemIndex];

  var form=$("#form-modal-id");  
  //search the section to the current menuOption
  var fieldset = document.getElementById("cart_fi_"+menuOption.id);
  if(fieldset == null){
    fieldset = document.createElement("fieldset");
    fieldset.setAttribute("id","cart_fi_"+menuOption.id);    
    fieldset.setAttribute("data-menu-option-id",menuOption.id); 
    form.append(fieldset);

    var legend = document.createElement("legend");    
    legend.setAttribute("class","h4");
    legend.innerHTML = menuOption.name;
    
    if(menuOption.maxLimit > 0 || menuOption.minLimit > 0){      
      //add span to legend
      var messageValidation = document.createElement("div");
      messageValidation.setAttribute("class","badge-info h6");
      messageValidation.innerHTML=" "+menuOption.limitDescription;
      legend.append(messageValidation);
    }
    
    fieldset.appendChild(legend);    
    form.append(fieldset);
    
  }
  var fieldContent = "";
  
  if(optionItem.fieldType === 'text'){
    fieldContent = `
    <div class="form-group">
        <label for="${optionItem.id}">${optionItem.name}</label>
        <input type="text" class="form-control" id="${optionItem.id}" aria-describedby="${optionItem.name}" placeholder="${optionItem.name}">
    </div>
    <hr/>
    `;
  }else if(optionItem.fieldType === 'select'){ 
    fieldContent = `
    <div class="form-group">
        <label for="${optionItem.id}">${optionItem.name}</label>
        <select class="form-control" id="${optionItem.id}">
        <option>${optionItem.name}</option>
        </select>
    </div>
    <hr/>
    `;
  }else if(optionItem.fieldType === 'check'){    
    fieldContent = `
    <div class="form-check">
        <input class="form-check-input" type="checkbox" id="check_${optionItem.id}" >
        <label class="form-check-label" for="check_${optionItem.id}">${optionItem.name}</label>
    </div>    
    <hr/>
    `;
    fieldset.innerHTML += fieldContent;
    //add event to fieldset to check if the checkbox is checked
    fieldset.addEventListener("change", function(event){     

      var totalChecked = 0;
      var checkboxes = fieldset.getElementsByTagName("input");
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox' && checkboxes[i].checked) {
          totalChecked++;
        }
      }
      if(totalChecked > menuOption.maxLimit){
        $("#"+optionItem.id).prop('checked', false);        
        var element = event.target;
        element.checked = false;
      }
    });

  }else if(optionItem.fieldType === 'amount'){

    getAditionalById(optionItem.aditionalId, (snapshot)=>{
      var aditional = snapshot.data();      
       aditional.id = snapshot.id;
      
       fieldContent = `
       <div class="form-group">
            <div class="row">             
              <div class="col-6">
                <label for="${optionItem.id}">${aditional.name} + $${formatNumberToMil(aditional.price)}</label>               
              </div>
              <div class="col-6">                
              <i class="material-icons btn border" id="i_remove_${aditional.id} parent="${aditional.id}"  hidden>remove</i>               
                  <span id="amount_${aditional.id}" class="ml-2 mr-2" parent="${aditional.id}" >0</span>
                  <i class="material-icons btn border" id="i_add_${aditional.id}" parent="${aditional.id}">add</i>                                              
              </div>  
              </div>
       </div>
       <hr/>
       `;
       
       fieldset.innerHTML += fieldContent;  

       //add event onClick to the fieldset
        fieldset.addEventListener("click", function(event){
          
          var element = event.target;
          //get parent attribute from the element
          var id = element.getAttribute("parent");               
          //remove hiiden from $("#i_remove_"+aditional.id)
          $("#i_remove_"+id).removeAttr("hidden");
                        
          var totalAmounts =0;
          var amounts = element.getElementsByTagName("span");          
          for (var i = 0; i < amounts.length; i++) {
            //validate if the amounts[i] is a span and the id start with amount_
            if (amounts[i].id.startsWith("amount_")) {
              totalAmounts = Number(totalAmounts) + Number(amounts[i].textContent);
            }
          }

          if(totalAmounts < menuOption.maxLimit){                                

            //show the id="i_add_${aditional.id}"
            $("#i_add_"+id).show();            
            var amount = $("#amount_"+id).text();
            amount++;          
            //sum two numbers
            currentSubtotal = parseFloat(currentSubtotal) + parseFloat(aditional.price);
            //update span with id sp_current_subtotal_id
            $("#sp_current_subtotal_id").text(formatNumberToMil(currentSubtotal));
            $("#amount_"+id).text(amount);
          }

          if(totalAmounts >= menuOption.maxLimit-1){
            $("#i_add_"+id).hide();
            $("#i_remove_"+id).show();
          }

        });
      
       
        
        //add on clicklistener to remove button
        $("#i_remove_"+aditional.id).click(function(){    
          
          var totalAmounts =0;
          var amounts = fieldset.getElementsByTagName("span");          
          for (var i = 0; i < amounts.length; i++) {
            //validate if the amounts[i] is a span and the id start with amount_
            if (amounts[i].id.startsWith("amount_")) {
              totalAmounts = Number(totalAmounts) + Number(amounts[i].textContent);
            }
          }

          if(totalAmounts <= menuOption.maxLimit){            
            $("#i_add_"+aditional.id).show();
          }

          if(totalAmounts == 1){            
            $("#i_remove_"+aditional.id).hide();            
          }


          var amount = $("#amount_"+aditional.id).text();
          if(amount > 0){
            amount--;
            currentSubtotal = parseFloat(currentSubtotal) - parseFloat(aditional.price);
            $("#sp_current_subtotal_id").text(formatNumberToMil(currentSubtotal));
            $("#amount_"+aditional.id).text(amount);
          }
        });  
    });     
  }
}


function createElements(category){
  
  var elements = "";
//create an new array from category
  var menuOptions = menuOptions = category.menuOptions

 menuOptions.forEach(element => {    

  
  var optionItems = element.optionItems;     
  /*
    optionItems.sort(function(a, b){
        return a.order - b.order; 
    });*/
    
      //loop optionItems
      optionItems.forEach(element => {        
        var field = createField(element);      
        elements += field;
      });
  });


  return elements;
}

var modalWrap = null;

function showModalToAditionals(id,name, description,image, price,myCategory, callback){  

    //to avoid create multiple modal
    if(modalWrap != null){
        modalWrap.remove();
    }

    modalWrap =document.createElement('div');

    var priceMiles = formatNumberToMil(price);

    //create dynamic form for the body of the modal with the data of myCategory divide by menuOptions and their optionItems
    
    modalWrap.innerHTML = `
        <div class="modal modal-wide" tabindex="-1" id="contenedor-modal">
            <div class="modal-xl modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-light">
                    <div>
                        <h5 class="modal-title fw-bold">${name} - $${priceMiles}</h5>                        
                    </div>
                        
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">                        
                        <div class="container-fluid">   
                        <p class="fs-6">${description}</p>
                        <div class="row">
                        </div>                     
                        <div class="row  mt-2">
                          <div class="col-md-4" ><img src="${image}" class="img-responsive" alt=""/></div>
                          <div class="col-md-8 ml-auto">
                            <form id="form-modal-id" class="h6">                             
                            </form>
                          </div>
                          
                        </div>
                        <div class="row">
                          <div class="col-md-3 ml-auto"></div>
                          <div class="col-md-2 ml-auto"></div>
                        </div>
                      </div>
                    

                    </div>
                    <div class="modal-footer bg-light">
                        <div class="col-sm-4">
                          <span>Subtotal: $</span><span id="sp_current_subtotal_id">${formatNumberToMil(currentSubtotal)}</span>
                        </div>
                        <div class="col-sm-6">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                          <button type="button" class="btn btn-primary modal-success-btn">Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalWrap.querySelector('.modal-success-btn').addEventListener('click', function(){
        
        addAditionalToCart(id,name, description,image, price,myCategory);
        //call data-bs-dismiss="modal" to close the modal
        modalWrap.querySelector('.btn-close').click();
    });

    document.body.append(modalWrap);
    $('.modal').modal('show');

    createElements(myCategory); 

}

function addAditionalToCart (id,name, description,image, price,categoryId){
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
    
    showToastAdded();
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

function closeCart(){
  
      
    
   


}