# About the files and modules
- **index.html**
   
   The main site. Some HTML-Code for Overlays, Navigation bar and Modals/Dialogs.
   
- **widgets**
   - **main**
   
      global button events, connecting spreadsheet actions and terminologyQuery actions.

   - **spreadsheet**

      The Object that organizes the spreadsheet cells, can perform import and export of the whole spreadsheet as file and many more functions.
      
      The HTML-Code of the Spreadsheet is created dynamically and is applied to a single, empty div-Element in index.html. So you will not find HTML-Code of the Grid in index.html .

   - **terminologyQuery**
   
      The Object that is responsible for the Terminology-Search-Dialog and that performs API-Requests and writes the searched keywords into the spreadsheet.
      
      The HTML-Code of the Dialog can be found in index.html.

      For more information how to adapt API-Queries and add more Terminology-Databases, please look at - [**Information for webapplication User**](https://github.com/cuwolf-de/TerminologySpreadsheet/tree/main/wiki/Usage.md#Configure-API-Queries)