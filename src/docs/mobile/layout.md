#Application Page Layout

In the mobile Tizen Advanced UI framework (TAU) the page and its elements
(header, content, and footer) are all <div> blocks with a specific data-role
property. The header is placed at the top, and displays the page title.
The content is the area below the header, showing the main content of the
page. The footer is at the bottom, and contains the page menu.

The following table describes the specific information for each section.

<table>
<caption>Table: Page sections</caption>
<tbody>
<tr>
<th style="width:10%;">Section</th>
<th>data-role</th>
<th>Description</th>
</tr>
<tr>
<td>Page</td>
<td><span style="font-family: Courier New,Courier,monospace">"page"</span></td>
<td><p>Defines the element as a page.</p>
<p>The page widget is used to manage a single item in a page-based architecture.</p>
<p>A page is composed of header (optional), content (mandatory), and footer (optional) elements.</p></td>
</tr>
<tr>
<td>Header</td>
<td><span style="font-family: Courier New,Courier,monospace">"header"</span></td>
<td><p>Defines the element as a header.</p>
<p>As the Tizen Wearable device screen size is small, avoid using the header element.</p></td>
</tr>
<tr>
<td>Content</td>
<td><span style="font-family: Courier New,Courier,monospace">"content"</span></td>
<td><p>Defines the element as content.</p></td>
</tr>
<tr>
<td>Footer</td>
<td><span style="font-family: Courier New,Courier,monospace">"footer"</span></td>
<td><p>Defines the element as a footer.</p>
<p>The footer section is mostly used to include option buttons.</p></td>
</tr>
</tbody>
</table>

To add a page to the application, use the following code:

		@example
		<div data-role="page">
			<!--Page area-->
			<div data-role="header"><!--Header area--></div>
			<div data-role="content"><!--Content area--></div>
			<div data-role="footer"><!--Footer area--></div>
		</div>

In your application, you can:

- [Create multi-page layouts](multipage.htm)
- [Change the active page](change.htm)
- [Handle page events and method](pageevents.htm)

@page ns.page.layout
@seeMore ../index.htm Tizen Advanced UI Framework
/
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
define("profile/mobile/page/layout", function(){})
//>>excludeEnd("tauBuildExclude");
