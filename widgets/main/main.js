terminologyQuery = new TerminologyQuery(
   document.getElementById("terminologyQuery")
);

spreadsheet = new Spreadsheet(
   document.getElementById("spreadsheet"),
   100,
   30,
   terminologyQuery.show
);