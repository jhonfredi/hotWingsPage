//create this file like a module and export it
var currentSubtotal = 0;
var globalCategory = null;
var currentAdictionals = [];
var currentMandatory = false;

$(document).ready(function() {
    updateCart();

});

//search component by id "total_items_cart" 
/*
This is call whe n user click on comprar or Agregar al carrito
*/
async function addToCart(id, name, description, image, price, categoryId, option) {

    //This is because the imagUrl have that caracter and when I pass by href it is not working
    image = image.replace("/hot2f", "%2F");
    currentSubtotal = price;
    globalCategory = null;

    await getCategorieById(categoryId, (snapshot) => {

        const data = snapshot.data();

        var myCategory = {
            id: snapshot.id,
            name: data.name,
            order: data.order,
            status: data.status,
            amount: 1,
            menuOptions: []
        };
        globalCategory = myCategory;

        getMenuOptionByCategoryId(myCategory, onCompleteMenuOptionsByCategory, (category) => {
            showModalToAditionals(id, name, description, image, price, category, option);

            var btnModalOK = document.getElementById('modal-success-btn');
            if (currentMandatory) {
                btnModalOK.disabled = true;
                //todo add a class to the button to show that it is disabled

            }

        });
    });
}

/*
Once the fields by each category are created, showModalToAditionals is called
to allow the user selected adictionals
*/
function showModalToAditionals(id, name, description, image, price, myCategory, option) {

    currentAdictionals = [];
    //delete currentAdictionals from localStorage
    localStorage.removeItem('currentAdictionals');

    //to avoid create multiple modal
    if (modalWrap != null) {
        modalWrap.remove();
    }

    modalWrap = document.createElement('div');

    var priceMiles = formatNumberToMil(price);

    //We decide to eliminate this image
    //<div class="col-md-4" ><img src="${image}" class="img-fluid" alt=""/></div>

    //create dynamic form for the body of the modal with the data of myCategory divide by menuOptions and their optionItems
    //Bug: When I use fade, does not work
    var modal = `
        <div class="modal modal-wide" tabindex="-1" id="contenedor-modal" >
            <div class="modal-lg modal-dialog">
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
                          <div class="col-md-10 ">
                            <form id="form-modal-id" class="h6">
                                                        
                            </form>
                            <div class="form-floating">
                              <textarea class="form-control" placeholder="Añada instrucciones o comentarios" id="adictionals-comments-modal" style="height: 100px"></textarea>
                              <label for="adictionals-comemnts-modal">Añada instrucciones o comentarios</label>
                            </div>
                          </div>                          
                        </div>                       
                      </div>
                    </div>
                    <div class="my-modal-footer bg-light">
                        <div class="col-md-2 subtotal-modal">
                          <span>Subtotal: $</span><span id="sp_current_subtotal_id">${formatNumberToMil(currentSubtotal)}</span>
                        </div>                    
                        <div class="col-md-4">
                          <button type="button" class="btn btn-secondary col-md-6" data-bs-dismiss="modal">Cerrar</button>`;
    if (option == 0) {
        modal += `<button type="button" class="btn btn-primary modal-success-btn col-md-6" id="modal-success-btn">Agregar</button>`;
    } else if (option == 1) {
        modal += `<button type="button" class="btn btn-primary modal-success-btn col-md-6"  id="modal-success-btn">Comprar</button>`;
    }
    modal += `
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    modalWrap.innerHTML = modal;

    modalWrap.querySelector('.modal-success-btn').addEventListener('click', function() {

        //get the value from sp_current_subtotal_id
        var currentSubtotal = $("#sp_current_subtotal_id").text();
        //replace $ and , and . 
        currentSubtotal = currentSubtotal.replace(/\$/g, '');
        currentSubtotal = currentSubtotal.replace(/,/g, '');
        currentSubtotal = currentSubtotal.replace(/\./g, '');
        currentSubtotal = parseFloat(currentSubtotal);

        var adictionalsComments = $("#adictionals-comments-modal").val();

        saveProductOnLocalStorage(id, name, description, image, currentSubtotal, myCategory, option, adictionalsComments);
        modalWrap.querySelector('.btn-close').click();

    });

    document.body.append(modalWrap);
    $('.modal').modal('show');

}

/*
Get menu options by category
**/
async function onCompleteMenuOptionsByCategory(querySnapshot, category, onFinishCallback) {

    querySnapshot.forEach(function(doc) {
        var menuOption = doc.data();
        menuOption.id = doc.id;
        menuOption.optionItems = [];
        globalCategory = category;
        var appliesAll = menuOption.appliesAll;

        let categoriesToAplyInmenu = menuOption.categories.split(',');

        if (categoriesToAplyInmenu.includes(category.id)) {
            category.menuOptions.push(menuOption);

        }

    });

    getItemsMenuByMenuOptionId(category, onFinishCallback);
}

async function getItemsMenuByMenuOptionId(category, onFinishCallback) {

    for (let index = 0; index < category.menuOptions.length; index++) {
        menuOption = category.menuOptions[index];
        if (menuOption.mandatory == true) {
            currentMandatory = true;
        }

        getMenuOptionOnItemByMenuId(menuOption, index, category, onCompleteGetItemsMenuByMenuOptionId, onFinishCallback);
    }
    onFinishCallback(category);
}

function onCompleteGetItemsMenuByMenuOptionId(querySnapshot, menuOption, index, category, onFinishCallback) {

    querySnapshot.forEach(function(doc) {
        var data = doc.data();

        let optionItem = data;
        optionItem.id = doc.id;
        let appliesAll = optionItem.appliesAll;
        let optionsMenu = optionItem.options.split(',');

        if (optionsMenu.includes(menuOption.id)) {
            category.menuOptions[index].optionItems.push(optionItem);
            globalCategory.menuOptions[index].optionItems.push(optionItem);
            createField(optionItem, menuOption);

        }


    });
}

/*
Once the user select all adictionals, this function is call
*/
function saveProductOnLocalStorage(id, name, description, image, price, categoryId, option, adictionalsComments) {

    const newCombo = {
        id: id,
        name: name,
        image: image,
        price: price,
        cont: 1,
        totalPrice: price,
        comments: adictionalsComments,
        currentAdictionals: currentAdictionals
    };
    var cart = JSON.parse(localStorage.getItem('cart'));
    if (cart == null) {

        let cart = {
            items: [],
            totalPrice: 0
        };
        //add property total price to cart
        cart.totalPrice = newCombo.price;

        cart.items.push(newCombo);
        localStorage.setItem('cart', JSON.stringify(cart));
    } else {
        cart.items.push(newCombo);

        //calculate the total sum the totalPrice of each item
        cart.totalPrice = 0;
        cart.items.forEach(element => {
            cart.totalPrice += Number(element.totalPrice);
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    showToastAdded();
    updateCart();
    if (option == 1) {
        //navigate to checkout.html
        window.location.href = "checkout.html";
    }
}

function validateAllMandatory() {

    var mandatories = document.getElementsByClassName("data-menu-mandatory-valid");
    //loop through all the mandatory fields
    for (let index = 0; index < mandatories.length; index++) {
        const element = mandatories[index];
        //Get the atribute data-menu-mandatory-valid and check if it is true
        if (element.getAttribute("data-menu-mandatory-valid") == "false") {
            return false;
        }
    }

    return true;

}

/*
Create a field for each optionItem, also validate if the optionItem is mandatory in disable the button to add the item
*/
function createField(optionItem, menuOption) {

    //var optionItem = menuOption.optionItems[optionItemIndex];

    var form = $("#form-modal-id");
    var menuId = menuOption.id;
    var buttonModalAdd = document.getElementById("modal-success-btn");

    //search the section to the current menuOption
    var fieldset = document.getElementById("cart_fi_" + menuOption.id);

    if (fieldset == null) {
        fieldset = document.createElement("fieldset");
        fieldset.setAttribute("id", "cart_fi_" + menuOption.id);
        fieldset.setAttribute("data-menu-option-id", menuOption.id);
        form.append(fieldset);

        var legend = document.createElement("legend");
        legend.setAttribute("class", "h4");
        legend.innerHTML = menuOption.name;

        if (menuOption.maxLimit > 0 || menuOption.minLimit > 0) {
            //add span to legend
            var messageValidation = document.createElement("div");
            messageValidation.setAttribute("class", "badge-info h6");
            messageValidation.innerHTML = " " + menuOption.limitDescription;
            legend.append(messageValidation);
        }

        fieldset.appendChild(legend);
        form.append(fieldset);

    }
    fieldset.setAttribute("data-menu-mandatory", menuOption.mandatory);
    if (menuOption.mandatory == false) {
        fieldset.setAttribute("data-menu-mandatory-valid", "true");
    } else {
        fieldset.setAttribute("data-menu-mandatory-valid", "false");
    }
    //add class data-menu-mandatory-valid to the fieldset
    fieldset.setAttribute("class", "data-menu-mandatory-valid");

    var fieldContent = "";

    if (optionItem.fieldType === 'check') {
        fieldContent = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="check_${optionItem.id}" data-menu-mandatory="${menuOption.mandatory}" data-option-item-id="${optionItem.id}" 
                data-option-item-name="${optionItem.name}" data-option-item-price="${optionItem.price}" data-option-item-order="${optionItem.order}" >
                <label class="form-check-label" for="check_${optionItem.id}">${optionItem.name}</label>
            </div>    
            <hr/>
            `;
        fieldset.innerHTML += fieldContent;

        if (fieldset.getAttribute("data-event-change") == null) {
            fieldset.setAttribute("data-event-change", "true");

            fieldset.addEventListener("change", function(event) {

                var element = event.target;

                //var optionMandatory = element.getAttribute("data-menu-mandatory");
                var optionMandatory = fieldset.getAttribute("data-menu-mandatory");

                var totalChecked = 0;
                var checkboxes = fieldset.getElementsByTagName("input");
                for (var i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].type == 'checkbox' && checkboxes[i].checked) {
                        totalChecked++;
                    }
                }

                if (totalChecked > menuOption.maxLimit) {
                    $("#" + optionItem.id).prop('checked', false);
                    var element = event.target;
                    element.checked = false;
                    totalChecked--;
                } else {
                    //TODO: wait to btn sucess be created
                    if (optionMandatory == "true" && (totalChecked >= menuOption.minLimit && totalChecked <= menuOption.maxLimit)) {

                        fieldset.setAttribute("data-menu-mandatory-valid", "true");

                        if (validateAllMandatory()) {
                            buttonModalAdd.disabled = false;
                        }
                    } else {
                        fieldset.setAttribute("data-menu-mandatory-valid", "false");
                        //Enable the button to add the product
                        buttonModalAdd.disabled = true;
                    }


                    //get data-option-item-id from element
                    var optionItemId = element.getAttribute("data-option-item-id");
                    var optionItemName = element.getAttribute("data-option-item-name");
                    var optionItemPrice = element.getAttribute("data-option-item-price");

                    var currentCheckOption = {
                        id: optionItemId,
                        name: optionItemName,
                        price: optionItemPrice,
                        menuId: menuId
                    };

                    if (element.checked) {
                        currentAdictionals.push(currentCheckOption);
                    } else {
                        var index = currentAdictionals.findIndex(function(element) {
                            return element.id == optionItemId && element.menuId == menuId;
                        });

                        if (index > -1) {
                            currentAdictionals.splice(index, 1);
                        }
                    }
                }

            });
        }

    } else if (optionItem.fieldType === 'amount') {

        getAditionalById(optionItem.aditionalId, (snapshot) => {
            var aditional = snapshot.data();
            aditional.id = snapshot.id;

            fieldContent = `
       <div class="form-group">
            <div class="row">             
              <div class="col-6">
                <label for="${optionItem.id}">${aditional.name} + $${formatNumberToMil(aditional.price)}</label>               
              </div>
              <div class="col-6" data-menu-mandatory="${menuOption.mandatory}" data-menu-max-limit="${menuOption.maxLimit}" data-aditional-name="${aditional.name}" aditional-price="${aditional.price}" parent-field-id="${"cart_fi_"+menuOption.id}">                
              <i class="material-icons btn border opacity-25" id="i_remove_${aditional.id}" parent-aditional-id="${aditional.id}" >remove</i>               
                  <span id="amount_${aditional.id}" class="ml-2 mr-2" parent="${aditional.id}" >0</span>
              <i class="material-icons btn border" id="i_add_${aditional.id}" parent-aditional-id="${aditional.id}">add</i>                                              
              </div>  
              </div>
       </div>
       <hr/>
       `;

            fieldset.innerHTML += fieldContent;

            //add event onClick to the fieldset just if the fieldset does not have the event       
            if (fieldset.getAttribute("data-event-click") == null) {
                fieldset.setAttribute("data-event-click", "true");

                fieldset.addEventListener("click", function(event) {
                    var element = event.target;
                    //The id of the aditional
                    var id = element.getAttribute("parent-aditional-id");
                    var parenNode = element.parentNode;

                    //get menuOption from parentNode
                    var menuOptionMaxLimit = parenNode.getAttribute("data-menu-max-limit");
                    var aditionalPrice = parenNode.getAttribute("aditional-price");
                    var currentSubtotalElement = document.getElementById("sp_current_subtotal_id");
                    var optionItemName = parenNode.getAttribute("data-aditional-name");
                    var optionMandatory = fieldset.getAttribute("data-menu-mandatory");

                    //get the text on the current subtotal and convert to number
                    var localSubtotal = currentSubtotalElement.innerHTML;
                    localSubtotal = localSubtotal.replace("$", "");
                    localSubtotal = localSubtotal.replace(",", "");
                    localSubtotal = localSubtotal.replace(".", "");
                    localSubtotal = parseFloat(localSubtotal);
                    if (element.id.startsWith("i_add_")) {

                        var removeElement = $("#i_remove_" + id);

                        removeElement.removeClass("opacity-25");

                        var totalAmounts = 0;
                        var amounts = fieldset.getElementsByTagName("span");

                        for (var i = 0; i < amounts.length; i++) {
                            if (amounts[i].id.startsWith("amount_")) {
                                totalAmounts = Number(totalAmounts) + Number(amounts[i].textContent);
                            }
                        }

                        var addElement = $("#i_add_" + id);
                        if (totalAmounts < menuOptionMaxLimit) {

                            //show the id="i_add_${aditional.id}"
                            addElement.removeClass("opacity-25");

                            var amount = $("#amount_" + id).text();
                            amount++;

                            localSubtotal += parseFloat(aditionalPrice);
                            //update span with id sp_current_subtotal_id
                            $("#sp_current_subtotal_id").text(formatNumberToMil(localSubtotal));
                            $("#amount_" + id).text(amount);


                            //Option item             
                            var currentCheckOption = {
                                id: id,
                                name: optionItemName,
                                price: aditionalPrice,
                                amount: amount,
                                menuId: menuId
                            };

                            var index = currentAdictionals.findIndex(function(element) {
                                return element.id == id && element.menuId == menuId;
                            });
                            //if the aditional is not in the currentAdictionals
                            if (index == -1) {
                                currentAdictionals.push(currentCheckOption);
                            } else {
                                currentAdictionals[index].amount = amount;
                            }
                        }

                        if (totalAmounts >= menuOptionMaxLimit - 1) {
                            //add class to addElement
                            addElement.addClass("opacity-25");
                            removeElement.removeClass("opacity-25");
                        }

                    } else if (element.id.startsWith("i_remove_")) {

                        var addElement = $("#i_add_" + id);
                        var removeElement = $("#i_remove_" + id);

                        var totalAmounts = 0;
                        var amountsR = parenNode.getElementsByTagName("span");
                        for (var i = 0; i < amountsR.length; i++) {
                            //validate if the amounts[i] is a span and the id start with amount_
                            if (amountsR[i].id.startsWith("amount_")) {
                                totalAmounts = Number(totalAmounts) + Number(amountsR[i].textContent);
                            }
                        }

                        if (totalAmounts <= menuOptionMaxLimit) {
                            addElement.removeClass("opacity-25");
                        }

                        if (totalAmounts == 1) {
                            removeElement.addClass("opacity-25");
                        }

                        var amount = $("#amount_" + id).text();
                        if (amount > 0) {
                            amount--;
                            localSubtotal -= parseFloat(aditionalPrice);
                            $("#sp_current_subtotal_id").text(formatNumberToMil(localSubtotal));
                            $("#amount_" + id).text(amount);

                            //Saving on currentAdictionals
                            //search  the aditional in the currentAdictionals by id and menuId
                            var index = currentAdictionals.findIndex(function(element) {
                                return element.id == id && element.menuId == menuId;
                            });
                            if (index != -1) {
                                currentAdictionals[index].amount = amount;
                            }
                            //if the amount is 0 remove the aditional from the currentAdictionals
                            if (amount == 0) {
                                currentAdictionals.splice(index, 1);
                            }
                            //localStorage.setItem('currentAdictionals', JSON.stringify(currentAdictionals));
                        }
                    }
                });
            }
        });
    }

}


