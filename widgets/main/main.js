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


// Show or hide About-Tab
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


// Some tests:
spreadsheet.setCellValue(2,2,"Name",null);
spreadsheet.setCellValue(2,3,"Location X",null);
spreadsheet.setCellValue(2,4,"Location Y",null);
spreadsheet.setCellValue(2,2,"Spezies",null);

spreadsheet.setCellValue(3,2,"Unser Projekt",null);
spreadsheet.setCellValue(3,3,"42",null);
spreadsheet.setCellValue(3,4,"100",null);
spreadsheet.setCellValue(3,2,"Homo Sapiens",{ url : "gfbio.org" });