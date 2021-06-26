/* LICENSE-INFORMATION:
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

/**
 * The class TerminologyQuery contains methods to raise a HTML-Dialog where you can enter text
 * to write to a Spreadsheet-Cell (contained in spreadsheet-Class) or search for a specific
 * terminology you can apply to the cell.
 * 
 * This class has methods to perform XML-HTTP-Requests with server that offer a JSON-based API
 * for a terminology-search-service.
 */
class TerminologyQuery {
   /**
    * @param {HTML-Object} domelem - The parent HTML-Element of the Search-Dialog inside index.html
    * @param {Spreadsheet-Instance} spreadsheet
    */
   constructor(domelem, spreadsheet) {
      // List that describes API's where we can query terminology (each element is one available Query-API option)
      this.QUERY_APIS = [];
      this.QUERY_APIS_BACKUP = "[]"; // The default APIs that are recieved as JSON-String once from our server

      var that = this; // We need "that" which is a copy of reference "this", because "this" will be the buttonElem if the buttonElem calls the function (JavaScript-Hack you will found everywhere)
      this.domelem = domelem;
      this.finalizeFunction = null; // Method that is called to apply a terminology or text to a cell in the spreadsheet
      this.searchField = this.domelem.getElementsByClassName("name_inputCellValue")[0]; // DomElement of Search Field
      this.searchResultsField = this.domelem.getElementsByClassName("searchResults")[0]; // DomElement of Search Field
      this.spreadsheetRef = spreadsheet;
      this.queryAPISField = this.domelem.getElementsByClassName("queryAPIsJSONField")[0]; // DomElement of Search Field

      // Assign event functions to the buttons in terminologyQuery-dialog
      // E.g. all HTML-Elements that have the Name cancelButton will act als cancel-button (here we have a list because Name does not need to be unique compared to id)
      for(var buttonElem of this.domelem.getElementsByClassName("cancelButton")) {
         buttonElem.onclick = function() { that.hide(); };
      }
      for(var buttonElem of this.domelem.getElementsByClassName("applyButton")) {
         buttonElem.addEventListener("click", function() { that.applyCurrentValue(); } );
      }
      for(var buttonElem of this.domelem.getElementsByClassName("terminologySearchButton")) {
         buttonElem.addEventListener("click", function() { that.searchTerminology(); } );
      }
      for(var buttonElem of this.domelem.getElementsByClassName("restoreQueryAPIsButton")) {
         buttonElem.addEventListener("click", function() { that.resetQueryAPIs(); } );
      }
      for(var buttonElem of this.domelem.getElementsByClassName("applyQueryAPIsButton")) {
         buttonElem.addEventListener("click", function() { that.applyQueryAPIs(); } );
      }

      // Clicking outside of the dialog will hide the Dialog
      this.domelem.addEventListener("click", function(event) { that.hideClick(event); } );

      // Load the default Query APIs
      this.loadDefaultQueryAPIs();
   }

   /**
    * reset the Query APIs to the default that was once recieved from widgets/terminologyQuery/defaultQueryAPIs.json directly when the page was loaded
    */
   resetQueryAPIs() {
      this.queryAPISField.value = this.QUERY_APIS_BACKUP;
      this.applyQueryAPIs();
   }

   /**
    * try to parse and apply to temporarly and locally in the terminologyQuery-Dialog
    * specified Query-APIs.
    * If the JSON-Syntax is invalide this method will alert(); the user and leave
    * the settings as they where before.
    */
   applyQueryAPIs() {
      var jsontext = this.queryAPISField.value;
      try {
         var jdict = JSON.parse(jsontext);
         this.QUERY_APIS = jdict;
         var queryModeElem = this.domelem.getElementsByClassName("queryMode")[0];

         // After sucessfully parsing the JSON-Settings for the Query-APIs we need to write the selectable options to the HTML-Dialog
         var txtInnerHTML = "";
         for(var i=0; i<this.QUERY_APIS.length; i++) {
            txtInnerHTML += "<option value=\""+String(i)+"\"";
            if(i == 0) {
               txtInnerHTML += " selected=\"\"";
            }
            txtInnerHTML += ">";
            if("name" in this.QUERY_APIS[i]) {
               txtInnerHTML += this.QUERY_APIS[i].name;
            } else {
               txtInnerHTML += "unknown option "+String(i);
            }
            txtInnerHTML += "</option>";
         }
         queryModeElem.innerHTML = txtInnerHTML;
      } catch {
         alert("Syntax Error in QueryAPIs JSON-Code :-/.\nSettings remain unchanged.");
      }
   }

