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
 * A cell that can be used in a specific row and column of a Spreadsheet.
 * The cell object will remember the text that is displayed in the cell
 * and if the cell text is a searched terminology the cell will remember
 * the url and further information that corresponds to the terminology term.
 * This might be useful for later export, so we can add columns behind each cell that
 * contains further terminology information
 */
class SpreadsheetCell {
   /**
    * @param {HTML-Element-Reference} domelem - The Object that refers to the cell
    */
   constructor(domelem) {
      this.domelem = domelem;
      this.info = null;
      this.text = "";
   }

   /**
    * Updates the HTML-Code of the cell.
    * Call this after changing info or text of the cell, so the changes
    * will become visible in the spreadsheet.
    */
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
   /**
    * 
    * @param {HTML-Element-Reference} domelem - The main div-Element of the spreadsheet where this class will generatte HTML-Code
    * @param {integer} rows - how many rows you desire to have in vertical direction
    * @param {integer} cols - how many columns you desire to have in horizontal direction
    * @param {event-function} onCellClickEvent - what should happen if you click on a cell
    */
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

   /**
    * discards all current changes and creates a new empty spreadsheet with
    * rows many rows and cols many columns
    * @param {integer} rows - how many rows you desire to have in vertical direction
    * @param {integer} cols - how many columns you desire to have in horizontal direction
    */
   createNewSpreadsheet(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.reset();
   }

   /**
    * just clears the current spreadsheet but does not change number of columns or rows
    * also see createNewSpreadsheet(rows, cols)
    */
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

   /**
    * Has to be used in the global key-Event-Handler in main.js
    * You can call this method with the current key event
    * to enable the ability to control things in this spreadsheet with your keyboard
    * If a dialog is currently visible over the spreadsheet that currently has the focus,
    * then make sure that for this case this method is not called.
    * 
    * @param {event-object} event - key press event
    */
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

   /**
    * Used for selecting cells by mousedown, drag and select and mouseup
    * Creates an event-function that is called by a spreadsheet-cell when you raise
    * the mouse-down-event.
    * 
    * @param {integer} row - current row of the cell that raises the event returned by this method
    * @param {integer} col - current column of the cell that raises the event returned by this method
    * @returns a specific event-function for the cell that raises this specific event
    */
   selectEventStartGenerator(row, col) {
      var that = this;
      return function() {
         that.selecting = true;
         that.unmarkCellsSelected();
         that.selection = [[row,col],[row,col]];
         that.selectCells(that.selection);
      };
   }
   /**
    * Used for selecting cells by mousedown, drag and select and mouseup
    * Creates an event-function that is called by a spreadsheet-cell when you raise
    * the mouse-enter/leave-event.
    * 
    * @param {integer} row - current row of the cell that raises the event returned by this method
    * @param {integer} col - current column of the cell that raises the event returned by this method
    * @returns a specific event-function for the cell that raises this specific event
    */
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
   /**
    * Used for selecting cells by mousedown, drag and select and mouseup
    * Creates an event-function that is called by a spreadsheet-cell when you raise
    * the mouse-up-event.
    * 
    * @param {integer} row - current row of the cell that raises the event returned by this method
    * @param {integer} col - current column of the cell that raises the event returned by this method
    * @returns a specific event-function for the cell that raises this specific event
    */
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
    * Selects cells by remembering the selecting and drawing a blue border around selected cells
    * 
    * @param {array} selectionArea - list in format [[rowStart, colStart],[rowEnd, colEnd]]
    */
   selectCells(selectionArea) {
      this.unmarkCellsSelected();
      this.selection = selectionArea;
      this.fixSelection();
      this.markCellsSelected();
   }
   /**
    * fixes an invalid selection if a Start-value is larger than the end-value
    * This can occur when selecting cells from right bottom into top left direction with the mouse
    */
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

   /**
    * removes the visible border around previously selected cells
    */
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
   /**
    * called by selectCells() and
    * draws a blue border around selected cells
    */
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
    * Set data (text and optional additional background information) to a single cell
    * 
    * @param {integer} x - column of cell NOTE: Index starting at 1 (not 0)
    * @param {integer} y - row    of cell NOTE: Index starting at 1 (not 0)
    * @param {string} text - Text that you want to write to the cell
    * @param {any object} info - "null" or additional object that can (optionally) be assigned set that will be stored but not displayed
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

