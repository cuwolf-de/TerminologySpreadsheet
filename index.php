<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">

    <title>MOSD-Projekt</title>
  </head>
  <body>
    <div id="mainID" class="p-4 bg-success">
      <h1>Webserver l&auml;uft</h1>
      Hallo sehr geehrte Besucher
      <br>
      Wenn der Hintergrund hiervon gr&uuml;n ist, dann ist JavaScript unterst&uuml;tzt.
      <br>
    </div>

    hier ist der admin
    
    <?php include "include/phpBeispiel.php" ?>

    <br><br>
    <div id="jsonresult">

    </div>

    <!-- JavaScript-Scripts -->
    <script src="/js/javaScriptBeispiel.js"></script>

    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossorigin="anonymous"></script>
  </body>
</html>