   /**
    * on page load at the beginning we once load the JSON-Default-Settings of the Query-APIs from
    * widgets/terminologyQuery/defaultQueryAPIs.json
    * via SYNCRONOUS-XML-Request
    * (JavaScript waits until the data is recieved !)
    */
   loadDefaultQueryAPIs() {
      var that = this;
      var xhttpSearchReq = new XMLHttpRequest();
      xhttpSearchReq.onreadystatechange = function () {
         if (this.readyState == 4 && this.status == 200) {
            that.QUERY_APIS_BACKUP = this.responseText;
            that.resetQueryAPIs();
         }
      }
      xhttpSearchReq.open("GET", "/widgets/terminologyQuery/defaultQueryAPIs.json", false);
      xhttpSearchReq.send();
   }

   /**
    * Show this Dialog where the user can enter text to directly write to the cell or search for terminologies
    * @param {SpreadsheetCell} cellObj - Reference to the cell where the user double clicked (or pressed F2)
    */
   show(cellObj) {
      this.domelem.getElementsByClassName("loadingSpinner")[0].style.display = "none";

      this.domelem.style.display = "flex";
      this.searchField.value = cellObj.text;
      this.searchField.focus();
      this.searchField.setSelectionRange(0, this.searchField.value.length);

      this.domelem.getElementsByClassName("cellInfoContainer")[0].innerHTML = JSON.stringify(cellObj.info,null,2).replaceAll("\n","<br>");
   }
   /**
    * Once in main.js you set a event-function/finalizeFunction that should be called when
    * the user wants to apply text or a searched terminology.
    * The function must be able to take two parameters:
    * finalizeFunction(cellText, cellInfoObject)
    *    cellText is a string that will be visible and the text for the cell
    *    cellInfoObject can be "null" or any object that describes additional Cell-Info you want to store in background and that is not visible but can be exported
    * 
    * @param {event-function} finalizeFunction
    */
   setFinalizeFunction(finalizeFunction) {
      this.finalizeFunction = finalizeFunction;
   }

   /**
    * applies the currently written text from the dialog directly to the cell.
    * Here no terminology search will be performed and this is used for free user input
    */
   applyCurrentValue() {
      if(this.finalizeFunction != null) {
         this.finalizeFunction(
            this.domelem.getElementsByClassName("name_inputCellValue")[0].value,
            null
         );
      }
      this.hide();
   }

