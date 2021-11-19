//on load document
$(document).ready(function() {
    loadCurrentCart();
});

function loadCurrentCart() {

    var cart = localStorage.getItem("cart");

    if (cart) {
        cart = JSON.parse(cart);
    }

    //order the currentAdictionals by menuId desc

    //get table with id cart_list_id
    var cartListTable = $("#cart_list_id");
    var tableBody = $("#cart_list_id tbody");
    //get element by id check_subtotal
    var checkSubtotal = $("#check_subtotal");
    var checkShipment = $("#check_shipment");
    var checkTotal = $("#check_total");
    checkSubtotal.html(`$${formatNumberToMil(cart.totalPrice)}`);
    checkShipment.html(`~$10.000 varia según dirección`);
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
    //validate if address is not null and is define
    if (address && address != "" && address != "undefined" && address != "null" && address != " " && address.length > 5) {
        var message = `${cartToWhatsapp} - Dirección: ${address} `;

        var url = `https://wa.me/573208649988?text=${message}`;
        window.open(url);

    } else {
        adressElement.focus();
        showError("Debe ingresar una dirección válida");
    }

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