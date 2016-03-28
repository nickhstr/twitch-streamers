// Array of twitch usernames
var usernames = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "brunofin", "comster404"];

function urlMaker(type, name) {
  // Use of function abstracts and makes things reusable. A callback is included due to cross-origin resource sharing (CORS), and we'll use JSONP.
  return 'https://api.twitch.tv/kraken/' + type + '/' + name + '?callback=?';
};

// Let's keep the ajax request wrapped in a function, separated from $(document).ready
function ajaxFunc() {
  usernames.forEach(function(channel) {
    $.getJSON(urlMaker("streams", channel), function(data) {
      var game,
        status;
      if (data.stream === null) {
        game = "Offline";
        status = "offline";
      } else if (data.stream === undefined) {
        game = "Account Removed";
        status = "offline";
      } else {
        game = data.stream.game;
        status = "online";
      };
      $.getJSON(urlMaker("channels", channel), function(data) {
        // Conditional ternary operator for logo
        var logo = data.logo != null ? data.logo : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png",
          // Conditional ternary operator for name
          name = data.display_name != null ? data.display_name : channel,
          // Conditional ternary operator for description
          description = status === "online" ? ': ' + data.status : "";
        var html = '<div class="row ' +
          status + '"><div class="col-xs-4"><img src="' +
          logo + '" class="logo"></div><div class="col-xs-8 name"><a href="' +
          data.url + '" target="_blank">' +
          name + '</a></div><div class="col-xs-8 streaming">' +
          game + '<span class="description">' +
          description + '</span></div></div>';
        status === "online" ? $(".display").prepend(html) : $(".users").append(html);
      });
    });
  });
};

$(document).ready(function() {
  ajaxFunc();
  $(".selector").click(function() {
    $(".selector").removeClass("active");
    $(this).addClass("active");
    var status = $(this).attr('id');
    if (status === "all") {
      $(".online, .offline").removeClass("hidden");
    } else if (status === "online") {
      $(".online").removeClass("hidden");
      $(".offline").addClass("hidden");
    } else {
      $(".offline").removeClass("hidden");
      $(".online").addClass("hidden");
    }
  })
});