// This is a JavaScript file
var analysis={};
var callbackUrl = "http://emotionplanet.itdharman.com";

// jsOAuth object
var oauth = OAuth({
    consumerKey: "AqHwxXIwa5On8JmZeWKrtZW8M", // REPLACE HERE TO YOUR CONSUMER KEY or API KEY
    consumerSecret: "0gWGFuttMc8CqCFZcZn0oE0HMPhrrqjcpCd2WrbYRrx1k4pjEL", // REPLACE HERE TO YOUR CONSUMER SECRET OR API SECRET
    callbackUrl: callbackUrl,
    requestTokenUrl: "https://api.twitter.com/oauth/request_token",
    authorizationUrl: "https://api.twitter.com/oauth/authorize",
    accessTokenUrl: "https://api.twitter.com/oauth/access_token"
});

// Get oAuth Request Token and display authentication window (3-legged request)



function connect() {

  oauth.fetchRequestToken((url) => {
    showAuthWindow(url);
  }, (data) => {
    console.log(JSON.stringify(data));
  });
  
}

// Display Twitter authentication page.
// When the user logs in, obtain a verifier and get Access Token
function showAuthWindow(url) {
    var browser = window.open(url, '_blank', 'location=yes');
    console.log(JSON.stringify(oauth));

    browser.addEventListener('loadstart', (event) => {
        
      if (event.url.indexOf(callbackUrl) >= 0) {
        event.url.match(/oauth_verifier=([a-zA-Z0-9]+)/);
        localStorage.setItem(oauth, JSON.stringify(oauth))
        oauth.setVerifier(RegExp.$1);
        oauth.fetchAccessToken((data) => {
            oauth.getJSON('https://api.twitter.com/1.1/statuses/user_timeline.json?count=40', 
                (data) => {
                    analysis = analysisTimeLine(data);
                    document.querySelector('#navigator').pushPage('page2.html');
                    setTimeout(createPlanet,2000,analysis)
                },
                (data) => {
                  console.log(JSON.stringify(data));
                }
            );
            setTimeout(()=>browser.close(),2000)
        }, (data) => {
          console.log(JSON.stringify(data));
        });
      }
    });
}

function analysisTimeLine(data) {
    
    let autumnNum   = 0;
    let negativeNum = 0;
    let positiveNum = 0;
    let rainNum     = 0;
    let springNum   = 0;
    let summerNum   = 0;
    let winterNum   = 0;
    
    data.map(x => {
        autumn.map(  y => autumnNum   += x.text.split(y).length - 1);
        negative.map(y => negativeNum += x.text.split(y).length - 1);
        positive.map(y => positiveNum += x.text.split(y).length - 1);
        rain.map(    y => rainNum     += x.text.split(y).length - 1);
        spring.map(  y => springNum   += x.text.split(y).length - 1);
        summer.map(  y => summerNum   += x.text.split(y).length - 1);
        winter.map(  y => winterNum   += x.text.split(y).length - 1);
    })
    console.log(autumnNum)
    
    return {
        autumn  : autumnNum   != 0 ? autumnNum   / data.length : 0,
        negative: negativeNum != 0 ? negativeNum / data.length : 0,
        positive: positiveNum != 0 ? positiveNum / data.length : 0,
        rain    : rainNum     != 0 ? rainNum     / data.length : 0,
        spring  : springNum   != 0 ? springNum   / data.length : 0,
        summer  : summerNum   != 0 ? summerNum   / data.length : 0,
        winter  : winterNum   != 0 ? winterNum   / data.length : 0,
    }
}

// data 
/*
    {
        autumn  : autumnNum   / data.length,
        negative: negativeNum / data.length,
        positive: positiveNum / data.length,
        rain    : rainNum     / data.length,
        spring  : springNum   / data.length,
        summer  : summerNum   / data.length,
        winter  : winterNum   / data.length,
    }
*/

