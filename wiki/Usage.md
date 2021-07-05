# Default usage of the web application
## 1. Import/Upload existing CSV-file or create new spreadsheet
> TODO:
## 2. Edit cells and search for terminologies/Keywords
> TODO:
## 3. Export/Download and store spreadsheet data again
> TODO:

# Privacy Information
The web-application is completly written in Java-Script and runs locally in your browser.

When importing or exporting spreadsheet data, the data is only stored within your webbrowser and will never be send to our server and always remains locally.

Our server only sends you the open source code of this web application so you can run this tool locally in your browser.

The <u>**only exception**</u> where some of your data is communicated with another server is when you search for terminology in a database. Then only the text of the current cell (or the currently entered text in the terminologyQuery-Dialog) is send to the selected [API-Query](https://github.com/cuwolf-de/TerminologySpreadsheet/tree/main/wiki/Usage.md#Configure-API-Queries) and this server will search for terminology in its database and send the results back to you.

# Data Formats (File Import and Export)
## JSON-Import/Export Format


## CSV-Import/Export Format (without additional Information)
Export: Save as CSV (text only)
Each column data gets exported separated by semicolons, new lines are induced by "\n". Each row / column represents a row / column of the spreadsheet. 
This data fomat can easily be used to import in Excel or LibreOffice. 

Import: Load CSV
Existing csv files can be uploaded via "Load CSV". It is necessary that the data is separated by semicolons, other separators are not supported.

## CSV-Import/Export Format (with additional Information)
Export: Save as CSV (+ Term-Info)
The data gets exported separated by semicolons in csv file format. The row below the cell data contains addidional Information about the terminology in form of a JSON dictionary. Thus every second row (odd row numbers) contains the terminologies which have been inserted in the online editor. Every other second row (even row numbers) contains additional Information about the terminology in form of a JSON dictionary. As example, if one termniology has been inserted in the online editor, the download file contains the terminology at the chosen position and the cell below is filled with the JSON dictionary. 
> Note: The cell below is only filled, if the user entered a terminology. For example, if no terminology has been entered in the whole row, the row below exists but all cell values in this row are empty strings.

Import: Load CSV (+Term-Info)
An exported file in with terminology inormation can be uploaded again. Therefore the file format has to match with the download file format. So that the row below the terminologies contains the additional information in Form of a JSON dictionary in the cell below the terminology.








# Configure API-Queries
If you search a keyword in the TerminologySpreadsheet your browser will do an HTTP-Request (via JavaScript in background) to another Terminology-Service-Server. This Server will send your browser the results as HTTP-Response.

The API-Queries-Config describes how to search for keywords and send API-Requests via HTTP in background and how to read the response.

As default there are some pre-configured terminology services configured that offer you the ability to search for keywords in different databases.

The current terminology service is [https://terminologies.gfbio.org/api/](https://terminologies.gfbio.org/api/) and there is a **search** and a **suggest** API-Request configured per default.

If you want you can add new databases or adapt the current API-Requests to your desire.

As web-application user you only need to double click on any cell and navigate to the `query APIs`-Tab in the Terminology-Query-Dialog. There you can change the JSON-Configure-File for the API-Requests for your current session locally and termporarly.

![alt text](https://raw.githubusercontent.com/cuwolf-de/TerminologySpreadsheet/main/wiki/img/example_changeQueryAPIs.png "Query API Dialog")

> **Server-Admin-Info:**
>
> If you want to change the API-Requests permanently on your server the default JSON-Configuration-File can be found and edited in
> 
> `/var/www/TerminologySpreadsheet/widgets/terminologyQuery/defaultQueryAPIs.json`
>
> If you installed the Webserver in another directory you have to change `/var/www/TerminologySpreadsheet` with your Webserver-Root.

## JSON-Syntax of Query API's Config-File
In the Configuration-File you will find a list `[ apiQuery1, apiQuery2, ... ]` with apiQuery-Objects.

Each apiQuery-Object has the following JSON-Syntax
```json
{
   "name"    : "domain : what the API does",
   "apiURL"  : "https://sub.domain.org/path/api?query={{searchTerm}}&param=1",
   "results" : "results",
   "label"   : "label",
   "source"  : "sourceTerminology"
}
```
and describes how an API-Request is performed and how the resulting HTTP-Response is parsed and understood. A resulting HTTP-Response must always be text in JSON-Format but can be in two different Formats:

- **Type A:**
   Object that contains a list of search results as attribute (here attribute `"results"`):
   ```json
   {
   "request": {
      "query": "http://terminologies.gfbio.org/api//terminologies/suggest?query=lupus&limit=15",
      "executionTime": "Fri Jun 25 15:57:31 CEST 2021"
   },
   "results": [
      {
         "label": "Omox lupus",
         "uri": "http://terminologies.gfbio.org/ITIS/Taxa_636460",
         "sourceTerminology": "ITIS"
      },
      {
         "label": "Canis lupus",
         "uri": "http://terminologies.gfbio.org/ITIS/Taxa_180596",
         "sourceTerminology": "ITIS"
      }
   ],
   "diagnostics": []
   }
   ```
- **Type B:** Directly a list of search results
   ```json
   [
      {
         "label": "Omox lupus",
         "uri": "http://terminologies.gfbio.org/ITIS/Taxa_636460",
         "sourceTerminology": "ITIS"
      },
      {
         "label": "Canis lupus",
         "uri": "http://terminologies.gfbio.org/ITIS/Taxa_180596",
         "sourceTerminology": "ITIS"
      }
   ]
   ```

**About the Attributes of each `apiQuery`-Object:**
- **"name"** is just the text that is displayed in the Query API Drop-Down-List
- **"apiURL"** the URL (`GET`-Request) that is sent to the server to perform the API-Query. Requesting this URL at the Terminology-Service should return text in JSON-Format that contains the Response with the search results.
Note that `{{searchTerm}}` will be replaced with the entered search Term automatically each time you want to make a query. You can use `{{searchTerm}}` multiple times in the URL and all occurences will be replaced before the API-Request is performed.
Note that currently only `GET`-HTTP-Requests and HTTP-Responses that contain JSON-Text are supported.
- **"results"** if this attribute is given and is not an empty string (`""`), then the HTTP-Response of the search query is parsed as Response of **Type A**. The attribute name containing the list of results is described by this string value.

   If this string value is an empty string (`""`) then the response is parsed as **Type B**.

   (In the above examples we used **Type A** and the list of results is assigned to the attribute `results` in the recieved JSON-Response.)
- **"label"** The name of the attribute containing the suggested keyword.
- **"source"** (optional) The name of an attribute that contains the name of the database that acts as source for the keyword. There one could find more information to the keyword.
