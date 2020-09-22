$(document).ready(function() {

    SyntaxHighlighter.defaults['toolbar'] = false;
    SyntaxHighlighter.all();

});

function closeWarning() {
    var removeElement = document.getElementById("myHeader");
    removeElement.parentNode.removeChild(removeElement);
}
