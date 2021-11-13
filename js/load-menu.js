$(document).ready(function() {
    connectFirebase();
    checkLogged(userLogCheckedCallBack)
});


function userLogCheckedCallBack(logged) {
    console.log("userLogCheckedCallBack: " + logged);

    var btnLogout = document.getElementById('btn-user-log');

    if (logged) {

        btnLogout.innerHTML = `<a href="#">
            <i class="header-btn-righ fas fa-sign-out-alt"></i>            
            </a>`;


        btnLogout.onclick = function() {
            logout();
        }
    } else {
        btnLogout.innerHTML = `<a href="login.html">
        <i class="header-btn-righ fas fa-sign-in-alt"></i>							                            
        </a>`;
    }
}

function checkLogged(userLogCheckedCallBack) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.            
            userLogCheckedCallBack(true)
        } else {
            userLogCheckedCallBack(false)
        }
    });
}

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location.href = "index.html";
        console.log("Signed out");
    }).catch(function(error) {
        // An error happened.
    });
}

function connectFirebase() {

    var db = firebase.firestore();
    const comboxContainer = document.getElementById('combox-container');
    comboxContainer.innerHTML = "";

    //get combos collection where status == "A"
    db.collection("combos").where("status", "==", "A").onSnapshot(function(querySnapshot) {
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
                `<div class="col-md-3 mar-top-10 shop_box">
					<a >
						<img src="${combo.image}" class="img-responsive" alt=""/>`;

            if (combo.isNew === true) {
                newItem += `<span class="new-box">
							<span class="new-label">Nuevo</span>
							</span>`;
            }
            if (combo.onSale === true) {
                var discount = (combo.originalPrice - combo.price) / combo.originalPrice * 100;
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
                    `<span class="reducedfrom">${combo.originalPrice}</span>
					`
            }

            newItem += `<span class="actual">${combo.price}</span><br>
							<ul class="buttons">								
								<li class="btn-primary"><a href="javascript:addToCart('${doc.id}','${combo.name}','${combo.description}','${combo.image}','${combo.price}','${combo.category}')">Agregar</a></li>
								<div class="clear"> </div>
							</ul>
                            </div>
                            </a>
				</div>`;
            comboxContainer.innerHTML += newItem;

        });
    });
}