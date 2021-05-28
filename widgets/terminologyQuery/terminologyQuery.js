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
   constructor(domelem) {
      var that = this; // We need "that" which is a copy of reference "this", because "this" will be the buttonElem if the buttonElem calls the function
      this.domelem = domelem;

      // All HTML-Elements that have the Name cancelButton (here we have a list because Name does not need to be unique compared to id)
      for(var buttonElem of this.domelem.getElementsByClassName("cancelButton")) {
         buttonElem.onclick = function() { that.hide(); };
      }
      for(var buttonElem of this.domelem.getElementsByClassName("applyButton")) {
         buttonElem.addEventListener("click", function() { that.applyCurrentValue(); } );
      }

      this.domelem.addEventListener("click", function(event) { that.hideClick(event); } );
      this.currentCellObj = null;
   }

   show(cellObj) {
      this.currentCellObj = cellObj; // Remeber current cell object that maybe will be edited by this dialog

      this.domelem.style.display = "flex";
      var inputCellValue = this.domelem.getElementsByClassName("name_inputCellValue")[0];
      inputCellValue.focus();

      inputCellValue.value = cellObj.text;
   }
   applyCurrentValue() {
      this.currentCellObj.text = this.domelem.getElementsByClassName("name_inputCellValue")[0].value;
      this.currentCellObj.info = null;
      this.currentCellObj.update();
   }
   searchTerminology() {
      // TODO:
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