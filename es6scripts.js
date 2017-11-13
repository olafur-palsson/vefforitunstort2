(() => {
  const makeVideoCard = (videoID) => {
    console.log(videoID)
    const card    = document.createElement("div")
    const video   = document.createElement("video")
    const heading = document.createElement("h2")
    const text    = document.createElement("p")

    card    .classList.add("cards__singleCard")
    video   .classList.add("cards__singleCard__video")
    heading .classList.add("cards__singleCard__heading")
    text    .classList.add("cards__singleCard__time")

    let timeText    = getFormattedTime(videoID)
    let headingText = getHeading(videoID)

    timeText    = document.createTextNode(timeText)
    headingText = document.createTextNode(headingText)

    heading.appendChild(headingText)
    text   .appendChild(timeText)

    card.appendChild(video)    
    card.appendChild(heading)
    card.appendChild(text)

    console.log("Does it work bruh " + jsonObject)

    return card
  }

  const getFormattedTime = (videoID) => {
    const time = getTime(videoID)

    //format shit

    return time
  }

  const getTime = (videoID) => {
    //const blabla = videoList.time
    const blabla = "eitthvað"
    return blabla
  }

  const getHeading = (videoID) => {
    return "Súrt dæmi"
  }

  let jsonObject;

  (() => {
    const xml = new XMLHttpRequest
    xml.open("GET", "videos.json", true)
    xml.send(null)
    xml.onreadystatechange = () => {

      //vanter handler fyrir OK get kóða
      const JSONtext = xml.responseText
      console.log("blablabla response")
      jsonObject = JSON.parse(JSONtext)
      render()
    }
  })();

  const render = () => {
    const categories = jsonObject.categories
    const videos     = jsonObject.videos

    videos.forEach((index) => {
      document.querySelector(".body").appendChild(
        makeVideoCard(index.id)
      )
    })

    console.log(videos)
  }


  //test
  (() => {
    document.querySelector(".body").appendChild(makeVideoCard(1))
  })()





})()