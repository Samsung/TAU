 #Multi-page Layout

 You can implement a template containing multiple page containers in the application index.html file.

 In the multi-page layout, we can define multi pages with data-role="page" attribute.

 You can link to internal pages by referring to the ID of the page. For example, to link to the page with an ID of two, the link element needs the href="#two" attribute in the code, as in the following example.

 		@example
 		<div data-role="page" id="main">
			<div data-role="header" data-position="fixed">
				<!--Header-->
			</div>
			<div data-role="content">
				<a href="#two"data-role="button">TWO</a>
			</div>
		</div>
		<div data-role="page" id="two">
			<div data-role="header" data-position="fixed">
				<!--Header-->
			</div>
			<div data-role="content">
				<!--Content-->
			</div>
		</div>

 To find the currently active page, use the ui-page-active class.