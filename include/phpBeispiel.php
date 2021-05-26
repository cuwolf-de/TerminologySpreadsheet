<?php
   if( isset($_GET["frage"]) == 1 ) {
      print("Das ist eine schwierige Frage: ");
      print($_GET["frage"]);
   } else {
      print("keine Frage gestellt :-).<br>Sie können eine Frage stellen indem Sie ?frage=FRAGE an die URL anh&auml;ngen.<br>");
   }
?>