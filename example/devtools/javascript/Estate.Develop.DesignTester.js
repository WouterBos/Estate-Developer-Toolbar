/**
 * @fileOverview All code for the Design Tester. It enables the developer to
 * compare the current web page with the original design by placing an image
 * of the design on top of the website.
 * 
 * @author Wouter Bos, web developer at www.estate.nl
 * @since 1.0 - 2008
 * @version 1.1 - 2010-12-21
 * @requires Estate.js
 * @requires Estate.Develop.js
 */





/**
 * @namespace Holds all Design Tester code. It enables the developer to
 * compare the current web page with the original design by placing an image
 * of the design on top of the website.
 */
Estate.Develop.DesignTester = ( function() {
	var config = {
		designAnchor: document.body,
		designImagePath: 'design-images',
		designImageType: 'png',
		designImageCheckUrlOnInit: true,
		xOffset: 0,
		yOffset: 0,
		moveInterval: 10,
		defaultFileName: "index",
		getImageUrl: function() { return "" }
	}
	var offsetCurrent = {
		x: 0,
		y: 0
	}
	var originalPosition = {
		x: 0,
		y: 0
	}
	var menuButton = null;
	var designImage = null;
	var isDesignImagePositioned = false;
	var requestURL = "";
	
	var measurement = {
		box: null,
		x: null,
		xLabel: null,
		xInput: null,
		y: null,
		yLabel: null,
		yInput: null,
		reset: null,
		reposition: null,
		setDesignImage: null
	}
	

	
	// Position the design image
	function positionDesignImage() {
		if (isDesignImagePositioned == false) {
			offsetCurrent.x = Estate.Layers.GetPositionX(config.designAnchor) + config.xOffset
			originalPosition.x = offsetCurrent.x;
			offsetCurrent.y = Estate.Layers.GetPositionY(config.designAnchor) + config.yOffset
			originalPosition.y = offsetCurrent.y;
			designImage.style.left = offsetCurrent.x + 'px'
			designImage.style.top = offsetCurrent.y + 'px'
			measurement.xInput.value = "0"
			measurement.yInput.value = "0"
			isDesignImagePositioned = true
		}
	}
		
	// Move the designImage
	function moveDesignImage() {
		designImage.style.left = offsetCurrent.x +"px"
		designImage.style.top = offsetCurrent.y +"px"
	}
	
	// Show or hide the design image
	function toggleVisibility() {
		if (designImage.style.display == '') {
			designImage.style.display = 'block';
			measurement.box.style.display = 'block';
			positionDesignImage()
			Estate.Develop.DesignTester.CheckImage.Run(requestURL, config, false)
		} else {
			designImage.style.display = '';
			measurement.box.style.display = '';
		}
	}
	
	// Event fired presses the up or down key
	function inputKeyDown(KeyID, axis) {
		if (KeyID == 38 || KeyID == 40) {
			if (axis == "x" && KeyID == 38) {
				offsetCurrent.x++
			}
			if (axis == "x" && KeyID == 40) {
				offsetCurrent.x--
			}
			if (axis == "y" && KeyID == 38) {
				offsetCurrent.y++
			}
			if (axis == "y" && KeyID == 40) {
				offsetCurrent.y--
			}
			
			if (axis == "x") {
				measurement.xInput.value = offsetCurrent.x - originalPosition.x
			}
			if (axis == "y") {
				measurement.yInput.value = offsetCurrent.y - originalPosition.y
			}
			moveDesignImage()
		}
	}

	function inputKeyUp(KeyID, axis) {
		if (KeyID != 38 && KeyID != 40) {
			if (axis == "x") {
				measurement.xInput.value = stripAlphaChars(measurement.xInput.value)
			}
			if (axis == "y") {
				measurement.yInput.value = stripAlphaChars(measurement.yInput.value)
			}
		}
		
		if ((KeyID >= 48 && KeyID <= 57) || KeyID == 0 || KeyID == 8 || KeyID == 109 || KeyID == 46) {
			offsetCurrent.x = parseInt(measurement.xInput.value) + originalPosition.x
			offsetCurrent.y = parseInt(measurement.yInput.value) + originalPosition.y
			moveDesignImage()
		}
	}
	
	function stripAlphaChars(arg_string) {
		var negative = arg_string.indexOf('-') 
		var string = new String(arg_string); 
		string = string.replace(/[^0-9]/g, '');
		if (negative == 0) {
			string = "-" + string
		}
		return string
	}

	
	// Event fired after a key is pressed somewhere on the page
	function pageKeyPress(KeyID) {
		if (KeyID == 92) {
			toggleVisibility()
		}
		
		if (designImage.style.display == "block") {
			if ( KeyID == 91 ) {
				offsetCurrent.x--
			}
			if ( KeyID == 93 ) {
				offsetCurrent.x++
			}
			if ( KeyID == 44 ) {
				offsetCurrent.y--
			}
			if ( KeyID == 46 ) {
				offsetCurrent.y++
			}

			if ( KeyID == 123 ) {
				offsetCurrent.x -= config.moveInterval
			}
			if ( KeyID == 125 ) {
				offsetCurrent.x += config.moveInterval
			}
			if ( KeyID == 60 ) {
				offsetCurrent.y -= config.moveInterval
			}
			if ( KeyID == 62 ) {
				offsetCurrent.y += config.moveInterval
			}
			
			if (KeyID == 91 || KeyID == 93 || KeyID == 123 || KeyID == 125) {
				measurement.xInput.value = offsetCurrent.x - originalPosition.x
			}
			if (KeyID == 44 || KeyID == 46 || KeyID == 60 || KeyID == 62) {
				measurement.yInput.value = offsetCurrent.y - originalPosition.y
			}
			
			if (KeyID == 91 || KeyID == 93 || KeyID == 123 || KeyID == 125 || KeyID == 44 || KeyID == 46 || KeyID == 60 || KeyID == 62) {
				moveDesignImage()
			}
		}
	}
	
	// Set up the structure for the design image and the measurement toolbox
	function addHTML() {
		// Add image that must hold the design
		designImage = document.createElement("img")
		designImage.className = "dev_design";
		Estate.Develop.GetRoot().appendChild(designImage)
		
		// Set drag events to design image
		Estate.Develop.DesignTester.DragDropDesignImage.Init( designImage );
		Estate.Develop.DesignTester.DragDropDesignImage.InitDesignTesterFeedback();
		
		// Create toolbox for changing the x and y values
		measurement.box = document.createElement("div")
		measurement.box.className = "dev_measureBox"
		measurement.x = document.createElement("div")
		measurement.x.className = "dev_axis dev_axisX"
		measurement.xLabel = document.createElement("div")
		measurement.xLabel.className = "dev_label"
		measurement.xInput = document.createElement("input")
		measurement.xInput.value = '0'
		measurement.xInput.className = 'tag_noAutofill'
		measurement.y = document.createElement("div")
		measurement.y.className = "dev_axis dev_axisY"
		measurement.yLabel = document.createElement("div")
		measurement.yLabel.className = "dev_label"
		measurement.yInput = document.createElement("input")
		measurement.yInput.className = 'tag_noAutofill'
		measurement.yInput.value = '0' 
		measurement.reposition = document.createElement("input")
		measurement.reposition.className = "dev_measureReposition"
		measurement.reposition.type = "button"
		measurement.reposition.value = "Reposition"
		measurement.reset = document.createElement("input")
		measurement.reset.className = "dev_measureReset"
		measurement.reset.type = "button"
		measurement.reset.value = "Reset form"
		measurement.setDesignImage = document.createElement("input")
		measurement.setDesignImage.className = "dev_setDesignImage"
		measurement.setDesignImage.type = "button"
		measurement.setDesignImage.value = "Alt image"
		
		
		// Add toolbox to the DOM
		measurement.box.appendChild(measurement.x)
		measurement.x.appendChild(measurement.xInput)
		measurement.x.appendChild(measurement.xLabel)
		measurement.box.appendChild(measurement.y)
		measurement.y.appendChild(measurement.yInput)
		measurement.y.appendChild(measurement.yLabel)
		measurement.box.appendChild(measurement.reset)
		measurement.box.appendChild(measurement.reposition)
		measurement.box.appendChild(measurement.setDesignImage)
		Estate.Develop.GetRoot().appendChild(measurement.box)
		
		// Add events to input boxes
		Estate.Events.AddEvent (
			measurement.xInput,
			function(e) {
				var KeyID = (window.event) ? event.keyCode : e.which;
				inputKeyUp(KeyID, "x")
			},
			"onkeyup"
		)
		Estate.Events.AddEvent (
			measurement.yInput,
			function(e) {
				var KeyID = (window.event) ? event.keyCode : e.which;
				inputKeyUp(KeyID, "y")
			},
			"onkeyup"
		)
		Estate.Events.AddEvent (
			measurement.xInput,
			function(e) {
				var KeyID = (window.event) ? event.keyCode : e.which;
				inputKeyDown(KeyID, "x")
			},
			"onkeydown"
		)
		Estate.Events.AddEvent (
			measurement.yInput,
			function(e) {
				var KeyID = (window.event) ? event.keyCode : e.which;
				inputKeyDown(KeyID, "y")
			},
			"onkeydown"
		)

		// Set value input boxes to 0
		measurement.reset.onclick = function() {
			measurement.xInput.value = "0"
			measurement.yInput.value = "0"
			originalPosition.x = offsetCurrent.x;
			originalPosition.y = offsetCurrent.y;
		}
		
		// Place design on its original position
		measurement.reposition.onclick = function() {
			isDesignImagePositioned = false;
			positionDesignImage();
		}

		// Load alternate design file
		measurement.setDesignImage.onclick = function() {
			var defaultName = "filename." + config.designImageType
			var designImage = window.prompt('Enter the file name of the design image that has to be loaded.', defaultName);
			if (designImage != "" && designImage != defaultName) {
				setDesignImageSource(designImage)
			}
		}
	}
	
	// Autodetect URL to design image by page location path
	function getDesignImageURLByPageLocation() {
		var fileName
		if (document.location.protocol == "file:") {
			// Page is opened directly from filesystem
			var pageFileName = Estate.StringTools.GetFilenameFromUrl()
			fileName = pageFileName.substring(0, pageFileName.lastIndexOf("."));
		} else {
			// Web page runs on a web server
			fileName = document.location.pathname.substring(1)
			fileName = fileName.replace(/\//g, "_")
		}
		
		if (fileName == "") {
			fileName = config.defaultFileName
		}
		requestURL = Estate.Develop.GetDevtoolsPath() + config.designImagePath + "/" + fileName + "." + config.designImageType
		return requestURL
	}
	
	function setDesignImageSource(arg_filename) {
		if (arg_filename != null) {
			// URL to design image is set by simply using the supplied string
			requestURL = Estate.Develop.GetDevtoolsPath() + config.designImagePath + "/" + arg_filename
		} else {
			// Autodetect URL to design image
			var fileName = config.getImageUrl()
			if (fileName != "") {
				// Autodetect URL to design image with custom function
				requestURL = requestURL = Estate.Develop.GetDevtoolsPath() + config.designImagePath + "/" + fileName
			} else {
				requestURL = getDesignImageURLByPageLocation()
			}
		}
		
		Estate.Develop.DesignTester.CheckImage.Run(requestURL, config, true)
		designImage.src = requestURL
	}
	
	
	
	/* START PUBLIC */
	return {
		/**
		 * Sets up the Design Tester
		 * 
		 * @param {Object} newConfig Configuration object.
		 * @param {Object} newConfig.designAnchor Reference to the element that the design image should use as reference for positioning
		 * 		You can pass the reference element with plain JavaScript (document.getElementById('DesignTester')), but also with
		 * 		jQuery: jQuery('#DesignTester').get(0).
		 * @param {String} [newConfig.designImagePath] The path to the directory where the design images are.
		 * @param {String} [newConfig.designImageType] The file extension of the design images eg. "png".
		 * @param {String} [newConfig.xOffset] Used when positioning the design image.
		 * @param {String} [newConfig.yOffset] Used when positioning the design image.
		 * @param {String} [newConfig.moveInterval] Modifier for faster movements.
		 * @param {String} [newConfig.defaultFileName] If no filename is found in the URL (as is the case
		 * 		with homepages), this string will be used a default filename, like "index".
		 * @param {Function} [newConfig.getImageUrl] This function will, when called, return
		 * 		the file name of the design image. This way you can build your own logic on
		 * 		when to use which design file. This function is optional. If no function
		 * 		is provided, or it returns an empty string, the	Design Tester will try to
		 * 		find a design file with a name similar to the location path of the web page.
		 * @example
		 * Estate.Events.AddEvent(
		 * 		window, 
		 * 		function() {
		 * 			var designConfig = {
		 *				designAnchor: document.getElementById('DesignTester'),
		 *				xOffset: 0,
		 *				yOffset: 0,
		 *				getImageUrl: function() {
		 *					return "designImage.jpg"
		 *				}
		 *			}
		 *			Estate.Develop.DesignTester.Init(designConfig)
	 	 * 		},
		 * 		"onload"
		 * )
		 * 
		 * //Load an alternate design file
		 * Estate.Develop.DesignTester.SetOverlayImageFileName('index-login');
		 */
		 Init: function(newConfig) {
			var error 
			error = Estate.Check.ArgumentsCount( arguments.length, [0, 1] );
			if ( error != "" ) throw new Error( error );
			if (newConfig != null) { // Make sure the variable exists
				if (newConfig.type == null) { // Make sure the variable is not an event object
					if (newConfig.designAnchor != null) {
						try {
							error = newConfig.designAnchor.nodeType
						} 
						catch (e) {
							error = "Cannot access supplied design anchor"
						}
					}
					if (error != "" && error != 1) {
						if (typeof(error) == "number") {
							throw new Error('Supplied design anchor is not an HTML element')
						}
						else {
							throw new Error(error)
						}
					}
					error = Estate.Check.LiteralUpdatable(config, newConfig);
					if (error != "") {
						throw new Error(error);
					}
					Estate.Check.UpdateLiteral(config, newConfig, true)
				}
			}
			offsetCurrent.x = config.xOffset
			offsetCurrent.y = config.yOffset
					
			menuButton = Estate.Develop.Menu.AddMenuItem('Design', 'Press "\\"')
			addHTML() // Set up HTML structure
			setDesignImageSource() // Get design image
			
			// Show/hide design image
			menuButton.onclick = function() {
				toggleVisibility()
			}
			
			// Handle global key events
			Estate.Events.AddEvent (
				document,
				function(e) {
					var KeyID = (window.event) ? event.keyCode : e.which;
					pageKeyPress(KeyID)
				},
				"onkeypress"
			)
			
			// Reposition window after a resize
			Estate.Events.AddEvent (
				window,
				function() {
					isDesignImagePositioned = false;
					positionDesignImage()
				},
				"onresize"
			)

		},
		
		/**
		 * Reset image overlay source after a page change, eg an AJAX-action
		 * 
		 * @param {String} filename Name of the design file
		 * @example
		 * Estate.Develop.DesignTester.SetOverlayImageFileName('filename');
		 */
		SetOverlayImageFileName: function( filename ) {
			var error
			error = Estate.Check.ArgumentsCount( arguments.length, 1 );
			if ( error != "" ) throw new Error( error );
			error = Estate.Check.VariableType( filename, "string" );
			if ( error != "" ) throw new Error( error );
			
			designImage.src = Estate.Develop.GetDevtoolsPath() + config.designImagePath + "/" + filename
		},
		
		/**
		 * Finds current position of the design image relative to its anchor and sets value of input fields accordingly
		 * 
		 * @example
		 * Estate.Develop.DesignTester.SetToolboxValues();
		 */
		SetToolboxValues: function() {
			measurement.xInput.value = -(Estate.Layers.GetPositionX(config.designAnchor) - Estate.Layers.GetPositionX(designImage) + config.xOffset)
			measurement.yInput.value = -(Estate.Layers.GetPositionY(config.designAnchor) - Estate.Layers.GetPositionY(designImage) + config.yOffset)
		},
		
		/**
		 * Finds current position of the design image relative to its anchor and sets value of input fields accordingly
		 * 
		 * @example
		 * Estate.Develop.DesignTester.SetOffsetValues();
		 */
		SetOffsetValues: function() {
			offsetCurrent.x = parseInt(measurement.xInput.value) + originalPosition.x
			offsetCurrent.y = parseInt(measurement.yInput.value) + originalPosition.y
		}
	};
	/* END PUBLIC */
})();





/**
 * @namespace Makes the design image draggable
 */
Estate.Develop.DesignTester.DragDropDesignImage = ( function() {
	/* START PRIVATE */
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	var previousX = 0;
	var previousY = 0;
	var dragElement;

	function OnMouseDown(e) {
		if (e == null) { e = window.event; }
		var target = e.target != null ? e.target : e.srcElement;
		
		if ((e.button == 1 && window.event != null || 
			 e.button == 0)) {
			 
			startX = e.clientX;
			startY = e.clientY;
			previousX = startX;
			previousY = startY;
			offsetX = ExtractNumber(target.style.left);
			offsetY = ExtractNumber(target.style.top);
			dragElement = target;
			dragElement.style.cursor = "move";
			
			Estate.Events.AddEvent( document, OnMouseMove, "onmousemove" )
			
			// prevent text selection or image drag
			document.onselectstart = function () { return false; };
			target.ondragstart = function() { return false; };			
			document.body.focus();
			return false;
		}
	}

	function OnMouseMove(e) {
		if (e == null) { e = window.event; }

		dragElement.style.left = (offsetX + e.clientX - startX) + 'px';
		dragElement.style.top = (offsetY + e.clientY - startY) + 'px';

		Estate.Develop.DesignTester.SetToolboxValues();
	}

	function OnMouseUp(e) {
		if (dragElement != null) {
			document.onmousemove = null;
			document.onselectstart = null;
			dragElement.ondragstart = null;
			dragElement.style.cursor = "";
			dragElement = null;
		}
		Estate.Develop.DesignTester.SetOffsetValues();
	}

	function ExtractNumber(value) {
		var n = parseInt(value);		
		return n == null || isNaN(n) ? 0 : n;
	}
	/* END PRIVATE */

	
	
	/* START PUBLIC */
	return {
		Init: function( element ) {
			Estate.Events.AddEvent( element, OnMouseDown, "onmousedown" )
			Estate.Events.AddEvent( element, OnMouseUp, "onmouseup" )
		},
		
		InitDesignTesterFeedback: function( OverlayStartX, OverlayStartY ) {
			DesignTesterFeedback = true;
			var startX = OverlayStartX;
			var startY = OverlayStartY;
		}
	}
})();






/**
 * @namespace Checks if design image actually exists and shows an error message
 * in the tracebox if that's not the case
 */
Estate.Develop.DesignTester.CheckImage = ( function() {
	// Create ajax object
	var oRequest;
	if (window.XMLHttpRequest) {
		oRequest = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		oRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
	var lastUrlChecked = ""
	
	// Show error message if the ajax request for the design image failed.
	function feedback( url ) {
		if (oRequest.readyState == 4) { // only if req is "loaded"
			if (oRequest.status != 200 && oRequest.status != 304) {
				if (document.location.protocol == "http:" || document.location.protocol == "https:") {
					dlog(
						oRequest.status + " " + oRequest.statusText.toLowerCase() +". Cannot find design image\n" + url
					)
				}
			}
		}
	}

	
	
	/* START PUBLIC */
	return {
		/**
		 * Runs the check if a design image exists 
		 * 
		 * @example
		 * Estate.Develop.DesignTester.CheckImage.Run()
		 */
		Run: function(url, config, firstRun) {
			if (config.designImageCheckUrlOnInit == true && firstRun == true) {
				if (url != lastUrlChecked) {
					lastUrlChecked = url
					try {
						oRequest.onreadystatechange = function(){
							feedback(url);
						};
						oRequest.open("GET", url, true);
						oRequest.send("");
					} 
					catch (e) {
					//
					}
				}
			}
		}
	}
	/* END PUBLIC */
})();
