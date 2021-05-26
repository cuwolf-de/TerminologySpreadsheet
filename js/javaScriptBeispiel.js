var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      document.getElementById("jsonresult").innerHTML = xhttp.responseText;
   }
};
xhttp.open("GET", "https://terminologies.gfbio.org/api/terminologies/search?query=Aacter", true);
xhttp.send();