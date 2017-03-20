addLoadEvent(prepareGallery);

function addLoadEvent(fuc){
	var onload = window.onload;
	if (typeof window.onload != "function"){
		window.onload = fuc;
	} else {
		window.onload = function() {
			onload();
			func();
		}
	}
}

function prepareGallery(){
	if (!document.getElementById) return false;
	if (!document.getElementsByTagName) return false;
	var gallery = document.getElementById("imagegallery");
	if (!gallery) return false;
	var links = gallery.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		links[i].onclick = function(){
			return !showPic(this);
		}
		links[i].onkeypress = links[i].onclick;
	}
}

function showPic(whichpic) {
	if (!document.getElementById("placeholder"))  return false;
	var source = whichpic.getAttribute("href");
	var placeholder = document.getElementById("placeholder");
	placeholder.setAttribute("src",source);
	var description = document.getElementById("description");
	if (description) {
		var text = whichpic.getAttribute("title");
		description.firstChild.nodeValue = text;
	}
	return true;
}