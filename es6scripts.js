(() => {
  let videosJSON;

  const getVideo = (videoID) => {
    let theVideoRequested = "none";
    videosJSON.videos.forEach((video) => {
      if (video.id === videoID) theVideoRequested = video
    })
    if(theVideoRequested == "none") {alert("Myndband númer " + videoID + " fannst ekki"); return 1}
    return theVideoRequested
  }

  const getVideoPath  = videoID => getVideo(videoID).video

  const getPosterPath = videoID => getVideo(videoID).poster

  function durationToString(videoID) {
    const videoLength = getVideo(videoID).duration;
    const seconds = (videoLength % 60 < 10) ? `0${videoLength % 60}` : videoLength % 60

    return `${Math.floor(videoLength / 60)}:${seconds}`;
  }

  function createDivs(classNamer) {
    const createDiv = document.createElement('div');
    createDiv.className = classNamer;
    return createDiv;
  }

  function createPicture(videoID) {
    const className = 'cards__singleCard__video__'
    const outerDiv = createDivs(`${className}outer`);
    const innerDiv = createDivs(`${className}inner`);
    innerDiv.appendChild(document.createTextNode(durationToString(videoID)));
    outerDiv.appendChild(innerDiv)
    return outerDiv;
  }

  const getFormattedTime = (videoID) => {
    const thenTime = getVideo(videoID).created;
    const nowTime = new Date().getTime();
    const diffTime =  (nowTime - thenTime) / 1000;
    if (diffTime > 31540000) {     return `Fyrir ${Math.floor(diffTime / 31540000)}      árum síðan`; }
    else if (diffTime > 2419000) { return `Fyrir ${Math.floor(diffTime / 2419000)}    mánuðum síðan`; }
    else if (diffTime > 86400) {   return `Fyrir ${Math.floor(diffTime / 86400)}        dögum síðan`; }
    else if (diffTime > 3600) {    return `Fyrir ${Math.floor(diffTime / 3600)} klukkustundum síðan`; }
    else if (diffTime > 60) {      return `Fyrir ${Math.floor(diffTime / 60)}         mínútum síðan`; }
    return                                `Fyrir ${Math.floor(diffTime)}             sekúndum síðan`;
  }

  const videoPlayer        = document.querySelector('.videoPlayer')
  const videoPlayerVideo   = document.querySelector('.videoPlayer__video')
  const videoPlayerHeading = document.querySelector('.videoPlayer__heading')

  const getHeading = videoID => getVideo(videoID).title
  const getControlButton = buttonName => document.querySelector(`.videoPlayer__controls__${buttonName}`)

  const flipElements = (element1, element2, displayValue) => {
    if (element1.style.display === '') element1.style.display = 'block'

    const showElement = (element1.style.display === displayValue)
    element1.style.display = (showElement)  ? 'none' : displayValue
    element2.style.display = (!showElement) ? 'none' : displayValue
  }

  const bindControlsTo = (video) => {
    const play       = getControlButton('play')
    const pause      = getControlButton('pause')
    const mute       = getControlButton('mute')
    const unmute     = getControlButton('unmute')
    const back       = getControlButton('back')
    const forward    = getControlButton('forward')
    const fullscreen = getControlButton('fullscreen')
    const goBackButton  = document.querySelector('.videoPlayer__goBack')
    const videoPlayIcon = document.querySelector('.videoPlayer__video__videoPlayIcon')

    const playPause = () => {
      flipElements(play, pause, 'block')
      if (video.paused) { video.play();  videoPlayIcon.style.display = 'none' }
      else              { video.pause(); videoPlayIcon.style.display = 'flex' }
    }

    const muteUnmute = () => {
      flipElements(mute, unmute, 'block')
      video.muted = !video.muted;
    }

    const goBackToMenu = () => {
      window.location.reload()
    }

    video.onended = () => {
      play.style.display = 'block'
      pause.style.display = 'none'
      videoPlayIcon.style.display = 'block'
    }

    goBackButton .addEventListener('click', goBackToMenu)
    videoPlayIcon.addEventListener('click', playPause)
    video        .addEventListener('click', playPause)
    play         .addEventListener('click', playPause)
    pause        .addEventListener('click', playPause)
    mute         .addEventListener('click', muteUnmute)
    unmute       .addEventListener('click', muteUnmute)
    back         .addEventListener('click', () => { video.currentTime -= 3 })
    forward      .addEventListener('click', () => { video.currentTime += 3 })
    fullscreen   .addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    })
  }

  const showVideoPlayer = () => {
    const allVideos = document.querySelector('.allVideos')
    videoPlayer.style.display = 'flex'
    allVideos  .style.display = 'none'
  }

  const playVideo = (videoID) => {
    const video    = document.createElement('video')
    const source   = document.createElement('source')
    const playIcon = document.createElement('img')

    video   .classList.add('videoPlayer__video__video')
    playIcon.classList.add('videoPlayer__video__videoPlayIcon')

    source.setAttribute('src', getVideoPath(videoID))
    source.setAttribute('type', 'video/mp4')

    playIcon.setAttribute('src', 'img/play.svg')

    videoPlayerHeading.innerHTML = getHeading(videoID)

    video           .appendChild(source)
    videoPlayerVideo.appendChild(video)
    videoPlayerVideo.appendChild(playIcon)

    bindControlsTo(video)
    showVideoPlayer()
  }

  const makeVideoCard = (videoID) => {
    const video   = createPicture(videoID)
    const card    = document.createElement('div')
    const heading = document.createElement('h2')
    const text    = document.createElement('p')

    // video has already the classes "cards__singleCard__video__outer"
    card    .classList.add('cards__singleCard')
    heading .classList.add('cards__singleCard__heading')
    text    .classList.add('cards__singleCard__time')

    let timeText    = getFormattedTime(videoID)
    let headingText = getHeading(videoID)

    timeText    = document.createTextNode(timeText)
    headingText = document.createTextNode(headingText)

    video.style.backgroundImage = `url(${getPosterPath(videoID)})`

    video.addEventListener('click', () => { playVideo(videoID) })

    heading.appendChild(headingText)
    text   .appendChild(timeText)

    card.appendChild(video)
    card.appendChild(heading)
    card.appendChild(text)

    return card
  }

  const makeCategory = (title, videoIDs) => {
    const videoSection = document.createElement('div')
    const heading      = document.createElement('h1')
    const cards        = document.createElement('div')
    const videoElements = videoIDs.map(index => makeVideoCard(index))

    videoSection.classList.add('allVideos__section')
    cards       .classList.add('cards')
    heading     .classList.add('h1')

    videoElements.forEach((video) => {
      cards.appendChild(video)
    })

    const headingText  = document.createTextNode(title)
    heading     .appendChild(headingText)

    videoSection.appendChild(heading)
    videoSection.appendChild(cards)

    return videoSection
  }

  const makeDivider = (notHiddenDivider) => {
    const divider = document.createElement('div')
    const show = 'allVideos__divider'
    const hide = 'allVideos__dividerHidden'
    divider.classList.add((notHiddenDivider) ? show : hide)
    if (notHiddenDivider) divider.classList.add('allVideos__divider')
    return divider
  }

  let allVideos;

  const renderVideoMenu = () => {
    const categoryArray = videosJSON.categories
    allVideos = document.createElement('div')
    const menuHeading     = document.createElement("h1")
    const menuHeadingText = document.createTextNode("Myndabandaleigan")
    menuHeading.appendChild(menuHeadingText)
    const categoryElements = categoryArray.map(category => makeCategory(category.title, category.videos))

    allVideos.classList.add('allVideos')
    allVideos.appendChild(menuHeading)
    document.querySelector('.body').appendChild(allVideos)

    categoryElements.forEach((categoryElement, i) => {
      allVideos.appendChild(makeDivider(i))
      allVideos.appendChild(categoryElement)
    })
  }

  //   MAIN FUNCTION, ALLT EXECUTE-AR HÉRNA
  (() => {
    const xml = new XMLHttpRequest()
    xml.open('GET', 'videos.json', true)
    xml.send(null)
    xml.onreadystatechange = () => {
      if (xml.readyState === XMLHttpRequest.DONE && xml.status === 200) {
        const JSONtext = xml.responseText
        videosJSON = JSON.parse(JSONtext)
        renderVideoMenu() // ENTRY POINT FYRIR KEYRSLU
      }
    }
  })();
})()
