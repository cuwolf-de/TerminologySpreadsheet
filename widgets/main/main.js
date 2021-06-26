/*
   Main JavaScript for the Terminology Spreadsheet Web Application

   LICENSE-INFORMATION:
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

// Create the Object for the terminologyQuery-Dialog
terminologyQuery = new TerminologyQuery(
   document.getElementById("terminologyQuery")
);

// Create a new Spreadsheet-Object that displays the data and interacts with the user
spreadsheet = new Spreadsheet(
   document.getElementById("spreadsheet"),
   100,
   30,
   function(cellObj) { terminologyQuery.show(cellObj); }
);

// tell the terminologyDialog which function to call when the user wrote text that needs to be applied to a cell in the spreadsheet
terminologyQuery.setFinalizeFunction( function(text,info) { spreadsheet.setCellValueToSelectedCells(text,info); })

// Button Events for "uploading" a file to your webbrowser so you can edit this data in the spreadsheet
document.getElementById("loadFromJsonFileInput").addEventListener("change", function(e) { spreadsheet.importJSONFile(e); } , false);
document.getElementById("loadFromCSVFileInput").addEventListener("change", function(e) { spreadsheet.importCSVFile(e); } , false);
document.getElementById("loadFromCSVTermFileInput").addEventListener("change", function(e) { spreadsheet.importCSVTermFile(e); } , false);

// Global Key-Event Handler that forwards the event to the spreadsheet or the terminologyQuery if the dialog is shown
document.addEventListener("keydown", function(e) {
   if(terminologyQuery.isActive()) {
      terminologyQuery.keyEventHandler(e);
   } else {
      spreadsheet.keyEventHandler(e);
   }
} );

// ======================================== Show or hide About-Tab
function showAboutTab() {
   document.getElementById("aboutTab").style.display = "flex";
}
function hideAboutTab() {
   document.getElementById("aboutTab").style.display = "none";
}
function hideClickAboutTab(event) {
   if(document.getElementById("aboutTab") === event.target) {
      hideAboutTab();
   }
}
document.getElementById("aboutTab").addEventListener("click", hideClickAboutTab );

// ======================================== Show or hide Help-Tab
function showHelpTab() {
   document.getElementById("helpTab").style.display = "flex";
}
function hideHelpTab() {
   document.getElementById("helpTab").style.display = "none";
}
function hideClickHelpTab(event) {
   if(document.getElementById("helpTab") === event.target) {
      hideHelpTab();
   }
}
document.getElementById("helpTab").addEventListener("click", hideClickAboutTab );