function createElements(category) {

    //create an new array from category
    var menuOptions = menuOptions = category.menuOptions

    menuOptions.forEach(element => {

        var optionItems = element.optionItems;
        optionItems.sort(function(a, b) {
            return a.order - b.order;
        });

        //loop optionItems
        optionItems.forEach(element => {

            //createField(element);

        });
    });
}

var modalWrap = null;



function updateCart() {
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
    var cartIconBlock = document.getElementById('fa-shopping-cart-block');

    if (cart != null) {
        cart.items.forEach(element => {
            //convert to number
            totalItemsCart += Number(element.cont);
            cartElement.innerHTML += `
                                
                            <li class="list_desc list_img"><h4><a>${element.name}</a></h4><span class="actual">${element.cont} x
                            ${element.price}</span></li>
                `;
        });

        if (totalItemsCart === 0) {
            //delete all classes from the element
            totalItemsCartElement.classList.remove('total_items_cart');
            totalItemsCartElement.innerHTML = '';
            goToPayElement.innerHTML = `Ver menú`;
            //trashbinIcon.classList.remove('trashbin_icon');
            //search element by id fa-shopping-cart

            //Hidde cartIconBlock
            cartIconBlock.classList.add('d-none');
        } else {
            totalItemsCartElement.innerHTML = `${totalItemsCart}
            `;
            //add class to totalItemsCartElement
            totalItemsCartElement.classList.add('total_items_cart');
            goToPayElement.innerHTML = `Ir a Pagar: $${formatNumberToMil(cart.totalPrice)}`;
            trashbinIcon.classList.add('trashbin_icon');

            //Show cartIconBlock
            cartIconBlock.classList.remove('d-none');
        }
    } else {
        //delete all classes from the element
        totalItemsCartElement.classList.remove('total_items_cart');
        totalItemsCartElement.innerHTML = '';
        goToPayElement.innerHTML = `Ver menú`;
        trashbinIcon.style.display = 'none';

        //Hide cartIconBlock
        cartIconBlock.classList.add('d-none');
    }
}

function showToastAdded() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-right',
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

function showAditionalOrder() {

    //show Swal alert dialog
    Swal.fire({
        title: 'Seguro que desea eliminar todos los productos?',
        showDenyButton: true,
        showCancelButton: false,
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

function deleteAllCart() {

    //create amazing confirm dialog
    Swal.fire({
        title: 'Seguro que desea eliminar todos los productos?',
        showDenyButton: true,
        showCancelButton: false,
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