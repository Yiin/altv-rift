class com.rockstargames.gtav.levelDesign.GUIDESCALEFORM extends com.rockstargames.gtav.levelDesign.BaseScriptUI
{
   function GUIDESCALEFORM()
   {
      super();
   }
   function INITIALISE(mc)
   {
      this.TIMELINE = mc;
      this.CONTENT = this.TIMELINE.attachMovie("CONTENT","CONTENT",this.TIMELINE.getNextHighestDepth());
   }
   function SET_STATUS(str)
   {
      this.CONTENT.Status.htmlText = str;
   }
}
