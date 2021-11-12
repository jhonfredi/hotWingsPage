//This allow to show/hide password
document.addEventListener('DOMContentLoaded', function() {

    const passwordEle = document.getElementById('password');
    const toggleEle = document.getElementById('toggle');
    toggleEle.addEventListener('click', function() {
        const type = passwordEle.getAttribute('type');
        passwordEle.setAttribute('type', type === 'password' ? 'text' : 'password');
    });

    const passwordEleConfirm = document.getElementById('password-confirm');
    const toggleEleConfirm = document.getElementById('toggle-confirm');
    toggleEleConfirm.addEventListener('click', function() {
        const type = passwordEleConfirm.getAttribute('type');
        passwordEleConfirm.setAttribute('type', type === 'password' ? 'text' : 'password');
    });

    catchFormRegister();

});

function catchFormRegister() {


    var form = document.getElementById('reg-form');
    if (form.attachEvent) {
        form.attachEvent("submit", processForm);
    } else {
        form.addEventListener("submit", processForm);
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

function sucessRegisterCallback(user) {
    window.location.href = "index.html";
    showToastSuccessMessage('success', 'Registro exitoso');
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