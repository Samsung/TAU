### Positioning Drawer left / right (option)
  To change position of a Drawer please set data-position attribute of Drawer
  element to:

  - left (left position, default)
  - right (right position)


		@example
		<div class="ui-drawer" data-position="left" id="leftdrawer"></div>

## Default selector
You can make the drawer component as data-role="drawer" with DIV tag.

## HTML Examples
		@example
		<div data-role="drawer" data-position="left" id="leftdrawer">
			<ul data-role="listview">
				<li class="ui-drawer-main-list"><a href="#">List item 1</a></li>
				<li class="ui-drawer-main-list"><a href="#">List item 2</a></li>
				<li class="ui-drawer-sub-list"><a href="#">Sub item 1</a></li>
			</ul>
		</div>