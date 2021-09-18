// Remove Phantom Text Nodes - Firefox Only?
function clean(node) {
    for (var n = 0; n < node.childNodes.length; n++) {
        var child = node.childNodes[n];
        if (
            child.nodeType === 8 ||
            (child.nodeType === 3 && !/\S/.test(child.nodeValue))
        ) {
            node.removeChild(child);
            n--;
        } else if (child.nodeType === 1) {
            clean(child);
        }
    }
}
clean(document);

// Footer Date
var footerDate = new Date();
document.getElementById("footer-date").innerHTML = footerDate.getFullYear();
