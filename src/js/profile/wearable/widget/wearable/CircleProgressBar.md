## Simple progress bar

    @example template tau-circle-progress-simple
	<progress class="ui-circle-progress" max="${1:100}" value="${2:20}"></progress>

If you don't make any widget "circleprogress" with _progress_ element, you can show default progress style.

To add a circular shape(page size) progressbar in your application, you have to declare _progress_ tag in "ui-page" element.

To add a CircleProgressBar widget to the application, use the following code:

    @example tau-circle-progress-full
	<div class="ui-page" id="pageCircleProgressBar">
	    <header class="ui-header"></header>
	    <div class="ui-content"></div>
         <progress class="ui-circle-progress" id="circleprogress" max="20" value="2"></progress>
	</div>
	<script>
		(function(){

		    var page = document.getElementById( "pageCircleProgressBar" ),
		        progressBar = document.getElementById("circleprogress"),
		        progressBarWidget;

		    page.addEventListener( "pageshow", function() {
		        var i=0;
		        // make Circle Progressbar object
		        progressBarWidget = new tau.widget.CircleProgressBar(progressBar);

	            });

	            page.addEventListener( "pagehide", function() {
		        // release object
		        progressBarWidget.destroy();
		    });
             }());
	</script>

### Setting size of widget (option)

If you want change size of widget you can use size option.

Possible values:

- "full"
- "large"
- "medium"
- "small"
- number
