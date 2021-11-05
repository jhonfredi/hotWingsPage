//on document ready
$(document).ready(function() {
	connectFirebase();
});

const category ={
	id: "",
	name: "",
	order: 0,
	status: "A"
}

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
					category: task.categoryId,
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
								<li class="cart"><a href="javascript:addToCart('${doc.id}','${combo.name}','${combo.description}','${combo.image}','${combo.price}','${combo.category}')">Agregar</a></li>
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
async function getItemBycategoryId(id){
	//Get category collection
	var db = firebase.firestore();
	
	//get categories collection where doc id= id

	const snapshot=await db.collection('categories').doc(id).get();

	return new Promise(resolve => {		

		const category = snapshot.data();

		var myCategory = {
			id: snapshot.id,
			name: category.name,
			order: category.order,
			status: category.status,
			menuOptions:[]
		}
		category.id=snapshot.id;					//category.status = snapshot.data().status
		
		category.menuOptions = [];
		
		if(category.status.localeCompare('A') ==0){

			//Get all menuOptionOnItem by category
			db.collection("menuOptionOnItemInCar").where("categoryId","==", category.id.toString()).onSnapshot(function(querySnapshot) {
				
				querySnapshot.forEach(function(doc) {
					//get the collection OptionsOnItemInCart for each doc
					
					let data = doc.data();					
					let menuOption = {};					
					menuOption.id = doc.id;
					menuOption.categoryId = data.categoryId;
					menuOption.name = data.name;					
					menuOption.order = data.order;
					menuOption.OptionsOnItemInCart = data.OptionsOnItemInCart;
					
					//menuOption.optionItems =await getItemsMenuByMenuOptionId (menuOption.id);
					menuOption.optionItems = [];
					//gettin the menuItem
					
					db.collection("OptionOnItemInCar").where("menuOptionOnItemInCarId","==",doc.id.toString()).onSnapshot(function(querySnapshotM) {
						querySnapshotM.forEach(function(docM) {
							
							let dataItem = docM.data();
							let optionItem = {};
							optionItem.id = docM.id;
							optionItem.fieldType = dataItem.fieldType;
							optionItem.name = dataItem.name;
							optionItem.menuOptionOnItemInCarId = dataItem.menuOptionOnItemInCarId;
							optionItem.order = dataItem.order;
							menuOption.optionItems.push(optionItem);

						});

					});
					
					/*
					db.collection("optionOnItemInCar").where("menuOptionOnItemInCarId", "==", menuOption.id).onSnapshot(function(querySnapshotM) {
						
						querySnapshotM.forEach(function(docM) {
							console.log("aaaa");
							console.log(docM.data());
							let dataItem = docM.data();
							let optionItem = {};
							optionItem.id = docM.id;
							optionItem.fieldType = dataItem.fieldType;
							optionItem.name = dataItem.name;
							optionItem.menuOptionOnItemInCarId = dataItem.menuOptionOnItemInCarId;
							optionItem.order = dataItem.order;
							menuOption.optionItems.push(optionItem);
						});
					});*/
					//add menuOption to category
					myCategory.menuOptions.push(menuOption);

				});
			});

			resolve(myCategory);
		}else{
			resolve (null);
		}
		
	});
}

//funtion to get collection categories with two parameters id and callback
async function getCategorieById(id,callback){
	//Get category collection
	var db = firebase.firestore();

	const snapshot=await db.collection('categories').doc(id).get();

	callback(snapshot);

}

async function getMenuOptionByCategoryId(category,callback){
	
	var db = firebase.firestore();
	db.collection("menuOptionOnItemInCar").where("categoryId","==", category.id.toString()).onSnapshot(function(querySnapshot) {
		callback(querySnapshot,category);
	});
	
}

async function getMenuOptionByCategoryId(category,callback,onFinishCallback){	
	var db = firebase.firestore();
	db.collection("menuOptionOnItemInCar").where("categoryId","==", category.id.toString()).onSnapshot(function(querySnapshot) {
		callback(querySnapshot,category, onFinishCallback);
	});
}

async function getMenuOptionOnItemByMenuId(menuOption,callback){	
	var db = firebase.firestore();	
	db.collection("OptionOnItemInCar").where("menuOptionOnItemInCarId","==", menuOption.id.toString()).onSnapshot(function(querySnapshot) {
		callback(querySnapshot,menuOption);
	});
}




/*
  async function getItemsMenuByMenuOptionId (menuOptionId){
	
	var db = firebase.firestore();

	var optionItems =[];	
	
	const snapshot =await db.collection("optionOnItemInCar").where("menuOptionOnItemInCarId", "==", menuOptionId);
	
	return new Promise(resolve => {
			snapshot.onSnapshot(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					console.log(doc.data());
					let dataItem = doc.data();
					let optionItem = {};
					optionItem.id = doc.id;
					optionItem.fieldType = dataItem.fieldType;
					optionItem.name = dataItem.name;
					optionItem.menuOptionOnItemInCarId = dataItem.menuOptionOnItemInCarId;
					optionItem.order = dataItem.order;
					optionItems.push(optionItem);
					console.log("option "+optionItem.name);
					//return optionItem;
					//optionItems.push(optionItem);
					//return optionItems;
				});				
			});	
			resolve(optionItems);
 
	});
}*/

async function  getItemsMenuByMenuOptionId(menuOptionId){
	var db = firebase.firestore();	
	let citiesRef = db.collection("optionOnItemInCar").where("menuOptionOnItemInCarId", "==", menuOptionId);
	let allCities = await citiesRef.get();

	console.log(allCities);
	for(const doc of allCities.docs){
		console.log("the log");
	  console.log(doc.id, '=>', doc.data());
	}

}
