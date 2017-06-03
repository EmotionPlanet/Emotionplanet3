// This is a JavaScript file

var callbackUrl = "https://www.google.com";

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
    console.log("Opening Request Token URL: " + url);
    showAuthWindow(url);
  }, (data) => {
    console.log(JSON.stringify(data));
  });
}

// Display Twitter authentication page.
// When the user logs in, obtain a verifier and get Access Token
function showAuthWindow(url) {
    var browser = window.open(url, '_blank', 'location=yes');
    
    browser.addEventListener('loadstart', (event) => {
        
      if (event.url.indexOf(callbackUrl) >= 0) {
        event.url.match(/oauth_verifier=([a-zA-Z0-9]+)/);
        oauth.setVerifier(RegExp.$1);
        console.log(oauth);
        oauth.fetchAccessToken((data) => {
            oauth.getJSON('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=monaca_io&count=20', 
                (data) => {
                    analysisTimeLine(data);
                    document.querySelector('#navigator').pushPage('page2.html');
                },
                (data) => {
                  console.log(JSON.stringify(data));
                }
            );
            browser.close();
        }, (data) => {
          console.log(JSON.stringify(data));
        });
      }
    });
}

function analysisTimeLine(data) {
    data.map(x => {
        console.log(x.text);
    })
}

document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.matches('#first-page')) {
    // page.querySelector('#push-button').onclick = function() {
    //   document.querySelector('#navigator').pushPage('page2.html');
    // };
  } else if (page.matches('#second-page')) {
    page.querySelector('#pop-button').onclick = function() {
      document.querySelector('#navigator').popPage();
    };
  }
});