   /**
    * Same as setCellValue(x, y, text, info) but sets the data
    * to all currently selected cells
    * 
    * @param {string} text - Text that you want to write to the cell
    * @param {any object} info - "null" or additional object that can (optionally) be assigned set that will be stored but not displayed
    */
   setCellValueToSelectedCells(text, info) {
      for(var r=this.selection[0][0]; r<=this.selection[1][0]; r++) {
         for(var c=this.selection[0][1]; c<=this.selection[1][1]; c++) {
            this.cells[r][c].text = text;
            this.cells[r][c].info = info;
            this.cells[r][c].update();
         }
      }
   }

   /**
    * Used for labelling columns different as rows and converts an
    * Integer 1,2,3,... to a latin letter A,B,...,Y,Z,AA,AB,...
    * 
    * @param {integer} num - Any Integer Number >= 1
    * @returns a string of the letter(s)
    */
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

   /**
    * clears the content of the currently selected cells
    */
   deleteCellContent() {
      for(var r=this.selection[0][0]; r<=this.selection[1][0]; r++) {
         for(var c=this.selection[0][1]; c<=this.selection[1][1]; c++) {
            this.cells[r][c].text = "";
            this.cells[r][c].info = null;
            this.cells[r][c].update();
         }
      }
   }

   /**
    * called by uploading a file by clicking on "Load JSON"-Button
    * reads in the text of the file that the user selected in the upload dialog
    * and calls importJSON() for further data procession.
    * 
    * @param {event-Object} event - that is raised by a file upload
    */
   importJSONFile(event) {
      var that = this;
      var uploadFile = event.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function(event) {
         that.importJSON(event.target.result);
      }
      reader.readAsText(uploadFile, "utf8");
   }

   /**
    * called by uploading a file by clicking on "Load CSV"-Button
    * reads in the text of the file that the user selected in the upload dialog
    * and calls importCSV() for further data procession.
    * 
    * @param {event-Object} event - that is raised by a file upload
    */
   importCSVFile(event) {
      var that = this;
      var uploadFile = event.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function(event) {
         that.importCSV(event.target.result, false);
      }
      reader.readAsText(uploadFile, "utf8");
   }

   /**
    * called by uploading a file by clicking on "Load CSV (+ Term-Info)"-Button
    * reads in the text of the file that the user selected in the upload dialog
    * and calls importCSV() for further data procession.
    * 
    * @param {event-Object} event - that is raised by a file upload
    */
   importCSVTermFile(event) {
      var that = this;
      var uploadFile = event.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function(event) {
         that.importCSV(event.target.result, true);
      }
      reader.readAsText(uploadFile, "utf8");
   }

   /**
    * reads and parses the JSON-string to apply the JSON-encoded data to the current spreadsheet.
    * The number of rows and columns is automatically set to the number or rows and cells described by the JSON-file
    * 
    * @param {JSON as string} filecontent - the string that describes the spreadsheet in JSON-Format
    */
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
    * Each row is separated by a new-line "\n" and each column is seperated per default by a semicolon ";"
    * If there is additional info stored in the CSV-File for each cell, then each second row contains these info as JSON-Dicts
    * 
    * @param {string} text - the string that describes the spreadsheet in CSV-Format
    * @param {boolean} importInfo - true/false if every second row contains JSON-Dicts that describe additional Info for cells
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

   /**
    * Exports the spreadsheet in CSV-Format and creates a downloadable file that can be loaded e.g. by Microsoft-Excel or Libre-Office
    * Each row is separated by a new-line "\n" and each column is seperated per default by a semicolon ";"
    * If there is additional info stored in the CSV-File for each cell, then each second row contains these info as JSON-Dicts
    * 
    * @param {boolean} exportInfo - true/false if every second row contains JSON-Dicts that describe additional Info for cells
    */
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

   /**
    * Exports the spreadsheet in JSON-Format and creates a downloadable file that can be easily processed by Python
    * Each row is separated by a new-line "\n" and each column is seperated per default by a semicolon ";"
    * If there is additional info stored in the CSV-File for each cell, then each second row contains these info as JSON-Dicts
    * 
    * @param {boolean} exportInfo - true/false if every second row contains JSON-Dicts that describe additional Info for cells
    */
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

   /**
    * Let JavaScript locally create a "virtual" file that you can download from your browser and store on your pc.
    * This method is a helper method called by export-methods that need to create a downloadable file after creating the file data.
    * 
    * @param {string} filename - name of the file (with file extension) that JavaScript should create for a download
    * @param {string} data - data that should be contained in the file
    * @param {string} type - file type
    */
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