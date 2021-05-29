/**
 * This Class contains functions to query terminologies from different terminology services
 * 
 * LICENSE-INFORMATION:
   --------------------
   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
class TerminologyQuery {
   constructor(domelem, spreadsheet) {
      var that = this; // We need "that" which is a copy of reference "this", because "this" will be the buttonElem if the buttonElem calls the function
      this.domelem = domelem;
      this.finalizeFunction = null;
      this.searchField = this.domelem.getElementsByClassName("name_inputCellValue")[0]; // DomElement of Search Field
      this.searchResultsField = this.domelem.getElementsByClassName("searchResults")[0]; // DomElement of Search Field

      // All HTML-Elements that have the Name cancelButton (here we have a list because Name does not need to be unique compared to id)
      for(var buttonElem of this.domelem.getElementsByClassName("cancelButton")) {
         buttonElem.onclick = function() { that.hide(); };
      }
      for(var buttonElem of this.domelem.getElementsByClassName("applyButton")) {
         buttonElem.addEventListener("click", function() { that.applyCurrentValue(); } );
      }
      for(var buttonElem of this.domelem.getElementsByClassName("terminologySearchButton")) {
         buttonElem.addEventListener("click", function() { that.searchTerminology(); } );
      }

      this.domelem.addEventListener("click", function(event) { that.hideClick(event); } );
      this.domelem.getElementsByClassName("name_inputCellValue")[0].addEventListener("keyup", function(event) {
         if (event.keyCode === 13) { // Number 13 is the "Enter" key on the keyboard
           event.preventDefault(); // Cancel the default action, if needed
           that.applyCurrentValue();
         }
      });
   }

   show(cellObj) {
      this.domelem.getElementsByClassName("loadingSpinner")[0].style.display = "none";

      this.domelem.style.display = "flex";
      this.searchField.value = cellObj.text;
      this.searchField.focus();
      this.searchField.setSelectionRange(0, this.searchField.value.length);
   }
   setFinalizeFunction(finalizeFunction) {
      this.finalizeFunction = finalizeFunction;
   }
   applyCurrentValue() {
      if(this.finalizeFunction != null) {
         this.finalizeFunction(
            this.domelem.getElementsByClassName("name_inputCellValue")[0].value,
            null
         );
      }
      this.hide();
   }
   applyTerminology() {
      if(this.finalizeFunction != null) {
         this.finalizeFunction(
            "Hello", // TODO: Keyword here
            { url : "fancy.url" } // Terminology JSON here
         );
      }
   }
   /**  **/
   searchTerminology() {
      var that = this;
      // TODO:
      this.text = this.domelem.getElementsByClassName("loadingSpinner")[0].style.display = "flex";
      // alert("https://terminologies.gfbio.org/api/terminologies/search?query="+ this.searchField.value  +"&match_type=exact&first_hit=false&format=json&internal_only=false");
   
      var xhttpSearchReq = new XMLHttpRequest();
      xhttpSearchReq.onreadystatechange = function () {
         // alert(that.xhttpSearchReq.responseText);
         if (this.readyState == 4 && this.status == 200) {
            //alert(that.searchField.value);
            // var responseText=this.responseText;
            // alert(responseText);
            var responseObj = JSON.parse(this.responseText);
            // responseObj.results.length.label
            that.domelem.getElementsByClassName("loadingSpinner")[0].style.display = "none";
            
            that.searchResultsField.innerHTML = "";
            for(var result of responseObj.results) {
               // that.searchResultsField.innerHTML += "<tr><td>"+result.label+"</td><td>von hier</td><td>Button</td></tr>";
               var resultLine = document.createElement("tr");
               that.searchResultsField.appendChild(resultLine);
               
               var tdElem = document.createElement("td");
               tdElem.innerHTML = result.label;
               resultLine.appendChild(tdElem);
               
               tdElem = document.createElement("td");
               tdElem.innerHTML = result.sourceTerminology;
               resultLine.appendChild(tdElem);

               tdElem = document.createElement("td");
               var buttonElem = document.createElement("button");
               buttonElem.type = "button";
               buttonElem.classList.add("btn");
               buttonElem.classList.add("btn-success");
               buttonElem.classList.add("btn-sm");
               buttonElem.innerHTML = "<svg class='bi' width='16' height='16' fill='currentColor'><use href='widgets/icons/bootstrap-icons.svg#caret-right'></use></svg><span class='d-none d-md-inline'>apply</span>";
               //buttonElem.addEventListener("click", function() { alert( "Clicked on "+result.label ); })
               buttonElem.addEventListener("click", function() { spreadsheet.setCellValueToSelectedCells(result.label,result); })

               tdElem.appendChild(buttonElem);
               resultLine.appendChild(tdElem);


            }
         }
      }
      // this.xhttpSearchReq.open("GET", "https://terminologies.gfbio.org/api/terminologies/search?query="+String(this.searchField.value), true);
      xhttpSearchReq.open("GET", "https://terminologies.gfbio.org/api/terminologies/search?query="+String(that.searchField.value), true);
      xhttpSearchReq.send();
   }

   hide() {
      this.domelem.style.display = "none";
   }
   hideClick(event) {
      if(this.domelem === event.target) {
         this.hide();
      }
   }
}