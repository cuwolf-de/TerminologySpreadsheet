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
      this.domelem.innerHTML = "<div class='spreadsheet-table-td-inner'>" + escapeHtml(this.text) + "&nbsp;</div>";
      if(this.text == "") {
         this.domelem.style.backgroundColor = "#ffffff";
      } else {
         if(this.info == null) {
            this.domelem.style.backgroundColor = ""; // "rgb(245, 245, 245)";
         } else {
            this.domelem.style.backgroundColor = "rgb(255, 255, 200)";
         }
      }
   }
}

/**
 * The Main Object that organizes the Spreadsheet and its cells
 * NOTE: Editable Rows and Columns start at Index 1 because Index 0 are the gray letters A,B,C,... or 1,2,3,...
 */
class Spreadsheet {
   constructor(domelem, rows, cols, onCellClickEvent) {
      this.domelem = domelem;
      this.table = null;
      this.tbody = null;
      this.rows = rows;
      this.cols = cols;
      this.onCellClickEvent = onCellClickEvent;
      this.selection = [[2,2],[2,2]]; // In Format [[rowStart,colStart],[rowEnd,colEnd]] inclusive Start and End
      this.selecting = false; // will become true on mousedown-Event and will get false on mouseUp again

      this.reset();
   }

   createNewSpreadsheet(rows, cols) {
      this.rows = rows;
      this.cols = cols;
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
               td.innerHTML = "<div class='spreadsheet-table-td-inner'><svg class=\"bi\" width=\"16\" height=\"16\" fill=\"currentColor\"><use href=\"widgets/icons/bootstrap-icons.svg#list\"></use></svg></div>";
            }
            if(c == 0) {
               td.classList.add("table-header-left");
               td.classList.add("table-sticky-left");
               if(r > 0) {
                  td.innerHTML = "<div class='spreadsheet-table-td-inner'>" + String(r) + "</div>";
               }
            }
            if(r == 0) {
               td.classList.add("table-header-top");
               td.classList.add("table-sticky-top");
               if(c > 0) {
                  td.innerHTML = "<div class='spreadsheet-table-td-inner'>" + this.num2Alphabet(c) + "</div>";
               }
            }

            let cell = new SpreadsheetCell(td); // NOTE: IMPORTANT that we have "let" and not "var" here because we want to pass the reference of the new cell everywhere and not a copy of the current cell state !!!
            this.cells[r].push(cell);

