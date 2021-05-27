/**
 * A Cell that can be used in a specific row and column of a Spreadsheet
 * The Cell object will remember the text that is displayed in the cell
 * and if the cell text is a searched terminology the cell will remember
 * the url and further information that corresponds to the terminology term.
 * This might be useful for later export, so we can add columns behind each cell that
 * contains further terminology information
 */
class SpreadsheetCell {
   constructor(domelem) {
      this.domelem = domelem;
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
            if(r > 0 && c > 0) {
               td.onclick = this.onCellClickEvent;
            }
            tr.appendChild(td);

            var cell = new SpreadsheetCell(td);
            this.cells[r].push(cell);
         }
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