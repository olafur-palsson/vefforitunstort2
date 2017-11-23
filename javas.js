
function durationToString(videoID){
  var duration = getVideo(videoID).duration;
  return Math.floor(duration/60) + ":" + duration%60;

}

function createDivs(classNamer){
var createDiv = document.createElement("div");
createDiv.className = classNamer;
return createDiv;
}

function createPicture (videoID){
const outerDiv = createDivs("outer");
const innerDiv = createDivs("inner");
innerDiv.appendChild(document.createTextNode(durationToString(videoID)));
outerDiv.appendChild(innerDiv)
return outerDiv;

}

document.querySelector(".hvar sem þetta á að fara").appendChild(createPicture(videoID));
