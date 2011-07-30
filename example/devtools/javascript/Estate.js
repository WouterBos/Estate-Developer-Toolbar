/**
 * @fileOverview Collection of base functionalities. Stripped down for the Developer Tools
 * @author Wouter Bos, web developer at www.estate.nl
 * @since 1.0 - 2010-02-23
 * @version 1.1 - 2010-12-21
 */



if (typeof(Estate) != "undefined") {
	if (typeof (Estate.Develop) != "undefined") {
		throw new Error("Estate object must be loaded only once")
	}
}


 
/**
 * @namespace Root namespace
 * @since 1.0 - 2010-02-23
 * @version 1.1 - 2010-10-10
 */
var Estate = {};











/**
 * @namespace Methods to validate function arguments. Use these methods liberally in all
 *            code that is part of the Estate object.
 * @class
 * @since 1.0 - 2010-02-23
 * @version 1.0 - 2010-02-23
 */		
Estate.Check = ( function() {
	function literalsAreCompatible( mainLiteral, updateLiteral ) {
		for (prop in updateLiteral) {
			if ( typeof(mainLiteral[prop]) == "undefined" ) {
				return "The variable '" + prop + "'in the object literal cannot be merged with the original object literal.";
			}

			if ( typeof(updateLiteral[prop]) != typeof(mainLiteral[prop]) ) {
				return "The variable '" + prop + " is of the wrong type. It is '" + typeof(updateLiteral[prop]) + "' but it should be '" + typeof(mainLiteral[prop]) + "'";
			}
			
			if ( typeof( updateLiteral[prop] ) == "object" && typeof( updateLiteral[prop].tagName ) != "string" ) {
				// Descend down the object tree, but only if it's not a DOM element
				literalsAreCompatible( mainLiteral[prop], updateLiteral[prop] );
			}
		}
	}
	


	/* Start public */
	return {
		/**
		 * Checks if the right amount of arguments are used when calling the function
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-03-22
		 * @param {Number} CurrentArgumentsLength The number of arguments that have been supplied
		 * @param {Number|Number[]} CorrectArgumentsLength The number of arguments that are required
		 * @example
		 * error = Estate.Check.ArgumentsCount( arguments.length, [0, 1] );
		 * if ( error != "" ) throw new Error( error );
		 */
		ArgumentsCount: function(CurrentArgumentsLength, CorrectArgumentsLength) {
			var error
			if (arguments.length != 2) throw new Error("Arguments count must be 2");
			error = Estate.Check.VariableType(CurrentArgumentsLength, "number");
			if (error != "") throw new Error(error);
			
			var CorrectArgumentsCount = false;
			if ( typeof(CorrectArgumentsLength) == "number" ) {
				if ( CurrentArgumentsLength == CorrectArgumentsLength ) {
					CorrectArgumentsCount = true;
				}
			} else if (typeof (CorrectArgumentsLength) == "array" || typeof (CorrectArgumentsLength) == "object") {
				for (var i = 0; i < CorrectArgumentsLength.length; i++) {
					if ( CurrentArgumentsLength == CorrectArgumentsLength[i] ) {
						CorrectArgumentsCount = true
					}
				}
			}
			
			if (CorrectArgumentsCount == false) {
				return "Wrong number of arguments. There argument count should be "+ CorrectArgumentsLength +", but it is "+ CurrentArgumentsLength;
			} else {
				return ""
			}
		},
		
		/**
		 * Checks if an element with a particular id exists
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {String} ElementID The ID of the element that will be checked if it exists.
		 * @param {String} [RequiredTagName] The tagname that the element should have.
		 * @example
		 * error = Estate.Check.ElementById( 'elID', 'div' );
		 * if ( error != "" ) throw new Error( error );
		 */
		ElementById: function( ElementID, RequiredTagName ) {
			if ( typeof( ElementID ) != "string" ) {
				return "Provided element id is not a string but  '"+ typeof( ElementID ) +"'.";
			}
			if ( !document.getElementById(ElementID) ) {
				return "Cannot find HTML element with the id '"+ ElementID +"'";
			}
			if ( arguments.length > 1 && typeof( RequiredTagName ) == "string" ) {
				if ( document.getElementById(ElementID).tagName.toLowerCase() != RequiredTagName && RequiredTagName != "" ) {
					return "HTML element with ID '"+ ElementID +"' has the tagname '"+ document.getElementById(ElementID).tagName +"' but it should be '"+ RequiredTagName +"'";
				}
			}
			return ""
		},

		/**
		 * Checks if the referenced object is an HTML element
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {Object} Element The element that will be checked if it exists.
		 * @example
		 * error = Estate.Check.Element( document.getElementsByTagName('a')[0] );
		 * if ( error != "" ) throw new Error( error );
		 */
		Element: function( Element ) {
			if ( typeof( Element.tagName ) == "undefined" ) {
				return "HTML element expected. Type of checked variable is " + typeof( Element )
			}
			return ""
		},

		/**
		 * Checks if argument is of the expected variable type
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {anything} Variable The variable that will be checked if it has the right type
		 * @param {String} ExpectedVariableType The variable type of the first argument has to be equal to this string
		 * @example
		 * error = Estate.Check.VariableType( id, "string" );
		 * if ( error != "" ) throw new Error( error );
		 */
		VariableType: function( Variable, ExpectedVariableType ) {
			if ( typeof( Variable ) != ExpectedVariableType ) {
				return "Unexpected variable type. There variable type should be "+ ExpectedVariableType +", but it is "+ typeof( Variable );
			}
			return ""
		},

		/**
		 * Returns a value from an object literal. If that vaule does not exist
		 * it will fallback on the value in the old object literal
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {Object} oldVariable
		 * @param {Object} newVariable
		 * @param {String} arrayID Key of the object literal
		 * @example
		 * oLiteral.foo = Estate.Check.SetLiteralIfDefined( oLiteral, oNewLiteral, "foo" )
		 */
		SetLiteralIfDefined: function( oldVariable, newVariable, arrayID ) {
			if ( typeof( newVariable ) == "undefined" ) {
				return oldVariable[arrayID]
			}

			if ( typeof( newVariable[arrayID] ) == "undefined" ) {
				return oldVariable[arrayID]
			} else {
				return newVariable[arrayID]
			}
		},

		/**
		 * Updates object literal. The second argument is merged with the first. Please use
		 * Estate.Check.LiteralUpdatable if you want to be sure that this method
		 * only updates variables and doesn't create new ones.
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {Object} mainLiteral
		 * @param {Object} updateLiteral
		 * @example
		 * Estate.Check.UpdateLiteral( mainLiteral, updatingLiteral )
		 */
		UpdateLiteral: function( mainLiteral, updateLiteral ) {
			for (prop in updateLiteral) {
				mainLiteral[prop] = updateLiteral[prop]
				
				if ( typeof( updateLiteral[prop] ) == "object" && typeof( updateLiteral[prop].tagName ) != "string" ) {
					// Descend down the object tree, but only if it's not a DOM element
					Estate.Check.UpdateLiteral( mainLiteral[prop], updateLiteral[prop] );
				}
			}
		},

		/**
		 * Compares 2 object literals and checks if the 2nd argument can be merged
		 * with the 1st. If there's a variable in the 1st argument that's not
		 * been defined in the 2nd, the function returns the name of the variable.
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {Object} mainLiteral
		 * @param {Object} updateLiteral
		 * @example
		 * error = Estate.Check.LiteralUpdatable( mainLiteral, updatingLiteral );
		 * if ( error != "" ) throw new Error( error );
		 */
		LiteralUpdatable: function( mainLiteral, updateLiteral ) {
			if ( typeof(mainLiteral) != "object") {
				return "Cannot check literals: first argument is not an object"
			}
			if ( typeof(updateLiteral) != "object") {
				return "Cannot check literals: second argument is not an object"
			}
			
			
			var isNotUpdatableVariable = literalsAreCompatible( mainLiteral, updateLiteral )
			
			if ( typeof( isNotUpdatableVariable ) == "undefined" ) {
				return ''
			} else {
				return isNotUpdatableVariable;
			}
		}
	}
	/* End public */
})();






