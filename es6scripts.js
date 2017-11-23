(() => {
  let videosJSON;

  const getVideo = (videoID) => {
    let theVideoRequested;
    videosJSON.videos.forEach( (video, index) => {
      if(video.id == videoID) theVideoRequested = video
    })
    return theVideoRequested
  }

  const getVideoPath  = (videoID) => {
    return getVideo(videoID).video
  }

  const getPosterPath = (videoID) => {
    return getVideo(videoID).poster
  }

  function durationToString(videoID){
    const duration = getVideo(videoID).duration;
    const seconds = (duration%60<10) ? "0" + duration%60 : duration%60

    return Math.floor(duration/60) + ":" + seconds;
  }

  function createDivs(classNamer){
    var createDiv = document.createElement("div");
    createDiv.className = classNamer;
    return createDiv;
  }

  function createPicture (videoID){
    const className = "cards__singleCard__video__"
    const outerDiv = createDivs(className + "outer");
    const innerDiv = createDivs(className + "inner");
    innerDiv.appendChild(document.createTextNode(durationToString(videoID)));
    outerDiv.appendChild(innerDiv)
    return outerDiv;
  }

  const getFormattedTime = (videoID) => {
    const thenTime = getVideo(videoID).created;
    const nowTime = new Date().getTime();
    const diffTime =  (nowTime - thenTime)/1000;
    if (diffTime > 31540000){     return "Fyrir " + Math.floor(diffTime/31540000) + " árum síðan";}
    else if (diffTime > 2419000){ return "Fyrir " + Math.floor(diffTime/2419000) + " mánuðum síðan";}
    else if (diffTime > 86400){   return "Fyrir " + Math.floor(diffTime/86400) + " dögum síðan";}
    else if (diffTime > 3600){    return "Fyrir " + Math.floor(diffTime/3600) + " klukkustundum síðan";}
    else if (diffTime > 60){      return "Fyrir " + Math.floor(diffTime/60) + " mínútum síðan";}
    else {                        return "Fyrir " + Math.floor(diffTime) + " sekúndum síðan";}
  }

  const getHeading = (videoID) => {
    return getVideo(videoID).title
  }

  const makeVideoCard = (videoID) => {
    const card    = document.createElement("div")
    const video   = createPicture(videoID)
    const heading = document.createElement("h2")
    const text    = document.createElement("p")

    //video has already the classes "cards__singleCard__video__outer"
    card    .classList.add("cards__singleCard")
    heading .classList.add("cards__singleCard__heading")
    text    .classList.add("cards__singleCard__time")

    let timeText    = getFormattedTime(videoID)
    let headingText = getHeading(videoID)
    const imagePath = getPosterPath(videoID)

    timeText    = document.createTextNode(timeText)
    headingText = document.createTextNode(headingText)

    video.style.backgroundImage = "url(" + getPosterPath(videoID) + ")"
    video.addEventListener("click", () => {
      console.log("playVideo " + videoID)
      playVideo(videoID)
    })

    heading.appendChild(headingText)
    text   .appendChild(timeText)

    card.appendChild(video)
    card.appendChild(heading)
    card.appendChild(text)

    return card
  }

  const makeCategory = (title, videoIDs) => {
    const videoSection = document.createElement("div")
    const heading      = document.createElement("h1")
    const cards        = document.createElement("div")
    const videoElements = videoIDs.map((index) => {
      return makeVideoCard(index)
    })

    videoSection.classList.add("videos__section")
    cards       .classList.add("cards")
    heading     .classList.add("h1")

    videoElements.forEach((video) => {
      cards.appendChild(video)
    })

    const headingText  = document.createTextNode(title)
    heading     .appendChild(headingText)

    videoSection.appendChild(heading)
    videoSection.appendChild(cards)

    return videoSection
  }

  const makeDivider = () => {
    const divider = document.createElement("div")
    divider.classList.add("allVideos__divider")
    return divider
  }

  let allVideos;

  const renderEverything = () => {
    const categories = videosJSON.categories
    const videos     = videosJSON.videos
    allVideos = document.createElement("div")

    const categoryElements = categories.map((category) => {
      return makeCategory(category.title, category.videos)
    })

    allVideos.classList.add("allVideos")
    document.querySelector(".body").appendChild(allVideos)

    categoryElements.forEach((categoryElement, i) => {
      if(i != 0) allVideos.appendChild(makeDivider())
      allVideos.appendChild(categoryElement)
    }) 
  }

  const removeChildren = (node) => {
    while(node.hasChildNodes())
      node.removeChild(node.firstChild)
  }

  const videoPlayer        = document.querySelector(".videoPlayer")
  const videoPlayerVideo   = document.querySelector(".videoPlayer__video")
  const videoPlayerHeading = document.querySelector(".videoPlayer__heading")

  const showVideoPlayer = (yes) => {
    const allVideos = document.querySelector(".allVideos")
    videoPlayer.style.display = (yes) ? "flex" : "none"
    allVideos  .style.display = (yes) ? "none"  : "block"
    if(!yes) {
      removeChildren(videoPlayerVideo)
    }
  }

  const goBackToMenu = () => { showVideoPlayer(false) }
  (() => {
    const goBackButton = document.querySelector(".videoPlayer__goBack")
    goBackButton.addEventListener("click", goBackToMenu)
  })();

  const getControlButton = (buttonName) => {
    return document.querySelector(".videoPlayer__controls__" + buttonName)
  }

  const flipElements = (element1, element2, displayValue) => {
    if(element1.style.display == "") element1.style.display = "block"
    const showElement = (element1.style.display == displayValue)
    element1.style.display = (showElement)  ? "none" : displayValue
    element2.style.display = (!showElement) ? "none" : displayValue

  }

  const playPause = (video) => {
    const isPlaying = (!video.paused)
    return (isPlaying) ? video.play() : video.pause()
  }

  const bindControlsTo = (video) => {
    const play       = getControlButton("play")
    const pause      = getControlButton("pause")
    const mute       = getControlButton("mute")
    const unmute     = getControlButton("unmute")
    const back       = getControlButton("back")
    const forward    = getControlButton("forward")
    const fullscreen = getControlButton("fullscreen")

    play   .addEventListener("click", () => {
      flipElements(play, pause, "block")
      video.play()
    })

    pause  .addEventListener("click", () => {
      flipElements(play, pause, "block")
      video.pause()
    })

    mute   .addEventListener("click", () => {
      flipElements(mute, unmute, "block")
      video.muted = true
    })

    unmute .addEventListener("click", () => {
      flipElements(mute, unmute, "block")
      video.muted = false
    })

    back   .addEventListener("click", () => {
      video.currentTime -= 3
    })

    forward.addEventListener("click", () => {
      video.currentTime += 3
    })

    fullscreen.addEventListener("click", () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen(); // Firefox
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen(); // Chrome and Safari
      }
    })
  }

  const playVideo = (videoID) => {
    const video = document.createElement("video")
    const source = document.createElement("source")

    source.setAttribute("src" , getVideoPath(videoID))
    source.setAttribute("type", "video/mp4")  
    video .setAttribute("width" , "100%")
    video .setAttribute("height", "100%")

    videoPlayerHeading.innerHTML = getHeading(videoID)

    video           .appendChild(source)
    videoPlayerVideo.appendChild(video)

    bindControlsTo(video)

    showVideoPlayer(true)
  }


  //   MAIN FUNCTION, ALLT EXECUTE-AR HÉRNA
  ;(() => {
    const xml = new XMLHttpRequest
    xml.open("GET", "videos.json", true)
    xml.send(null)
    xml.onreadystatechange = () => {
      if(xml.readyState === XMLHttpRequest.DONE && xml.status === 200) {
        const JSONtext = xml.responseText
        console.log("I have the JSON file! I really have it this time :d")
        videosJSON = JSON.parse(JSONtext)
        renderEverything() // Þetta bókstaflega keyrir allt
      }
    }
  })();
})()
