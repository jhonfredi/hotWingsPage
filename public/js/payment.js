var globalTotalPrice = 0;
var globalShipment = 10000;
var globalSubtotal = 0;

$(document).ready(function() {
    loadNeigboordhods();
    loadCurrentCart();
    onlyOneOption();
});

function loadNeigboordhods() {

    // Initialize select2
    $("#select-neighborhood-id").select2();



    //get neigbordhods from localstorage
    var neigborhoods = neigborhoods = {
        "neig": []
    };
    //firestore.js
    getAllNeighborhoods((querySnapshot) => {

        querySnapshot.forEach(function(doc) {

            let data = doc.data();
            let option = {};
            option.id = doc.id;
            option.name = data.name;
            option.price = data.price;
            option.distance = data.distance;
            option.time = data.time;
            neigborhoods.neig.push(option);

            $("#select-neighborhood-id").append($('<option>', {
                value: option.id,
                text: option.name,
                price: option.price
            }));
        });

        setSelectNeighborhoodBehavior();

    });
}

function setSelectNeighborhoodBehavior() {

    $('#select-neighborhood-id').change(function() {

        var neighborHood = $('#select-neighborhood-id option:selected').text();
        var userid = $('#select-neighborhood-id').val();
        var price = $('#select-neighborhood-id option:selected').attr("price");
        var distance = $('#select-neighborhood-id option:selected').attr("distance");
        var time = $('#select-neighborhood-id option:selected').attr("time");

        //validate price not null not empty and no 0
        if (price && price != "" && price != "undefined" && price != "null" && price != " " && price != 0) {
            globalShipment = price;
            $("#check-shipment").text(`$${formatNumberToMil(price)}`);
            globalTotalPrice = parseInt(price) + parseInt(globalSubtotal);
            $("#check-total").text(`$${formatNumberToMil(globalTotalPrice)}`);

            //hide the element with id select-neighborhood-error-id
            $("#select-neighborhood-error-id").hide();

        } else {
            $("#check-shipment").text(`Entre $4.000 y $10.000`);
            //get the current check-subtotal and convert to number
            $("#check-total").text(`Entre ${formatNumberToMil(globalSubtotal+4000)} y ${formatNumberToMil(globalSubtotal+10000)}`);
        }
    });
}

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
                $("#check-shipment").text(`$${formatNumberToMil(globalShipment)}`);
                $("#check-total").text(`$${formatNumberToMil(globalTotalPrice)}`);
            } else {
                $("#section-for-delivery-id").attr("hidden", "hidden");
                //set the check-total equals to check-subtotal

                $("#check-total").text(`$${formatNumberToMil(globalSubtotal)}`);
            }

        }
    }
}

function loadCurrentCart() {

    var cart = localStorage.getItem("cart");

    //validate if cart is not null
    if (cart == null) {
        return;
    }

    if (cart) {
        cart = JSON.parse(cart);
    }

    //order the currentAdictionals by menuId desc

    //get table with id cart_list_id

    var tableBody = $("#cart_list_id tbody");

    var checkSubtotal = $("#check-subtotal");
    var checkShipment = $("#check-shipment");

    var checkTotal = $("#check-total");
    globalTotalPrice = cart.totalPrice;
    globalSubtotal = cart.totalPrice;
    checkSubtotal.html(`$${formatNumberToMil(cart.totalPrice)}`);
    checkShipment.html(`Entre $4.000 y $10.000`);
    checkTotal.html(`$${formatNumberToMil(cart.totalPrice)}`);

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

            adi = adi.substring(0, adi.length - 7);
            adi += "</br>";
            adiToWhatsapp = adiToWhatsapp.substring(0, adiToWhatsapp.length - 2);
            if (comments && comments != "") {
                adi += "comentarios: " + comments;
                adiToWhatsapp += ", comentarios: " + comments;
            }
        }

        var row = $("<tr></tr>");
        var image = `<div class="media img-fluid">
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
    //get  value: neigborhood.id,neigborhood.name,neigborhood.price,neigborhood.distance,neigborhood. to the selUser option selected with all values
    var selUser = $("#select-neighborhood-id option:selected");
    var neighborHood = selUser.text();
    var forDelivery = $("#for-delivery-id").is(":checked");
    var personName = $("#order-person-name").val();

    if (!validateOrder()) {
        return false;
    }

    //validate if adictionalComments is not null and is define
    if (orderComments && orderComments != "" && orderComments != "undefined" && orderComments != "null" && orderComments != " ") {
        //add adictionalComments to cartToWhatsapp
        cartToWhatsapp += `, instrucciones: ${orderComments}`;
    }

    var message = `${cartToWhatsapp}`;
    console.log(forDelivery + " " + personName);
    if (forDelivery) {
        message += `- entrega: ${neighborHood} - ${address} - para ${personName}`;
    } else {
        message += `- recoge ${personName}`;
    }

    console.log(message);
    var url = `https://wa.me/573208649988?text=${message}`;
    window.open(url);

}

function validateOrder() {

    //get element with id address
    var adressElement = $("#address");
    var address = adressElement.val();
    var orderComments = $("#order-person-name").val();
    //get  value: neigborhood.id,neigborhood.name,neigborhood.price,neigborhood.distance,neigborhood. to the selUser option selected with all values
    var selUser = $("#select-neighborhood-id option:selected");
    var id = selUser.attr("value");

    //get which check is checked
    var forTakeAway = $("#for-take-away-id").is(":checked");
    var forDelivery = $("#for-delivery-id").is(":checked");

    //validate if forDelivery is false and forTakeAway is false
    if (!forDelivery && !forTakeAway) {
        showError("Debe seleccionar una opci??n de entrega");
        return false;
    }

    if (forDelivery) {

        if (id == -1) {
            showError("Debe seleccionar un barrio");
            $("#select-neighborhood-id").focus();
            //show the element with id select-neighborhood-error-id
            $("#select-neighborhood-error-id").show();
            return false;
        }
        var time = selUser.attr("time");


        if (address == "" || address == "undefined" || address == "null" || address == " " || address.length < 6) {
            showError("Debe ingresar una direcci??n v??lida");
            $("#address").focus();
            return false;
        }
    }

    if (!orderComments || orderComments == "" || orderComments == "undefined" || orderComments == "null" || orderComments == " ") {
        showError("Por favor ind??quenos un nombre");
        //focus on order-person-name and scroll there
        $("#order-person-name").focus();
        return false;
    }
    return true
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