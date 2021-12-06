$(document).ready(function() {
    loadMainMenu();
    checkOpening();
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

function checkOpening() {

    let weAreClose = document.getElementById("we-are-close");

    getAllDays((querySnapshot) => {

        var date = new Date();
        let allDays = [];
        querySnapshot.forEach(function(doc) {
            const data = doc.data();
            data.id = doc.id;
            allDays.push(data);
        });
        var today = date.getDay();
        //search today in allDays
        var todayDay = allDays.find(x => x.day === today);

        var ourSchedulemessage = "";

        //validate todayIs null or undefined
        if (todayDay === undefined || todayDay === null || todayDay === "" || (todayDay.end <= date.getHours() && todayDay.endMinutes < date.getMinutes())) {
            //get the near day to open
            var nextDay = allDays.find(x => x.day > today);
            ourSchedulemessage = `Cerrado, abrimos el próximo  ${nextDay.id} a las ${nextDay.start}:${nextDay.startMinutes}, domicilios a toda Cartagena <a href='https://www.instagram.com/hotwingsctg' target='_blank' class='no-decoration-red'>@hotwingsctg</a>`;
            weAreClose.style.backgroundColor = "#272727";
            weAreClose.style.color = "red";

        } else {

            var start = todayDay.start;
            var startMinutes = todayDay.startMinutes;
            var end = todayDay.end;
            var endMinutes = todayDay.endMinutes;

            var hours = date.getHours();
            var minutes = date.getMinutes();



            //validate if date is before to start and startMinutes
            if (hours < start || (hours === start && minutes < startMinutes)) {
                ourSchedulemessage = `Abrimos a las ${start}:${startMinutes} domicilios a toda Cartagena <a href='https://www.instagram.com/hotwingsctg' target='_blank' class='no-decoration-red'>@hotwingsctg</a>`;
                weAreClose.style.backgroundColor = "#272727";
                weAreClose.style.color = "red";
                //create a countdown to start
                var countDownDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), start, startMinutes);
                var x = setInterval(function() {
                    var now = new Date().getTime();
                    var distance = countDownDate - now;
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

                    if (distance < 120000 && distance > 60000) {
                        weAreClose.innerHTML = `Abrimos en 2 minutos domicilios a toda Cartagena <a href='https://www.instagram.com/hotwingsctg' target='_blank' class='no-decoration-red'>@hotwingsctg</a>`;
                    } else if (distance < 60000) {
                        weAreClose.style.color = "red";
                        weAreClose.innerHTML = `Abrimos en 1 minuto domicilios a toda Cartagena <a href='https://www.instagram.com/hotwingsctg' target='_blank' class='no-decoration-red'>@hotwingsctg</a>`;
                    } else {
                        weAreClose.innerHTML = `Abrimos en ${hours}h : ${minutes} minutos domicilios a toda Cartagena <a href='https://www.instagram.com/hotwingsctg' target='_blank' class='no-decoration-red'>@hotwingsctg</a>`;
                    }

                    if (distance < 0) {
                        clearInterval(x);
                        weAreClose.innerHTML = `Cerramos a las ${end}:${endMinutes} domicilios a toda Cartagena <a href='https://www.instagram.com/hotwingsctg' target='_blank' class='no-decoration-white'>@hotwingsctg</a>`;
                        weAreClose.style.backgroundColor = "#01e675";
                        weAreClose.style.color = "white";
                    }
                }, 100);


            } else {

                ourSchedulemessage = `Cerramos a las ${end}:${endMinutes} domicilios a toda Cartagena <a href='https://www.instagram.com/hotwingsctg' target='_blank' class='no-decoration-white'>@hotwingsctg</a>`;
                weAreClose.style.backgroundColor = "#01e675";
                weAreClose.style.color = "white";
            }

        }

        weAreClose.innerHTML = ourSchedulemessage;
    });

}

function loadMainMenu() {

    var db = firebase.firestore();
    var comboxContainer = document.getElementById('combox-container');
    //$("#combox-container div").text("");


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