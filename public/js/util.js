//on ready
$(document).ready(function() {
    setClipBoard();
});

var nequiNumber = 3108349697;
var daviplataNumber = 3208649988;
var bancolombiaNumber = 49544958118;

function setClipBoard() {

    var nequiField = document.getElementById("nequi_number");
    nequiField.innerHTML = nequiNumber;
    var copyButton = document.createElement("button");
    copyButton.setAttribute("type", "button");
    copyButton.setAttribute("id", "copy_nequi");
    copyButton.setAttribute("class", "btn btn-clipboard ma-l-1");
    copyButton.setAttribute("aria-describedby", "tooltip_copiado");
    copyButton.innerHTML = "Copiar";
    copyButton.onclick = function() {
        setClipboard(copyButton, nequiNumber);
    };
    nequiField.appendChild(copyButton);

    var bancolomibiaField = document.getElementById("bancolombia_number");
    bancolomibiaField.innerHTML = bancolombiaNumber;
    var copyButtonBancolombia = document.createElement("button");
    copyButtonBancolombia.setAttribute("type", "button");
    copyButtonBancolombia.setAttribute("id", "copy_bancolomibia");
    copyButtonBancolombia.setAttribute("class", "btn btn-clipboard");
    copyButtonBancolombia.setAttribute("aria-describedby", "tooltip_copiado");
    copyButtonBancolombia.innerHTML = "Copiar";
    copyButtonBancolombia.onclick = function() {
        setClipboard(copyButtonBancolombia, bancolombiaNumber);
    }
    bancolomibiaField.appendChild(copyButtonBancolombia);

    var daviplataField = document.getElementById("daviplata_number");
    daviplataField.innerHTML = daviplataNumber;
    var copyDaviplataButton = document.createElement("button");
    copyDaviplataButton.setAttribute("type", "button");
    copyDaviplataButton.setAttribute("id", "copy_daviplata");
    copyDaviplataButton.setAttribute("class", "btn btn-clipboard .ma-l-1");
    copyDaviplataButton.setAttribute("aria-describedby", "tooltip_copiado");
    copyDaviplataButton.innerHTML = "Copiar";
    copyDaviplataButton.onclick = function() {
        setClipboard(copyDaviplataButton, daviplataNumber);
    };
    daviplataField.appendChild(copyDaviplataButton);



}


function copyToClipboard(nequiField, value) {
    var textField = document.createElement('textarea');
    textField.innerText = value;
    document.body.appendChild(textField);
    textField.select();
    var promise = navigator.clipboard.write(value);
    textField.remove();
    nequiField.innerHTML = "Copiado";


}

function setClipboard(field, text) {
    var type = "text/plain";
    var blob = new Blob([text], { type });
    var data = [new ClipboardItem({
        [type]: blob
    })];

    navigator.clipboard.write(data).then(
        function() {
            //change the inner html of field to "Copiado" by 3 seconds
            field.innerHTML = "Copiado";
            setTimeout(function() {
                field.innerHTML = "Copiar";

            }, 1500);
        },
        function() {}
    );
}