//on load document
$(document).ready(function() {
    loadCurrentCart();
    onlyOneOption();
});

function onlyOneOption() {
    var checkboxes = document.getElementsByName('checkg')

    //Select just one option on checkbox change
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].onchange = function() {
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i] != this)
                    checkboxes[i].checked = false
            }

            //validate if the option checked have id for_delivery_id and delete hidden property to section_for_delivery other case hide
            if (this.id == "for-delivery-id" && this.checked) {
                $("#section-for-delivery-id").removeAttr("hidden");
            } else {
                $("#section-for-delivery-id").attr("hidden", "hidden");
            }

        }
    }

}

var globalTotalPrice = 0;

function loadCurrentCart() {

    var cart = localStorage.getItem("cart");

    if (cart) {
        cart = JSON.parse(cart);
    }

    //order the currentAdictionals by menuId desc

    //get table with id cart_list_id

    var tableBody = $("#cart_list_id tbody");
    //get element by id check_subtotal
    var checkSubtotal = $("#check_subtotal");
    var checkShipment = $("#check_shipment");
    var checkTotal = $("#check_total");
    globalTotalPrice = cart.totalPrice;
    checkSubtotal.html(`$${formatNumberToMil(cart.totalPrice)}`);
    checkShipment.html(`Entre $4.000 y $10.000`);
    checkTotal.html(`~$${formatNumberToMil(cart.totalPrice + 10000)}`);

    //create var stringto store all the items with the currentAdictionals
    var cartToWhatsapp = "";

    var items = cart.items;
    //loop over currentAdictionals and append to cartList
    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        var id = item.id;
        var name = item.name;
        var image = item.image;
        var price = item.price;
        var amount = item.cont;
        var adictionals = item.currentAdictionals;
        var comments = item.comments;
        //loop over adictionals
        //validate if adictionals is not null and is define
        var adi = "";
        var adiToWhatsapp = "";

        if (adictionals) {
            //sort adictionals by menuId
            adictionals = adictionals.sort(function(a, b) {
                return compareAdictional(a, b);
            });

            for (var j = 0; j < adictionals.length; j++) {
                var adiItem = adictionals[j];
                adi += adiItem.name + "";
                adiToWhatsapp += adiItem.name + "";
                //validate  adiItem.price is undefined

                if (adiItem.amount && adiItem.amount != "" && adiItem.amount != "undefined") {
                    adi += " " + adiItem.amount + "x";
                    adiToWhatsapp += " x" + adiItem.amount;
                }
                if (adiItem.price && adiItem.price != "" && adiItem.price != "undefined") {
                    adi += " $" + formatNumberToMil(adiItem.price);
                }
                adi += ", </br>";
                adiToWhatsapp += ", ";
            }
            //remove last , </br>
            adi = adi.substring(0, adi.length - 7);
            adi += "</br>";
            adiToWhatsapp = adiToWhatsapp.substring(0, adiToWhatsapp.length - 2);
            if (comments && comments != "") {
                adi += "comentarios: " + comments;
                adiToWhatsapp += ", comentarios: " + comments;
            }

        }

        var row = $("<tr></tr>");
        var image = `<div class="media">
                        <div class="d-flex">
                            <img src="${image}" alt=""
                                style="width: 100px; height: 100px;">
                        </div>
                        <div class="media-body">
                            <p>${name}</p>
                        </div>
                    </div>`;

        row.append(`<td>${image}</td>`);
        row.append(`<td>${adi}</td>`);
        row.append(`<td>$${formatNumberToMil(price)}</td>`);
        //row.append(`<td><i class = "material-icons btn border" id = "remove_item_${id}" index = "${i}"> delete </i> </td>`);
        tableBody.append(row);

        //add the currentAdictional to the cartItems
        //validate if adiToWhatsapp is not null and is define
        if (adiToWhatsapp) {
            cartToWhatsapp += `${name}: {${adiToWhatsapp}} `;
        } else {
            cartToWhatsapp += `${name} `;
        }
    }

    //create button to call whatsapp and send message
    var button = $("<button></button>");
    button.attr("id", "send_whatsapp");
    button.attr("class", "btn btn-continue-whatsapp");
    button.html("Ordenar via whatsapp");
    $("#cart_resumen_price_id").append(button);

    //add event to button
    $("#send_whatsapp").click(function() {
        sendWhatsapp(cartToWhatsapp);
    });

    function compareAdictional(a, b) {
        if (a.menuId < b.menuId)
            return -1;
        if (a.menuId > b.menuId)
            return 1;
        return 0;
    }
} //end loadCurrentCart


function sendWhatsapp(cartToWhatsapp) {

    //get element with id address
    var adressElement = $("#address");
    var address = adressElement.val();
    var orderComments = $("#order-comments").val();

    //get which check is checked
    var forTakeAway = $("#for-take-away-id").is(":checked");
    var forDelivery = $("#for-delivery-id").is(":checked");
    console.log(forDelivery);
    console.log(forTakeAway);
    //validate if forDelivery is false and forTakeAway is false
    if (!forDelivery && !forTakeAway) {
        showError("Debe seleccionar una opción de entrega");
        return;
    }

    if (forDelivery && (address == "" || address == "undefined" || address == "null" || address == " " || address.length < 6)) {
        showError("Debe ingresar una dirección válida");
        return;
    }

    //validate if adictionalComments is not null and is define
    if (orderComments && orderComments != "" && orderComments != "undefined" && orderComments != "null" && orderComments != " ") {
        //add adictionalComments to cartToWhatsapp
        cartToWhatsapp += `, instrucciones: ${orderComments}`;
    }

    var message = `${cartToWhatsapp}`;

    if (forDelivery) {
        message += `- entrega: ${address}`;
    } else {
        message += `- para recoger`;
    }

    var url = `https://wa.me/573208649988?text=${message}`;
    window.open(url);


}


function formatNumberToMil(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function showError(message, callback) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-right',
        iconColor: 'red',
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        confirmButtonText: 'Cerrar',
        timer: 2500,
    });
    Toast.fire({
        icon: 'error',
        title: message
    })




}