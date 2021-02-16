/* global tau */
const tmpl = document.createElement("template");

tmpl.innerHTML = `
<div class="app-hotel-breakfast">
	<div class="ui-section-changer">
		<div>
			<section class="ui-section-active ui-content-area">
				<div class="app-hotel-breakfast-image app-breakfast-1"></div>
				<ul class="ui-listview app-hotel-breakfast-description">
					<li class="ui-li-divider">
						<div class="ui-li-text">
							<span class="ui-li-text-title">
								English Breakfast
							</span>
							<span class="ui-li-text-sub">
								Delicious breakfast: fried egg, baked bacon, beans, sausages, tomato, bread, hot drink.
							</span>
						</div>
						<div class="app-hotel-order">
							<a href="breakfast-menu.html" class="ui-btn ui-btn-contained-colored" data-inline="true">Order</a>
						</div>
					</li>
					<li class="ui-li-has-icon">
						<div class="ui-li-icon">
							<img src="images/tw_list_icon_wallpaper.svg"/>
						</div>
						<div class="ui-li-text">
							<span class="ui-li-text-title">
								Hotel Restaurant App
							</span>
							<span class="ui-li-text-sub">
								Install full app from <a href="#" data-style="flat">App Store</a>
							</span>
						</div>
					</li>
				</ul>
			</section>
			<section class="ui-content-area">
				<div class="app-hotel-breakfast-image app-breakfast-3"></div>
				<ul class="ui-listview app-hotel-breakfast-description">
					<li class="ui-li-divider">
						<div class="ui-li-text">
							<span class="ui-li-text-title">
								Asian breakfast
							</span>
							<span class="ui-li-text-sub">
								Healthy and delicious: fried egg, soup, seafood, vegetables, pickled and baked additives, rise.
							</span>
						</div>
						<div class="app-hotel-order">
							<a href="breakfast-menu.html" class="ui-btn ui-btn-contained-colored" data-inline="true">Order</a>
						</div>
					</li>
					<li class="ui-li-has-icon">
						<div class="ui-li-icon">
							<img src="images/tw_list_icon_wallpaper.svg"/>
						</div>
						<div class="ui-li-text">
							<span class="ui-li-text-title">
								Hotel Restaurant App
							</span>
							<span class="ui-li-text-sub">
								Install full app from <a href="#" data-style="flat">App Store</a>
							</span>
						</div>
					</li>
				</ul>
			</section>
			<section class="ui-content-area">
				<div class="app-hotel-breakfast-image app-breakfast-2"></div>
				<ul class="ui-listview app-hotel-breakfast-description">
					<li class="ui-li-divider">
						<div class="ui-li-text">
							<span class="ui-li-text-title">
								Vegetarian breakfast
							</span>
							<span class="ui-li-text-sub">
								Healthy and nutritious: scrambled eggs, Greek feta cheese, tomatoes, avocado, banana mousse, bread.
							</span>
						</div>
						<div class="app-hotel-order">
							<a href="breakfast-menu.html" class="ui-btn ui-btn-contained-colored" data-inline="true">Order</a>
						</div>
					</li>
					<li class="ui-li-has-icon">
						<div class="ui-li-icon">
							<img src="images/tw_list_icon_wallpaper.svg"/>
						</div>
						<div class="ui-li-text">
							<span class="ui-li-text-title">
								Hotel Restaurant App
							</span>
							<span class="ui-li-text-sub">
								Install full app from <a href="#" data-style="flat">App Store</a>
							</span>
						</div>
					</li>
				</ul>
			</section>
		</div>
	</div>
</div>
`;

class HotelBreakfast extends HTMLElement {
	connectedCallback() {
		var s;

		if (!this.firstElementChild) {
			this.appendChild(tmpl.content.cloneNode(true));
			tau.engine.createWidgets(this);
		}
		s = this.querySelector(".ui-section-changer");

		// temporary fix for refresh section changer
		window.setTimeout(function () {
			tau.engine.getBinding(s).refresh();
		}, 200);
	}
}

customElements.define("hotel-breakfast", HotelBreakfast);