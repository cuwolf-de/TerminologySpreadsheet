/**
 * This Class contains functions to query terminologies from different terminology services
 * It also shows an overlay that 
 */
class TerminologyQuery {
   constructor(domelem) {
      this.domelem = domelem;

      // All HTML-Elements that have the Name cancelButton (here we have a list because Name does not need to be unique compared to id)
      for(var buttonElem of this.domelem.getElementsByClassName("cancelButton")) {
         buttonElem.onClick = this.hide;
      }
   }

   show() {
      this.domelem.style.display = "block";
   }
   hide() {
      this.domelem.style.display = "none";
   }
}