/**
 * @namespace Adds a function to an event of a single element. Use this if
 * you don't want to use jQuery
 * @class
 * @since 1.0 - 2010-02-23
 * @version 1.0 - 2010-02-23
 */
Estate.Events = ( function() {
	/* Start public */
	return {
  		/**
		 * Adds a function to an event of a single element
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {Object} element The element on which the event is placed
		 * @param {Function} newFunction The function that has to be linked to the event
		 * @param {String} eventType Name of the event
		 * @example
		 * Estate.Events.AddEvent( document.getElementById('elementId'), functionName, "onclick" )
		 */
		AddEvent: function( element,
						   	newFunction,
							eventType
							  ) {
			var error;
			error = Estate.Check.VariableType( element, "object" )
			if ( error != "" ) throw new Error( error );
			error = Estate.Check.VariableType( newFunction, "function" )
			if ( error != "" ) throw new Error( error );
			
			
			var oldEvent = eval("element." + eventType);
			var eventContentType = eval("typeof element." + eventType)
			
			if ( eventContentType != 'function' ) {
				eval("element." + eventType + " = newFunction")
			} else {
				eval("element." + eventType + " = function(e) { oldEvent(e); newFunction(e); }")
			}
		}
	}
	/* End public */
})();






/**
 * @namespace Helper methods for placing absolute positioned boxes
 * @class
 * @since 1.0 - 2010-02-23
 * @version 1.0 - 2010-02-23
 */