function createPlanet(analysis) {
    view =  document.getElementById("view-planet");

    let circleMap = [9,17,21,25,27,29,31,33,35,37,39,39,41,41,43,43,43,43,45,45,45,45,45,45,45,45,45,43,43,43,43,41,41,39,39,37,35,33,31,29,27,25,21,17,9];
    
    let block_num = 0;
    for (let n of circleMap) {
        block_num += n;
    }

    
    let coefficient    = analysis.autumn + analysis.summer + analysis.winter + analysis.spring;
    
    if (coefficient != 0) {
        let springPlatNum = block_num * analysis.spring / coefficient;
        let summerPlatNum = block_num * analysis.summer / coefficient;
        let autumnPlatNum = block_num * analysis.autumn / coefficient;
        let winterPlatNum = block_num * analysis.winter / coefficient;
        
        let platStyle = [];
        console.log("--")
        console.log("springPlatNum: "+ springPlatNum)
        for (let i = 0; i <= springPlatNum; i++) {
            platStyle.push("url(images/planet/spring_planet.png)");
        }
        console.log("summerPlatNum: "+ summerPlatNum)
        for (let i = 0; i <= summerPlatNum; i++) {
            platStyle.push("url(images/planet/summer_planet.png)");
        }        
        console.log("autumnPlatNum: "+ autumnPlatNum)
        for (let i = 0; i <= autumnPlatNum; i++) {
            platStyle.push("url(images/planet/autumn_planet.png)");
        }       
        console.log("winterPlatNum: "+ winterPlatNum)
        for (let i = 0; i <= winterPlatNum; i++) {
            platStyle.push("url(images/planet/winter_planet.png)");
        }
        console.log("--")
        
        shufflePlatStyle = platStyle.sort(() => Math.random()-.5)
        
        let cnt = 0;

        for (let n of circleMap) {
            let viewLayer = document.createElement("div");
            viewLayer.className = "view-layer";
            
                for (let i = 0; i < n; i++){
                    let element = document.createElement("div");
                    element.className = "view-layer-block";
                    element.style.backgroundImage = shufflePlatStyle[cnt]
                    viewLayer.appendChild(element);
                    cnt++;
                }
            view.appendChild(viewLayer);
        }
        
    } else {
        
        for (let n of circleMap) {
            let viewLayer = document.createElement("div");
            viewLayer.className = "view-layer";
            
            for (let i = 0; i < n; i++){
                let element = document.createElement("div");
                element.className = "view-layer-block";
                element.style.backgroundImage = "url(images/planet/spring_planet.png)"
                viewLayer.appendChild(element);
            }
            
            view.appendChild(viewLayer);
        }
        console.log("else")
    }
    
    view_block = Array.from(document.getElementsByClassName("view-layer-block"));
    v_height = parseInt(document.documentElement.clientWidth);
    view.style.height = v_height + "px";
    
    view_block.map(x => {
        x.style.height = v_height * 0.022 + "px";
        x.style.width = v_height * 0.022 + "px";
    });
    
    if(analysis.positive >= analysis.negative) {
        document.getElementById("background-weather").classList.add('sunny');
    } else {
        document.getElementById("background-weather").classList.add('rain');
    }

    
    let boy  = document.getElementById("boy");
    let girl = document.getElementById("girl");
        
    function movePeople(b) {
        b ? (boy.classList.add("boy1"),boy.classList.remove("boy2")) : (boy.classList.add("boy2"),boy.classList.remove("boy1"));
        b ? (girl.classList.add("girl1"),girl.classList.remove("girl2")) : (girl.classList.add("girl2"),girl.classList.remove("girl1"));

        setTimeout(movePeople,1000,!b)
    }
    movePeople(false)
    
    let arr = [analysis.autumn, analysis.summer, analysis.winter, analysis.spring];
    let maxIndex = arr.indexOf(Math.max.apply(null, arr));
    let wood = document.getElementById("season_wood");
    let wood2 = document.getElementById("season_wood2");
    let wood3 = document.getElementById("season_wood3");    
    let seasonName = document.getElementById("season_name");
    
    switch (maxIndex) {
        case 0:
            wood.classList.add("autumn_wood");
            wood2.classList.add("autumn_wood");
            wood3.classList.add("autumn_wood");
            [wood, wood2, wood3].map(w => {
                function loop(b) {
                    let deg = b ? 3 : -3
                    w.style.transform = "rotate(" + deg + "deg)";
                    setTimeout(loop, 3000, !b);
                }
                loop(true);
            })
            console.log("autumn");
            seasonName.innerText = "あなたの季節は秋模様"
            break;
        case 1:
            wood.classList.add("summer_wood");
            wood2.classList.add("summer_wood");
            wood3.classList.add("summer_wood");
            console.log("summer");
            seasonName.innerText = "あなたの季節は夏模様"
            break;
        case 2:
            wood.classList.add("winter_wood");
            wood2.classList.add("winter_wood");
            wood3.classList.add("winter_wood");
            console.log("winter");
            seasonName.innerText = "あなたの季節は冬模様"
            break;
        case 3:
            wood.classList.add("spring_wood");
            wood2.classList.add("spring_wood");
            wood3.classList.add("spring_wood");
            seasonName.innerText = "あなたの季節は春模様"
            break;
    }
    console.log("spring : ", analysis.spring);
    console.log("summer : ", analysis.summer);
    console.log("autumn : ", analysis.autumn);
    console.log("winter : ", analysis.winter);

    
    let rainyPercent = document.getElementById("rainy_percent");
    let humidity     = document.getElementById("humidity")
    rainyPercent.innerText = "降水確率 : " + parseInt(analysis.negative * 100)  + "%"
    humidity.innerText     = "気温 : " + parseInt(analysis.positive * 100)  + "℃"
}

function rotationPlanet() {
    view =  document.getElementById("view-planet");
    function loop(deg) {
        view.style.transform = "rotate("+deg+"deg)";
        setTimeout(loop, 3000, deg + 3);
    }
    loop(0);
}