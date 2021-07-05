# About the files and modules
- **/index.html**
   
   The main site. Some HTML-Code for Overlays, Navigation bar and Modals/Dialogs.
   
- **/widgets**

   Each subfolder in folder `widgets` contains JavaScript-Code for the widget and CSS-Style-Sheets that are both included in `index.html` .
   - **/main**
   
      global button events, connecting spreadsheet actions and terminologyQuery actions.

   - **/spreadsheet**

      The object that organizes the spreadsheet cells, can perform import and export of the whole spreadsheet as file and many more functions.
      
      The HTML-Code of the Spreadsheet is created dynamically and is applied to a single, empty div-Element in index.html. So you will not find HTML-Code of the Grid in index.html .

   - **/terminologyQuery**
   
      The object that is responsible for the Terminology-Search-Dialog and that performs API-Requests and writes the searched keywords into the spreadsheet.
      
      The HTML-Code of the Dialog can be found in index.html.

      For more information how to adapt API-Queries and add more Terminology-Databases, please look at - [USER of the web-application](https://github.com/cuwolf-de/TerminologySpreadsheet/tree/main/wiki/Usage.md#Configure-API-Queries)

   - **/icons**

      Git-Submodule of the [Bootstrap-Icons](https://github.com/twbs/icons) that can be cloned into here (see [SERVER-ADMINS and hosting](https://github.com/cuwolf-de/TerminologySpreadsheet/tree/main/wiki/InstallAndSetup.md#2-Clone-Webserver-Files-from-GitHub))

For further information please look at the comments in the source code.

# Caching of API-Queries
Currently caching of previous API-Queries in JavaScript is not implemented. Each terminology-search will result in an JavaScript XML-Request that is performed.

# JavaScript Tricks and Hacks that are all over the Source Code
These are (maybe not so intuitive) hacks to fix problems we had with JavaScript. If you have a better idea to solve these problems feel free to comment and let us know.

## 1. var that = this
When assigning inline declared event-functions to button clicks or similar events you will find variables `this` and `that` inside the assigned event function.

The problem is that `this` inside the function will e.g. refer to the element that raises the event and not to the current class where we declare the event function inline. If we want to access our class (e.g. `terminologyQuery` or `spreadsheet`) we assign a variable
```JavaScript
var that = this;
```
so we can refer to our class instance (via `that`) inside the event function and change properties by e.g. a button click and on the other side have `this` if we need to refer to the element that raised the event.

## 2. Event-Function Generators
When assigning similar event-functions to elements like Apply-Buttons for multiple terminology-search results in a loop, we had a problem because the only data variable that differed in the similar event-functions was the same in the end.
Instead of making sure the object is deep-copied before assigning a event-function, we created generator-functions that will create and return an event function with a copy of the object. The copy is indirectly done by passing it as parameter to the generator function. (I hope i understood that correctly)

An example of a event-generator function can be found in `terminologyQuery.js`
```JavaScript
searchResultApplyEventGenerator(resultLabel, resultJSON) {
   var that = this;
   return function() {
      that.finalizeFunction(resultLabel,resultJSON);
      that.hide();
   }
}
```
and is called in the same file in the method `searchTerminology()` after recieving a server response after a terminology search with one of the Query-APIs
```JavaScript
buttonElem.addEventListener(
   "click",
   that.searchResultApplyEventGenerator(
      result[currentQueryAPI.label],
      result
   )
);
```
`result` is one of the query-results that was recieved and for that we want to create an apply-button.
