//This allow to show/hide password


document.addEventListener('DOMContentLoaded', function() {


    firebase.auth().useDeviceLanguage();

    //checkAndGoBackLogged();
    const passwordEle = document.getElementById('password');
    const toggleEle = document.getElementById('toggle');
    if (passwordEle && toggleEle) {
        toggleEle.addEventListener('click', function() {
            const type = passwordEle.getAttribute('type');
            passwordEle.setAttribute('type', type === 'password' ? 'text' : 'password');
        });
    }

    const passwordEleConfirm = document.getElementById('password-confirm');
    const toggleEleConfirm = document.getElementById('toggle-confirm');
    if (passwordEleConfirm && toggleEleConfirm) {
        toggleEleConfirm.addEventListener('click', function() {
            const type = passwordEleConfirm.getAttribute('type');
            passwordEleConfirm.setAttribute('type', type === 'password' ? 'text' : 'password');
        });
    }

    const passwordLoginConfirm = document.getElementById('password-login');
    const toggleLoginConfirm = document.getElementById('toggle-login');
    if (passwordLoginConfirm && toggleLoginConfirm) {
        toggleLoginConfirm.addEventListener('click', function() {
            const type = passwordLoginConfirm.getAttribute('type');
            passwordLoginConfirm.setAttribute('type', type === 'password' ? 'text' : 'password');
        });
    }

    const logWithGoogle = document.getElementById('log-with-google');
    if (logWithGoogle) {
        logWithGoogle.addEventListener('click', function() {
            loginWithGoogle();
        });
        catchForm();
    }

    const logWithFacebook = document.getElementById('log-with-facebook');
    if (logWithFacebook) {
        logWithFacebook.addEventListener('click', function() {
            loginWithFacebook();
        });
    }

    checkLoggedChangeBtn(userLogCheckedCallBack);
});

function checkLoggedChangeBtn(userLogCheckedCallBack) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.            
            userLogCheckedCallBack(true)
        } else {
            userLogCheckedCallBack(false)
        }
    });
}

function userLogCheckedCallBack(logged) {

    var btnLogout = document.getElementById('btn-user-log');

    if (btnLogout) {
        if (logged) {
            btnLogout.innerHTML = `<div class="display-next header-btn-righ">
            <span href="#" class="fas space-icon-log">
                Salir 
            </span>
                <span class="fas fa-sign-out-alt"></span>           
            </div>`;

            btnLogout.onclick = function() {
                logout();
            }
        } else {
            btnLogout.innerHTML = `<div class="display-next header-btn-righ">
            <span class="fas space-icon-log" href="login.html">
                Entrar
            </span>
            <span class="fas fa-sign-in-alt"></span>								                            
            </div>`;
        }
    }
}

function loginWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            // The signed-in user info.
            var user = result.user;
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var accessToken = credential.accessToken;
            //navigate to /
            sucessLoginCallback(user);

            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            errorRegisterCallback(errorCode, errorMessage);

        });

}

function loginWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    console.log(provider);
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        sucessRegisterCallback(user);
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        errorRegisterCallback(errorCode, errorMessage);
    });
}

function sucessRegisterCallback(user) {
    window.location.href = "index.html";
    showToastSuccessMessage('success', 'Registro exitoso');
}

function sucessLoginCallback(user) {
    window.location.href = "/";
    showToastSuccessMessage('success', 'Bienvenido');
}


function errorRegisterCallback(errorCode, errorMessage) {
    console.log("erroode" + errorCode);
    switch (errorCode) {
        case 'auth/email-already-in-use':
            showToastMessage('error', "El email ya se encuentra en uso");
            break;
        case 'auth/invalid-email':
            showToastMessage('error', "Email incorrecto");
            break;
        case 'auth/weak-password':
            showToastMessage('error', "Contraseña débil");
            break;
        case 'erroodeauth/popup-closed-by-user':
            showToastMessage('error', "El usuario canceló la operación");
            break;
        default:
            showToastMessage('error', errorMessage);
    }
}


function checkLogged() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.            
            return true;
        } else {
            return false;
        }
    });
}

function checkAndGoBackLogged() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.            
            window.location.href = "index.html";
        } else {

        }
    });
}

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location.href = "index.html";
    }).catch(function(error) {
        // An error happened.
    });
}

function catchForm() {

    var form = document.getElementById('reg-form');
    if (form) {
        if (form.attachEvent) {
            form.attachEvent("submit", processForm);
        } else {
            form.addEventListener("submit", processForm);
        }
    }

    var formLogin = document.getElementById('login-form');
    if (formLogin) {
        if (formLogin.attachEvent) {
            formLogin.attachEvent("submit", processLoginForm);
        } else {
            formLogin.addEventListener("submit", processLoginForm);
        }
    }

}


function processForm(e) {
    if (e.preventDefault) e.preventDefault();

    var form = document.getElementById('reg-form');
    var formData = new FormData(form);

    //get the email
    var email = formData.get('email');
    //get the password
    var password = formData.get('password');
    //get the password confirm
    var passwordConfirm = formData.get('password-confirm');

    //check if the password and password confirm are the same
    if (password != passwordConfirm) {
        showToastMessage('error', 'Las contraseñas no coinciden');
        return false;
    }

    //validate the email
    if (!validateEmail(email)) {
        showToastMessage('error', 'El email no es válido');
        return false;
    }

    //validate the password length
    if (password.length < 6) {
        showToastMessage('error', 'La contraseña debe tener al menos 6 caracteres');
        return false;
    }

    createUserWitEmailAndPassword(email, password, sucessRegisterCallback, errorRegisterCallback);

    // You must return false to prevent the default form behavior
    return false;
}


function errorLoginCallback(errorCode, errorMessage) {

    switch (errorCode) {
        case 'auth/email-already-in-use':
            showToastMessage('error', "El email ya se encuentra en uso");
            break;
        case 'auth/invalid-email':
            showToastMessage('error', "Email incorrecto");
            break;
        case 'auth/weak-password':
            showToastMessage('error', "Contraseña débil");
            break;
        case 'auth/wrong-password':
            showToastMessage('error', "Email o Contraseña incorrecta");
            break;
        case 'auth/user-not-found':
            showToastMessage('error', "Email o Contraseña incorrecta");
            break;
        default:
            showToastMessage('error', errorMessage);
    }
}

function showToastMessage(icon, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        iconColor: 'red',
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
    })
    Toast.fire({
        icon: icon,
        title: message
    })
}

function showToastSuccessMessage(icon, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        iconColor: 'green',
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    })
    Toast.fire({
        icon: icon,
        title: message
    })
}

function validateEmail(email) {
    //validate an email
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function processLoginForm(e) {
    if (e.preventDefault) e.preventDefault();

    var form = document.getElementById('login-form');
    var formData = new FormData(form);

    //get the email
    var email = formData.get('email');
    //get the password
    var password = formData.get('password');


    //validate the email
    if (!validateEmail(email)) {
        showToastMessage('error', 'El email no es válido');
        return false;
    }

    //validate the password length
    if (password.length < 6) {
        showToastMessage('error', 'La contraseña debe tener al menos 6 caracteres');
        return false;
    }

    loginWithEmail(email, password, sucessLoginCallback, errorLoginCallback);

    // You must return false to prevent the default form behavior
    return false;
}