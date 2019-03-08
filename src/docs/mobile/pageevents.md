 #Handling Page Events and Methods

 TAU support "Page" as widget. So, when the page is created, it has several
 events and methods. In this document, we would introduce events and methods in
 TAU Page Widget.

 ## Events list

 The following table lists the events related to pages.

 <table>
 <tbody>
 <tr>
 <th>Name</th>
 <th>Description</th>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pagebeforchange</span></td>
 <td><p>Triggered before switching current page</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pagebeforecreate</span></td>
 <td><p>Triggered before the widget is created and initialized</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pagebeforehide</span></td>
 <td><p>Triggered before current page is about to be closed</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pagebeforeload</span></td>
 <td><p>Triggered before external page will be loaded</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pagebeforeshow</span></td>
 <td><p>Triggered before page will be displayed</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pagechange</span></td>
 <td><p>Triggered after switching current page</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pagechangefailed</span></td>
 <td><p>Triggered when page switching failed</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pagecreate</span></td>
 <td><p>Triggered after widget creation</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pagehide</span></td>
 <td><p>Triggered after the page is hidden</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pageinit</span></td>
 <td><p>Triggered after widget initialization occurs</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pageload</span></td>
 <td><p>Triggered after an external page is loaded</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pagremove</span></td>
 <td><p>Triggered after the external page is removed from the DOM</p></td>
 </tr>

 <tr>
 <td class="option"><span style="font-family: Courier New,Courier,monospace">pageshow</span></td>
 <td><p>Triggered after the page is displayed</p></td>
 </tr>

 </tbody>
 </table>

 ## Binding H/W Back Key event

 To bind an event callback on the Back key, use the following code:

 		@example
 		// JavaScript code
		window.addEventListener('tizenhwkey', function(ev)
			{
				if (ev.originalEvent.keyName == "back")
					{
					// Call window.history.back() to go to previous browser window
					// Call tizen.application.getCurrentApplication().exit() to exit application
					// Add script to add another behavior
					}
			});
