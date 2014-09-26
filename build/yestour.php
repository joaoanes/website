
<!DOCTYPE html>
  <!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
  <!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
  <!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
  <!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
  <head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title></title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/main.css">
  <script src="js/vendor/modernizr-2.6.2.min.js"></script>
  <link href='//fonts.googleapis.com/css?family=Raleway:400,700' rel='stylesheet prefetch' type='text/css'data-noprefix>
  <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
  </head>
  <body id="body">
  <script>
  var data =
  <?php echo ( json_encode(scandir("./dados")));?>
  </script>
  <div id="container">

  <div class="card_background"></div>
  <div id="inner">
  <script id="template" type="x-tmpl-mustache">
  <div class="card {{#active}}active{{/active}}">
  <div class="card_overlay"></div>
  <div class="card_image"><img src="dados/{{img}}" width="100%" height="100%" class="card_image_img"></img><div class="touch_helper"><div><i class="fa fa-inverse fa-2x fa-arrow-down"></i></div>Press and hold!</div></div>

  <div class="card_text_container">
  <div class="card_text">
  <div class="card_text_header">{{titulo}}</div>
  {{texto}}
  </div>
    </div>
  </div>
  </script>

  </div>
  </div>
  <div id="paginator">
  <div id="left"><i class="fa fa-3x fa-inverse fa-arrow-circle-left"></i></div>
  <div id="right"><i class="fa fa-3x fa-inverse fa-arrow-circle-right"></i></div>
  <div id="name"></div>
  </div>

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.2.min.js"><\/script>')</script>
  <script src="js/jquery.adaptive-backgrounds.js"></script>

  <script src="js/jquery.zoom.min.js"></script>
  <script src="js/mustache.js"></script>
      <script src="js/velocity.js"></script>

  <script src="js/watch.js"></script>

  <script src="js/plugins.js"></script>
  <script src="js/main.js"></script>


  </body>
  </html>
