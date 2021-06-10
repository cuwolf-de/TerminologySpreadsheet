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

terminologyQuery = new TerminologyQuery(
   document.getElementById("terminologyQuery")
);

spreadsheet = new Spreadsheet(
   document.getElementById("spreadsheet"),
   100,
   30,
   function(cellObj) { terminologyQuery.show(cellObj); }
);

terminologyQuery.setFinalizeFunction( function(text,info) { spreadsheet.setCellValueToSelectedCells(text,info); })


document.addEventListener("keydown", function(e) { spreadsheet.keyEventHandler(e); } );

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