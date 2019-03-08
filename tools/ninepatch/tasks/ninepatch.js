module.exports = function( grunt ) {
	var fs = require('fs'),
		path = require("path"),
		async = require("async"),
		chalk = require('chalk'),
		Canvas = require('canvas'),
		Image = Canvas.Image;

	function findRange( imageData ) {
		var length = imageData.length,
			i, from=0, to=0;

		for ( i=3; i < length; i+=4 ) {
			if ( !from && imageData[i] === 255 ) {
				from = (i - 3) / 4;
			} else if ( from && !to && imageData[i] === 0 ) {
				to = ( (i - 3) / 4 ) - 1;
				break;
			}
		}

		return {
			from: from,
			to: to
		};
	}

	function getPadding ( image, context ) {
		var width = image.width - 2,
			height = image.height -2,
			horizontalContentRange = findRange( context.getImageData(0, image.height-1, image.width, 1).data ),
			verticalContentRange = findRange( context.getImageData(image.width-1, 0, 1, image.height).data );

		return [
			verticalContentRange.from - 1,
			width - horizontalContentRange.to,
			height - verticalContentRange.to,
			horizontalContentRange.from -1
		];
	}

	function getPaddingText ( image, context ) {
		var padding = getPadding( image, context ),
			sum = padding.reduce(function(pv, cv) { return pv + cv; }, 0),
			css = "";

		if ( sum ) {
			css = "padding: ";
			padding.forEach(function( p ) {
				css += p + "px ";
			});
			css += ";";
		}

		return css;
	}

	function getBorderImageSlice ( image, context ) {
		var width = image.width - 2,
			height = image.height -2,
			horizontalScaleRange = findRange( context.getImageData(0, 0, image.width, 1).data ),
			verticalScaleRange = findRange( context.getImageData(0, 0, 1, image.height).data );

		return [
			verticalScaleRange.from - 1,
			width - horizontalScaleRange.to,
			height - verticalScaleRange.to,
			horizontalScaleRange.from - 1,
		];
	}

	function getBorderImageSliceText ( image, context, imagePath ) {
		var slice = getBorderImageSlice( image, context ),
			css = [
				"border-image-repeat: repeat;",
				"border-image-width: auto;",
				"border-image-source: url(" + imagePath + ");",
				"border-image-slice: " + slice.join(" ") + " fill;"
			];

		return css.join(" ");
	}

	grunt.registerMultiTask( "ninepatch", "Create image files and less.", function() {
		var done = this.async(),
			_ = grunt.util._,
			options = _.clone( this.options({
				out: "./9-patch.less"
			})),
			lessFile = options.out,
			files = [];

		this.files.forEach(function( file ) {
			var sources = file.src,
			dest = file.dest;

			sources.forEach(function(src) {
				files.push({
					src: src,
					dest: dest
				});
			});
		});

		grunt.file.write( lessFile, "" );

		async.eachSeries( files, function ( file, next ) {
			var src = file.src,
				dest = file.dest,
				fileName = src.replace(/.*\/([^\/]*)\.9(\.\w+)/,"$1$2"),
				outFile = path.join( dest, fileName ),
				orgImage, canvas, ctx, relativePath, img, css;

			grunt.log.debug( "Building '" + src + "' -> '" + dest + "/" + fileName + "'" );

			orgImage = fs.readFileSync(src);
			img = new Image();
			img.src = orgImage;

			canvas = new Canvas(img.width, img.height);
			ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, img.width, img.height);

			relativePath = path.relative( path.dirname(options.out), outFile );

			// write less file.
			css = [
				"." + fileName.replace(/([^\/]*)\.\w+/,"$1") + "() {",
				getPaddingText( img, ctx ),
				getBorderImageSliceText( img, ctx, relativePath),
				"}",
				"\n"
			].join(" ");

			// write less file.
			fs.appendFileSync(lessFile, css );

			// write image file. sdfasef
			canvas = new Canvas(img.width-2, img.height-2);
			ctx = canvas.getContext('2d');
			ctx.drawImage(img, -1, -1);

			grunt.file.mkdir(dest);
			fs.writeFileSync( outFile, canvas.toBuffer() )
			grunt.log.writeln( "File '" + chalk.cyan(outFile) + "' created." );

			next();

		}, function( err ) {
			if( err ) {
				grunt.fail.warn( err );
				done( false );
			} else {
				grunt.log.oklns("Success nine-patch build.");
				done();
			}
		});
	});
};