Estate.Layers = ( function() {
	/* Start public */
	return {
  		/**
		 * Returns the position of the element on the y-axis
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {Object} obj The element on which the event is placed
		 * @example
		 * Estate.Layers.GetPositionX( document.getElementById('elementId') )
		 */
		GetPositionX: function(obj) {
			var error
			error = Estate.Check.Element( obj );
			if ( error != "" ) throw new Error( error );


			var x = 0
			if (obj.offsetParent) {
				while (obj.offsetParent) {
					x += obj.offsetLeft
					obj = obj.offsetParent
				}
			} else 	if (obj.x) {
				x += obj.x
			}
			return x
		},
		
  		/**
		 * Returns the position of the element on the x-axis
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {Object} obj The element on which the event is placed
		 * @example
		 * Estate.Layers.GetPositionX( document.getElementById('elementId') )
		 */
		GetPositionY: function(obj) {
			var error
			error = Estate.Check.Element( obj );
			if ( error != "" ) throw new Error( error );


			var y = 0
			if (obj.offsetParent) {
				while (obj.offsetParent) {
					y += obj.offsetTop
					obj = obj.offsetParent
				}
			} else 	if (obj.y) {
				y += obj.y
			}
			return y
		}
	}
	/* End public */
})();






/**
 * @namespace Some string manipulation methods
 * @class
 * @since 1.0 - 2010-02-23
 * @version 1.0 - 2010-02-23
 */
Estate.StringTools = ( function() {
	function TranslateScrambledAddress( string ) {
		var returnString = "";
		var aCharacters;

		string = string.replace( "scrambled:", "" )
		string = string.substring( 1, (string.length - 1) )
		aCharacters = string.split("][")
		for ( var i = 0; i < aCharacters.length; i++ ) {
			returnString += String.fromCharCode( aCharacters[i] )
		}

		return returnString
	}

	/* Start public */
	return {
		/**
		 * Returns the filename is it exists in the address bar
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @example
		 * var filename = Estate.StringTools.GetFilenameFromUrl()
		 */
		GetFilenameFromUrl: function() {
			var error;
			error = Estate.Check.ArgumentsCount( arguments.length, 0 );
			if ( error != "" ) throw new Error( error );


	        var file_name = document.location.href;
	        var end = ( file_name.indexOf("?") == -1 ) ? file_name.length : file_name.indexOf("?");
	        return file_name.substring( file_name.lastIndexOf("/")+1, end );
		},

		/**
		 * Removes extension from a filename
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {String} eventType Filename with attachment
		 * @example
		 * var filename = Estate.StringTools.GetFilenameFromUrl()
		 */
		GetFilenameWithoutExtension: function( str ) {
			var str = str.replace(/^\s|\s$/g, "");
			if (/\.\w+$/.test(str)) {
				var m = str.match(/([^\/\\]+)\.(\w+)$/);
				if (m)
					return m[1];
				else
					return "no file name";
			} else {
				var m = str.match(/([^\/\\]+)$/);
				if (m)
					return m[1];
				else
					return "no file name";
			}
		},

		/**
		 * Removes measurement unit from a string. So '14px' and '1em' become '14' and '1'
		 *
		 * @since 1.0 - 2010-02-23
		 * @version 1.0 - 2010-02-23
		 * @param {String} SuppliedString
		 * @example
		 * width = Estate.StringTools.RemoveMeasurement( width )
		 */
		RemoveMeasurement: function( SuppliedString ) {
			var error;
			error = Estate.Check.ArgumentsCount( arguments.length, 1 );
			if ( error != "" ) throw new Error( error );
			error = Estate.Check.VariableType( SuppliedString, "string" );
			if ( error != "" ) throw new Error( error );


			var StringWithoutMeasure = SuppliedString
			StringWithoutMeasure = StringWithoutMeasure.replace( "px", "" )
			StringWithoutMeasure = StringWithoutMeasure.replace( "em", "" )
			StringWithoutMeasure = StringWithoutMeasure.replace( "pt", "" )
			
			return StringWithoutMeasure
		},

		/**
		 * Returns the value of a variable in a GET url by supplying its key
		 *
		 * @since 1.0 - 2010-09-29
		 * @version 1.0 - 2010-09-29
		 * @param {String} key The GET key
		 * @param {String} [custom_url] Extract value from supplied url instead of the currently loaded page
		 * @example
		 * value = Estate.StringTools.GetQueryString("foo")
		 * or
		 * value = Estate.StringTools.GetQueryString("foo", "http://www.customdomain.com/index.aspx?foo=bar&foo2=bar2")
		 */
		GetQueryString: function(key, custom_url) {
			error = Estate.Check.ArgumentsCount( arguments.length, [1, 2] );
			if ( error != "" ) throw new Error( error );
			error = Estate.Check.VariableType( key, "string" );
			if ( error != "" ) throw new Error( error );
			if (arguments.length == 2) {
				error = Estate.Check.VariableType( custom_url, "string" );
				if ( error != "" ) throw new Error( error );
			}

			var query
			if (typeof(custom_url) == "string") {
				query = custom_url.substring(custom_url.indexOf('?')+1)
			} else {
				query = window.location.search.substring(1)
			}
			var vars = query.split("&");
			
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split("=");
				if (pair[0] == key) {
					return pair[1];
				}
			}
		}
	}
	/* End public */
})();
