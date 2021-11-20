//on document ready
$(document).ready(function() {
    firebase.initializeApp(firebaseConfig);
});

const category = {
    id: "",
    name: "",
    order: 0,
    status: "A"
}

const firebaseConfig = {
    apiKey: "AIzaSyCYuuQM8vQus29Jsq2z9ZfTijblR38I13c",
    authDomain: "hotwingsctg.com",
    projectId: "hotwingscartagena",
    storageBucket: "hotwingscartagena.appspot.com",
    messagingSenderId: "1042930989666",
    appId: "1:1042930989666:web:7ad46b390d7998fa08af3b",
    measurementId: "G-9CYS2LFT7C"
};



//create function to get item from firebase by id
async function getItemBycategoryId(id) {
    //Get category collection
    var db = firebase.firestore();

    //get categories collection where doc id= id

    const snapshot = await db.collection('categories').doc(id).get();

    return new Promise(resolve => {

        const category = snapshot.data();

        var myCategory = {
            id: snapshot.id,
            name: category.name,
            order: category.order,
            status: category.status,
            menuOptions: []
        }
        category.id = snapshot.id; //category.status = snapshot.data().status

        category.menuOptions = [];

        if (category.status.localeCompare('A') == 0) {

            //Get all menuOptionOnItem by category
            db.collection("menuOptionOnItemInCar").where("categoryId", "==", category.id.toString()).onSnapshot(function(querySnapshot) {

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

                    db.collection("OptionOnItemInCar").where("menuOptionOnItemInCarId", "==", doc.id.toString()).onSnapshot(function(querySnapshotM) {
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
        } else {
            resolve(null);
        }

    });
}

//funtion to get collection categories with two parameters id and callback
async function getCategorieById(id, callback) {
    //Get category collection
    var db = firebase.firestore();

    const snapshot = await db.collection('categories').doc(id).get();

    callback(snapshot);

}

async function getMenuOptionByCategoryId(category, callback, onFinishCallback) {

    var db = firebase.firestore();
    db.collection("menuOptionOnItemInCar").where("categoryId", "==", category.id.toString()).orderBy("order").onSnapshot(function(querySnapshot) {
        console.log(querySnapshot.data());
        callback(querySnapshot, category, onFinishCallback);
    });
}

async function getMenuOptionByCategoryId(category, callback, onFinishCallback) {
    var db = firebase.firestore();
    db.collection("menuOptionOnItemInCar").where("categoryId", "==", category.id.toString()).orderBy("order").onSnapshot(function(querySnapshot) {
        callback(querySnapshot, category, onFinishCallback);
    });
}

async function getMenuOptionOnItemByMenuId(menuOption, index, category, callback, onFinishCallback) {
    var db = firebase.firestore();
    await db.collection("OptionOnItemInCar").where("menuOptionOnItemInCarId", "==", menuOption.id.toString()).orderBy("order").onSnapshot(function(querySnapshot) {

        var cat2 = callback(querySnapshot, menuOption, index, category, onFinishCallback);

    });

    return category;
}

async function getAditionalById(aditionalId, onGetAditionalByIdComplete) {

    var db = firebase.firestore();

    const snapshot = await db.collection('aditionals').doc(aditionalId).get();
    onGetAditionalByIdComplete(snapshot);
}


async function getItemsMenuByMenuOptionId(menuOptionId) {
    var db = firebase.firestore();
    let citiesRef = db.collection("optionOnItemInCar").where("menuOptionOnItemInCarId", "==", menuOptionId);
    let allCities = await citiesRef.get();

    console.log(allCities);
    for (const doc of allCities.docs) {
        console.log("the log");
        console.log(doc.id, '=>', doc.data());
    }
}

/*Autentications and auth*/
function createUserWitEmailAndPassword(email, password, sucessCallback, errorCallback) {
    var db = firebase.firestore();
    console.log(db);

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            sucessCallback(user);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            errorCallback(errorCode, errorMessage);
        });
}

function loginWithEmail(email, password, sucessCallback, errorCallback) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
        sucessCallback();
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        errorCallback(errorCode, errorMessage);
    });
}