   /**
    * Search for a terminology with the name that the user entered to the dialog
    * Automatically performs an XML-Request to the server with the terminology-service API
    * When asynchroneously recieved a response from the terminology-service the loading-spinner
    * dissapears and the results become visible in this dialog in a table where you can select them
    * and apply them to the cell if you want.
    */
   searchTerminology() {
      var that = this;
      this.text = this.domelem.getElementsByClassName("loadingSpinner")[0].style.display = "flex";

      var currentQueryAPI_index = parseInt(this.domelem.getElementsByClassName("queryMode")[0].value);
      var currentQueryAPI = JSON.parse(JSON.stringify(this.QUERY_APIS[currentQueryAPI_index]));
      if(!("label" in currentQueryAPI)) {
         currentQueryAPI.label = "label";
      }
      if(!("apiURL" in currentQueryAPI)) {
         currentQueryAPI.apiURL = "https://terminologies.gfbio.org/api/terminologies/suggest?query={{searchTerm}}&limit=30";
      }
   
      that.searchResultsField.innerHTML = "";
      var xhttpSearchReq = new XMLHttpRequest();
      
      // Set Function that is called to process recieved API-Response after asynchronous recieving data as event
      xhttpSearchReq.onreadystatechange = function () {
         if (this.readyState == 4 && this.status == 200) {
            var responseList = JSON.parse(this.responseText);
            if("results" in currentQueryAPI && currentQueryAPI["results"] != "") {
               responseList = responseList[currentQueryAPI["results"]];
            }
            that.domelem.getElementsByClassName("loadingSpinner")[0].style.display = "none";
            that.searchResultsField.innerHTML = "";
            // Process each result and write an entry to the dialog
            for(var result of responseList) {
               var resultLine = document.createElement("tr");
               that.searchResultsField.appendChild(resultLine);
               
               var tdElem = document.createElement("td");
               tdElem.innerHTML = result[currentQueryAPI.label];
               resultLine.appendChild(tdElem);
               
               tdElem = document.createElement("td");
               if("source" in currentQueryAPI) {
                  tdElem.innerHTML = result[currentQueryAPI.source];
               } else {
                  tdElem.innerHTML = "";
               }
               resultLine.appendChild(tdElem);

               tdElem = document.createElement("td");

               var buttonElem = document.createElement("button");
               buttonElem.type = "button";
               buttonElem.classList.add("btn");
               buttonElem.classList.add("btn-outline-primary");
               buttonElem.classList.add("btn-sm");
               buttonElem.style.marginRight = "10px";
               buttonElem.innerHTML = "<svg class='bi' width='16' height='16' fill='currentColor'><use href='widgets/icons/bootstrap-icons.svg#info-circle'></use></svg><span class='d-none d-md-inline'>info</span>";
               buttonElem.addEventListener("click", that.searchResultInfoEventGenerator(result));
               tdElem.appendChild(buttonElem);
               
               var buttonElem = document.createElement("button");
               buttonElem.type = "button";
               buttonElem.classList.add("btn");
               buttonElem.classList.add("btn-success");
               buttonElem.classList.add("btn-sm");
               buttonElem.innerHTML = "<svg class='bi' width='16' height='16' fill='currentColor'><use href='widgets/icons/bootstrap-icons.svg#caret-right'></use></svg><span class='d-none d-md-inline'>apply</span>";
               buttonElem.addEventListener("click", that.searchResultApplyEventGenerator(result[currentQueryAPI.label],result));
               tdElem.appendChild(buttonElem);

               resultLine.appendChild(tdElem);
            }
         }
      }

      // Send API-Request
      var getURL = currentQueryAPI.apiURL.replaceAll("{{searchTerm}}", String(that.searchField.value));
      xhttpSearchReq.open("GET", getURL, true);
      xhttpSearchReq.send();
   }

   /**
    * Generates an event function that can be assigned to a button-event and will be called if you e.g. click on it.
    * This method will show a terminology search result as JSON-string
    * @param {any object} result - a terminology that is a search result
    * @returns the event function
    */
   searchResultInfoEventGenerator(result) {
      return function() {
         alert(JSON.stringify(result,null,2));
      }
   }
   /**
    * Generates an event function that can be assigned to a button-event and will be called if you e.g. click on it.
    * This method will apply the terminology to the currently selected cell(s) by calling the finalizeFunction
    * @param {string} resultLabel - the text/name of the terminology that should be visible in the cell
    * @param {any object} resultJSON - the additional information that will be stored in the cell
    * @returns the event function
    */
   searchResultApplyEventGenerator(resultLabel, resultJSON) {
      var that = this;
      return function() {
         that.finalizeFunction(resultLabel,resultJSON);
         that.hide();
      }
   }

   /**
    * hides the current dialog so it will not be visible as overlay any more
    */
   hide() {
      this.domelem.style.display = "none";
   }
   /**
    * When clicking outside the main dialog on the parent div that grays out the background
    * this method should be called instead of hide() because this method will check if we clicked
    * on the background div-Element or maybe just some button in the dialog that should not close this dialog
    * @param {event-object} event - click event
    */
   hideClick(event) {
      if(this.domelem === event.target) {
         this.hide();
      }
   }
   /**
    * @returns true/false if this dialog is currently visible as overlay
    */
   isActive() {
      if (this.domelem.style.display == "none") {
         return false;
      } else {
         return true;
      }
   }

   /**
    * Has to be used in the global key-Event-Handler in main.js
    * If this dialog is visible you can call this method with the current key event
    * to enable the ability to control things in this dialog with your keyboard
    * @param {event-object} event - key press event
    */
   keyEventHandler(event) {
      if (event.keyCode === 27) { //event.preventDefault(); // "Esc"   (Cancel the default action, if needed)
         this.hide();
      } else if (event.keyCode === 13) { // event.preventDefault(); // "Enter"   (Cancel the default action, if needed)
         if(event.shiftKey) {
            this.searchTerminology();
         } else {
            if(document.activeElement === this.searchField) { // only Enter = Apply current if we currently type into search Field
               this.applyCurrentValue();
            }
         }
      }
   }
}