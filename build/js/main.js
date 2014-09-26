
  data = data.filter(function(arg){return (arg.search(".json")!= -1)})
  processedData = {}

var page = {number : 0}
var width = $(window).width();

page.watch("number", function(id, oldval, newval){


  var offset = -1 * (newval) * ($("#container").width());

    $(".active").toggleClass("active")
    $($("#inner").children()[newval+1]).toggleClass("active")

    $("#name").text(processedData[data[newval]].titulo)


    $.adaptiveBackground.run(
    {
    selector:             '.card.active .card_image img',
    parent:               '.card_overlay',
    success: function($img, data){
      $('#paginator, .card.active .card_overlay').css({"background-color": data.color});
      $("#inner").velocity({left: offset}, 700, function(){
        $(".active").velocity("scroll", {container: $("#inner")});
    });
      }
    });
    return newval;
});




$(document).ready(function(){


  var template = $('#template').html();
  Mustache.parse(template);

    var first = true;

  data.forEach(function(file){
    if (file.search(".json") == -1)
      return;

    $.ajax({url: "dados/"+file, success: function(dat){
      if (typeof dat != "object")
      dat = JSON.parse(dat);
      processedData[file] = dat;
    if (first) {dat.active = true; first = false;}
    var rendered = Mustache.render(template, dat);

    $('#inner').append(rendered);

    }, async: false});

  });

  $("#name").text(processedData[data[0]].titulo)


  $("#right").click(function(){
    if (page["number"]+1 === data.length)
      return;
    page["number"]++

  })

  $("#left").click(function(){
    if (page["number"] == 0)
      return;

    page["number"]--
    })

  $('.card .card_image img').on('ab-color-found', function(ev,payload){



});
  $('#container img')
    .wrap('<span style="display:inline-block"></span>')
    .css('display', 'block')
    .parent()
    .zoom();

  $.adaptiveBackground.run(
  {
  selector:             '.card.active .card_image img',
  parent:               '.card_overlay',
  success: function($img, data){
      $('#paginator, .card.active .card_overlay').css("background", data.color);
      $("#body").velocity({opacity: "1"}, 500)

    }
  });


});
