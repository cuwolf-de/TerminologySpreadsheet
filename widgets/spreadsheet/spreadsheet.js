/**
 * A Cell that can be used in a specific row and column of a Spreadsheet
 * The Cell object will remember the text that is displayed in the cell
 * and if the cell text is a searched terminology the cell will remember
 * the url and further information that corresponds to the terminology term.
 * This might be useful for later export, so we can add columns behind each cell that
 * contains further terminology information
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
class SpreadsheetCell {
   constructor(domelem) {
      this.domelem = domelem;
      this.info = null;
      this.text = "";
   }

   update() {
      this.domelem.innerHTML = escapeHtml(this.text);
      if(this.text == "") {
         this.domelem.style.backgroundColor = "#ffffff";
      } else {
         if(this.info == null) {
            this.domelem.style.backgroundColor = "rgb(250, 250, 250)";
         } else {
            this.domelem.style.backgroundColor = "rgb(210, 255, 210)";
         }
      }
   }
}

/**
 * The Main Object that organizes the Spreadsheet and its cells
 */
class Spreadsheet {
   constructor(domelem, rows, cols, onCellClickEvent) {
      this.domelem = domelem;
      this.table = null;
      this.tbody = null;
      this.rows = rows;
      this.cols = cols;
      this.onCellClickEvent = onCellClickEvent;

      this.reset();
   }

   reset() {
      var that = this;
      // Clear HTML-Code and Elements in main domelement where we have access to write our table
      this.domelem.innerHTML = "";
      
      // Create basic HTML-Table-Structure
      this.table = document.createElement("table");
      this.table.classList.add("spreadsheet-table");
      this.tbody = document.createElement("tbody");
      this.table.appendChild(this.tbody);
      this.domelem.appendChild(this.table);

      // Create first cells (rows and columns)
      this.cells = [];
      for(var r=0; r<this.rows+1; r++) {
         this.cells.push([]);
         var tr = document.createElement("tr");
         this.tbody.appendChild(tr);

         for(var c=0; c<this.cols+1; c++) {
            var td = document.createElement("td");
            if(r == 0 && c == 0) {
               td.classList.add("table-header-corner");
               td.innerHTML = "<svg class=\"bi\" width=\"16\" height=\"16\" fill=\"currentColor\"><use href=\"widgets/icons/bootstrap-icons.svg#list\"></use></svg>";
            }
            if(c == 0) {
               td.classList.add("table-header-left");
               td.classList.add("table-sticky-left");
               if(r > 0) {
                  td.innerHTML = String(r);
               }
            }
            if(r == 0) {
               td.classList.add("table-header-top");
               td.classList.add("table-sticky-top");
               if(c > 0) {
                  td.innerHTML = this.num2Alphabet(c);
               }
            }

            let cell = new SpreadsheetCell(td); // NOTE: IMPORTANT that we have "let" and not "var" here because we want to pass the reference of the new cell everywhere and not a copy of the current cell state !!!
            this.cells[r].push(cell);

            if(r > 0 && c > 0) {
               td.addEventListener("click", function() { that.onCellClickEvent(cell); } );
            }
            tr.appendChild(td);
         }
      }
   }

   /**
    * 
    * @param {Cell Index starting at 1 (not 0)} x 
    * @param {Cell Index starting at 1 (not 0)} y 
    * @param {Text that you want to write to the cell} text 
    * @param {Additional JSON-Dict that can optionally set that will be stored but not displayed} info 
    */
   setCellValue(x, y, text, info) {
      if(y > 0 && y <= this.cells.length && x > 0 && x <= this.cells[0].length) {
         this.cells[y][x].text = text;
         this.cells[y][x].info = info;
         this.cells[y][x].update();
      } else {
         alert("Error : you accessed a Cell index outside the spreadsheet");
      }
   }

   num2Alphabet(num) {
      num -= 1;
      var txt = "";
      while(num >= 26) {
         var rest = num%26;
         txt = String.fromCharCode(65 + rest) + txt;
         num = num / 26;
         num -= 1;
      }
      txt = String.fromCharCode(65 + num) + txt;
      return txt;
   }
}