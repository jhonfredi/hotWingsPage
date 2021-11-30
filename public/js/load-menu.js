$(document).ready(function() {
    loadMainMenu();
});


function checkLogged2(userLogCheckedCallBack) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.            
            userLogCheckedCallBack(true)
        } else {
            userLogCheckedCallBack(false)
        }
    });
}

function loadMainMenu() {

    var db = firebase.firestore();
    var comboxContainer = document.getElementById('combox-container');
    $("#combox-container div").text("");

    //get combos collection where status == "A"
    db.collection("combos").where("status", "==", "A").orderBy("order").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            const task = doc.data();
            //map task to a new object
            const combo = {
                id: doc.id,
                name: task.name,
                price: task.price,
                category: task.categoryId,
                description: task.description,
                image: task.image,
                status: task.status,
                isNew: task.isNew,
                onSale: task.onSale,
                originalPrice: task.originalPrice
            };

            var newItem =
                `<div class="shop_box">
					
						<img src="${combo.image}" class="img-fluid img-thumbnail rounded float-left" alt="${combo.name}"/>`;

            if (combo.isNew === true) {
                newItem += `<span class="new-box">
							<span class="new-label">Nuevo</span>
							</span>`;
            }
            if (combo.onSale === true) {
                var discount = (combo.originalPrice - combo.price) / combo.originalPrice * 100;
                //round up discout 

                discount = Math.round(discount);
                newItem += `<span class="sale-box">
							<span class="sale-label">-${discount} %</span>
						</span>`;
            }

            newItem += `
                            <div class="shop_desc">
							<h3><a href="#">${combo.name}</a></h3>
							<p>${combo.description}</p>
                            `;

            if (combo.onSale === true) {
                newItem +=
                    `<span class="reducedfrom">$${formatNumberToMil(combo.originalPrice)}</span>
					`
            }
            var imgUrl = combo.image.replace("%2F", "/hot2f");

            newItem += `<span class="actual">$${formatNumberToMil(combo.price)}</span>
                </div>`;


            newItem += `
            <div class="btns-on-product">
                        <a class="text-white col-md-5 btn btn-action-item" href="javascript:addToCart('${doc.id}','${combo.name}','${combo.description}','${imgUrl}','${combo.price}','${combo.category}',0)">Agregar</a>
                        <a class="text-white col-md-5 btn btn-action-item" href="javascript:addToCart('${doc.id}','${combo.name}','${combo.description}','${imgUrl}','${combo.price}','${combo.category}',1)"><span id="${combo.category}_${doc.id}_id_buy}">Comprar</a>
            </div>`;

            newItem += `</div>  `;
            comboxContainer.innerHTML += newItem;



        });
    });
}