            if(r > 0 && c > 0) {
               td.innerHTML = "<div class='spreadsheet-table-td-inner'>" + "&nbsp;" + "</div>";
               td.classList.add("cellText");

               td.addEventListener("dblclick", function() { that.onCellClickEvent(cell); });
               td.addEventListener("mousedown", this.selectEventStartGenerator(r,c) );
               td.addEventListener("mouseenter", this.selectEventUpdateGenerator(r,c) );
               td.addEventListener("mouseleave", this.selectEventUpdateGenerator(r,c) );
               td.addEventListener("mouseup", this.selectEventEndGenerator(r,c) );

            }
            tr.appendChild(td);
         }
      }

      this.selectCells([[2,2],[2,2]])
   }

   keyEventHandler(event) {
      var newSelection = JSON.parse(JSON.stringify(this.selection));
      if (event.keyCode === 37) { // event.preventDefault(); // "Left"   (Cancel the default action, if needed)
         if(! event.shiftKey) { newSelection[0][1] -= 1; }
         newSelection[1][1] -= 1;
         this.selectCells(newSelection);
      } else if (event.keyCode === 39) { //event.preventDefault(); // "Right"   (Cancel the default action, if needed)
         if(! event.shiftKey) { newSelection[0][1] += 1; }
         newSelection[1][1] += 1;
         this.selectCells(newSelection);
      } else if (event.keyCode === 38) { //event.preventDefault(); // "Up"   (Cancel the default action, if needed)
         if(! event.shiftKey) { newSelection[0][0] -= 1; }
         newSelection[1][0] -= 1;
         this.selectCells(newSelection);
      } else if (event.keyCode === 40) { //event.preventDefault(); // "Down"   (Cancel the default action, if needed)
         if(! event.shiftKey) { newSelection[0][0] += 1; }
         newSelection[1][0] += 1;
         this.selectCells(newSelection);
      } else if (event.keyCode === 8) { event.preventDefault(); // "Backspace"   (Cancel the default action, if needed)
         this.deleteCellContent();
      } else if (event.keyCode === 46) { //event.preventDefault(); // "Entf"   (Cancel the default action, if needed)
         this.deleteCellContent();
      } else if (event.keyCode === 113) { event.preventDefault(); // "F2"   (Cancel the default action, if needed)
         var r = this.selection[0][0];
         var c = this.selection[0][1];
         this.onCellClickEvent(this.cells[r][c]);
      } else if (event.keyCode === 27) { //event.preventDefault(); // "Esc"   (Cancel the default action, if needed)
         newSelection[1][0] = newSelection[0][0];
         newSelection[1][1] = newSelection[0][1];
         this.selectCells(newSelection);
      }
   }

   selectEventStartGenerator(row, col) {
      var that = this;
      return function() {
         that.selecting = true;
         that.unmarkCellsSelected();
         that.selection = [[row,col],[row,col]];
         that.selectCells(that.selection);
      };
   }
   selectEventUpdateGenerator(row, col) {
      var that = this;
      return function() {
         if(that.selecting) {
            that.unmarkCellsSelected();
            if(row < that.selection[0][0]) {
               that.selection[0][0] = row;
            } else {
               that.selection[1][0] = row;
            }
            if(col < that.selection[0][1]) {
               that.selection[0][1] = col;
            } else {
               that.selection[1][1] = col;
            }
            that.selectCells(that.selection);
         }
      };
   }
   selectEventEndGenerator(row, col) {
      var that = this;
      return function() {
         that.selecting = false;
         that.unmarkCellsSelected();
         if(row < that.selection[0][0]) {
            that.selection[0][0] = row;
         } else {
            that.selection[1][0] = row;
         }
         if(col < that.selection[0][1]) {
            that.selection[0][1] = col;
         } else {
            that.selection[1][1] = col;
         }
         that.selectCells(that.selection);
      };
   }

   /**
    * 
    * @param {} selectionArea 
    */
   selectCells(selectionArea) {
      this.unmarkCellsSelected();
      this.selection = selectionArea;
      this.fixSelection();
      this.markCellsSelected();
   }

   unmarkCellsSelected() {
      for(var r=this.selection[0][0]; r<=this.selection[1][0]; r++) {
         for(var c=this.selection[0][1]; c<=this.selection[1][1]; c++) {
            this.cells[r][c].domelem.style.borderTop = "";
            this.cells[r][c].domelem.style.borderBottom = "";
            this.cells[r][c].domelem.style.borderLeft = "";
            this.cells[r][c].domelem.style.borderRight = "";
            this.cells[r][c].domelem.getElementsByClassName("spreadsheet-table-td-inner")[0].style.backgroundColor = "";
         }
      }
   }
   fixSelection() {
      var rowStart = this.selection[0][0];
      var colStart = this.selection[0][1];
      var rowEnd = this.selection[1][0];
      var colEnd = this.selection[1][1];

      if(rowStart < 1) { rowStart = 1; }
      if(colStart < 1) { colStart = 1; }
      if(rowEnd < 1) { rowEnd = 1; }
      if(colEnd < 1) { colEnd = 1; }
      if(rowStart > this.rows) { rowStart = this.rows; }
      if(colStart > this.cols) { colStart = this.cols; }
      if(rowEnd > this.rows) { rowEnd = this.rows; }
      if(colEnd > this.cols) { colEnd = this.cols; }

      if(rowStart > rowEnd) {
         var tmp = rowEnd;
         rowEnd = rowStart;
         rowStart = tmp;
      }
      if(colStart > colEnd) {
         var tmp = colEnd;
         colEnd = colStart;
         colStart = tmp;
      }

      this.selection = [[rowStart,colStart],[rowEnd,colEnd]];
   }
   markCellsSelected() {
      var rowStart = this.selection[0][0];
      var colStart = this.selection[0][1];
      var rowEnd = this.selection[1][0];
      var colEnd = this.selection[1][1];

      for(var r=rowStart; r<=rowEnd; r++) {
         var isUpper = false;
         var isLower = false;
         if(r==rowStart) { isUpper = true; }
         if(r==rowEnd)   { isLower = true; }
         for(var c=colStart; c<=colEnd; c++) {
            var isLeft = false;
            var isRight = false;
            if(c==colStart) { isLeft = true; }
            if(c==colEnd)   { isRight = true; }

            var borderStyle = "2px solid rgba(130,110,253,1)";
            this.cells[r][c].domelem.getElementsByClassName("spreadsheet-table-td-inner")[0].style.backgroundColor = "rgba(180, 168, 255, 0.15)";

            if(isUpper) { this.cells[r][c].domelem.style.borderTop = borderStyle; }
            if(isLower) { this.cells[r][c].domelem.style.borderBottom = borderStyle; }
            if(isLeft) { this.cells[r][c].domelem.style.borderLeft = borderStyle; }
            if(isRight) { this.cells[r][c].domelem.style.borderRight = borderStyle; }
         }
      }

      if(rowEnd-rowStart > 0) {
         this.cells[rowStart][colStart].domelem.style.borderBottom = "2px dashed rgba(130,110,253,1)";
      }
      if(colEnd-colStart > 0) {
         this.cells[rowStart][colStart].domelem.style.borderRight = "2px dashed rgba(130,110,253,1)";
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

   setCellValueToSelectedCells(text, info) {
      for(var r=this.selection[0][0]; r<=this.selection[1][0]; r++) {
         for(var c=this.selection[0][1]; c<=this.selection[1][1]; c++) {
            this.cells[r][c].text = text;
            this.cells[r][c].info = info;
            this.cells[r][c].update();
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

   deleteCellContent() {
      for(var r=this.selection[0][0]; r<=this.selection[1][0]; r++) {
         for(var c=this.selection[0][1]; c<=this.selection[1][1]; c++) {
            this.cells[r][c].text = "";
            this.cells[r][c].info = null;
            this.cells[r][c].update();
         }
      }
   }

   importJSONFile(event) {
      var that = this;
      var uploadFile = event.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function(event) {
         that.importJSON(event.target.result);
      }
      reader.readAsText(uploadFile, "utf8");
   }

   importCSVFile(event) {
      var that = this;
      var uploadFile = event.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function(event) {
         that.importCSV(event.target.result, false);
      }
      reader.readAsText(uploadFile, "utf8");
   }

   importCSVTermFile(event) {
      var that = this;
      var uploadFile = event.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function(event) {
         that.importCSV(event.target.result, true);
      }
      reader.readAsText(uploadFile, "utf8");
   }

   importJSON(filecontent) {
      var jsoncells = JSON.parse(filecontent);

      this.createNewSpreadsheet(jsoncells.length, jsoncells[0].length);

      for (var row = 1; row < this.cells.length; row++) {
         for (var column = 1; column < this.cells[row].length; column++) {
            this.cells[row][column].text = jsoncells[row-1][column-1].text;
            this.cells[row][column].info = jsoncells[row-1][column-1].info;
            this.cells[row][column].update();
         }
      }
   }

   /**
    * Import Text in CSV-Format and apply to spreadsheet
    * NOTE: Comments in CSV-Format are currently NOT supported
    * 
    * @param {the csv text as string that should be imported} text 
    * @param {boolean true/false if every second row contains JSON-Dicts that describe additional Info for cells} importInfo 
    */
   importCSV(text, importInfo) {
      var SEPARATOR = ";";

      // Analyze File data and extract data
      var textlines = text.split("\n");
      var maxCols = 0;
      var maxRows = textlines.length;
      var data = [];
      
      var row = 0;
      var textrow = 0;
      while(textrow < textlines.length) {
         var textline = textlines[textrow];
         data.push([]);
         var celltexts = textline.split(SEPARATOR);
         maxCols = Math.max(maxCols, celltexts.length);

         var col = 0;
         for(var celltext of celltexts) {
            data[row].push({
               text : celltext,
               info : null
            });
         }

         if(importInfo) {
            ++textrow;
            textline = textlines[textrow];
            var celltexts = textline.split(SEPARATOR);
            
            var col = 0;
            for(var celltext of celltexts) {
               if(celltext == "") {
                  data[row][col].info = null;
               } else {
                  data[row][col].info = JSON.parse(celltext);
               }
               ++col;
            }
         }

         ++textrow;
         ++row;
      }

      // Create Spreadsheet-Cells and copy to Spreadsheet
      this.createNewSpreadsheet(maxRows, maxCols);
      var row = 1;
      for(var datarow of data) {
         var col = 1;
         for(var cell of datarow) {
            this.cells[row][col].text = cell.text;
            this.cells[row][col].info = cell.info;
            this.cells[row][col].update();
            ++col;
         }
         ++row;
      }
   }

   exportCSV(exportInfo) {
      var data = "";
      for (var row = 1; row < this.cells.length; row++) {
         for (var column = 1; column < this.cells[row].length; column++) {
            var celltext = this.cells[row][column].text;
            data += celltext;
            if (column < this.cells[row].length-1) {
               data += ";";
            } 
         }
         if (exportInfo) {
            data += "\n";
            for (var column = 1; column < this.cells[row].length; column++) {
               if(this.cells[row][column].info != null) {
                  var cellinfo = JSON.stringify(this.cells[row][column].info).replaceAll("\n","").replaceAll(";",",");
                  data += cellinfo;
               }
               if (column < this.cells[row].length-1) {
                  data += ";";
               }
            }
         }
         if (row < this.cells.length-1) {
            data += "\n";
         }
      }

      this.createDownloadableFile("Spreadsheet.csv", data, "csv");
   }

   exportJSON() {
      var jsoncells = [];

      for (var row = 1; row < this.cells.length; row++) {
         jsoncells.push([]);
         for (var column = 1; column < this.cells[row].length; column++) {
            var cell = {
               text : this.cells[row][column].text,
               info : this.cells[row][column].info,
            };
            jsoncells[row-1].push(cell);
         }
      }

      var data = JSON.stringify(jsoncells,null,2);
      this.createDownloadableFile("Spreadsheet.json", data, "json");
   }

   createDownloadableFile(filename, data, type) {
      var file = new Blob([data], {type: type});
      if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
            var a = document.createElement("a"),
                  url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
               document.body.removeChild(a);
               window.URL.revokeObjectURL(url);  
            }, 0); 
      }
   }
}