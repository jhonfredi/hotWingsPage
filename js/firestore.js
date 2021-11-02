//on document ready
$(document).ready(function() {
	connectFirebase();
});


const firebaseConfig = {
    apiKey: "AIzaSyCYuuQM8vQus29Jsq2z9ZfTijblR38I13c",
    authDomain: "hotwingscartagena.firebaseapp.com",
    projectId: "hotwingscartagena",
    storageBucket: "hotwingscartagena.appspot.com",
    messagingSenderId: "1042930989666",
    appId: "1:1042930989666:web:7ad46b390d7998fa08af3b",
    measurementId: "G-9CYS2LFT7C"
  };

function connectFirebase(){

	firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  const comboxContainer = document.getElementById('combox-container');
  
//get combos collection where status == "A"
db.collection("combos").where("status", "==", "A").onSnapshot(function(querySnapshot) {
	querySnapshot.forEach(function(doc) {
		const task =doc.data();
				//map task to a new object
				const combo = {
					id: doc.id,
					name: task.name,
					price: task.price,
					category: task.category,
					description: task.description,
					image: task.image,
					status: task.status,
					isNew: task.isNew,
					onSale: task.onSale,
					originalPrice: task.originalPrice
				};

				var newItem = 
				`<div class="col-md-4 mar-top-10">
					<a href="single.html">
						<img src="${combo.image}" class="img-responsive" alt=""/>`;

						if(combo.isNew === true){
							newItem+=`<span class="new-box">
							<span class="new-label">Nuevo</span>
							</span>`;
						}					
						if(combo.onSale === true){
							var discount = (combo.originalPrice - combo.price )/combo.originalPrice*100;
							newItem+=`<span class="sale-box">
							<span class="sale-label">-${discount} %</span>
						</span>`;
						}

					newItem += `
						<div class="shop_desc">
							<h3><a href="#">${combo.name}</a></h3>
							<p>${combo.description}</p>`;

				if(combo.onSale === true){
					newItem += 
					`<span class="reducedfrom">${combo.originalPrice}</span>
					`
								}
							
				newItem += 	`<span class="actual">${combo.price}</span><br>
							<ul class="buttons">								
								<li class="cart"><a href="javascript:addToCart('${doc.id}','${combo.name}','${combo.image}','${combo.price}')">Agregar</a></li>
								<div class="clear"> </div>
							</ul>
						</div>
					</a>
				</div>`;					
				comboxContainer.innerHTML += newItem; 

	});
});

}
 

//create function to get item from firebase by id
function getItem(id){
	const db = firebase.firestore();
	const item = db.collection("combos").doc(id);
	return item;
}

  



  

  // Initialize Firestore through Firebase

/*
		//get db connection to firebase
		const db = getFirestore(app);

		

		const querySnapshot =  getDocs(collection(db, "combos"), where("status","==","A"), orderBy("category"));

			querySnapshot.forEach((doc) => {

				//map doc to a new object
			
			
			

					
				
				
				

		});

        */