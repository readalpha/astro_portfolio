export default class Dom{
	
	constructor( dom ){

		if( !dom ) return false;
		this.dom = ( typeof dom === 'string' )? document.querySelectorAll( dom ) : dom;
	}

	html( htmlDocument ){

		let _t = this;
		let innerHtml;

		_t._each( _t.dom , function( thisNode ){
			if( htmlDocument ){
				thisNode.innerHTML = htmlDocument;
			}
			else{
				innerHtml = thisNode.innerHTML;
			}
		});

		return innerHtml ? innerHtml : _t;
	}

	outerHtml( htmlDocument ){

		let _t = this;
		let outerHtml;

		_t._each( _t.dom , function( thisNode ){
			if( htmlDocument ){
				thisNode.outerHTML = htmlDocument;
			}
			else{
				outerHtml = thisNode.outerHTML;
			}
		});

		return outerHtml ? outerHtml : _t;

	}

	text( text ){

		let _t = this;
		let textContent;

		_t._each( _t.dom , function( thisNode ){
			if( text ){
				thisNode.textContent = text;
			}
			else{
				textContent = thisNode.textContent;
			}
		});

		return textContent ? textContent : _t;

	}

	css( keys , property ){

		let _t = this;
		let styleProperty;
		
		_t._each( _t.dom , function( thisNode ){
			if( typeof keys === "object" ){

				Object.keys( keys ).forEach( function( key ){
					thisNode[ "style" ][ key ] = this[ key ];
				} , keys );
			}
			else{
				if( !property ){
					let style = thisNode.currentStyle || window.getComputedStyle( thisNode );
					style = style[ keys ];
					if( style === 'auto' ){
						switch( keys ){
							case 'width':
								style = String( thisNode.offsetWidth );
							break;
							case 'height':
								style = String( thisNode.offsetHeight );							
							break;
						}
					}
					styleProperty = thisNode[ "style" ][ keys ] || style;
				}
				else{
					thisNode[ "style" ][ keys ] = property;
				}
			}
		});


		return styleProperty ? styleProperty : _t;
	}

	attr( attributename , value ){

		let _t = this;
		let valueProperty;

		_t._each( _t.dom , function( thisNode ){
			if( value ){
				thisNode.setAttribute( attributename , value );
			}
			else{
				valueProperty = thisNode.getAttribute( attributename );
			}
		});

		return valueProperty ? valueProperty : _t;
	}

	val( value ){

		let _t = this;
		let valueProperty;

		_t._each( _t.dom , function( thisNode ){
			if( value ){
				thisNode.setAttribute( "value" , value );
			}
			else{
				valueProperty = thisNode.getAttribute( "value" );
			}
		});

		return valueProperty ? valueProperty : _t;

	}

	addEvent( eventtype , callback , boolean ){

		let _t = this;

		_t._each( _t.dom , function( thisNode ){

			thisNode.addEventListener(
				eventtype ,
				callback ,
				boolean || false
			);
		});

		return _t;
	}

	hasClass( classname ){

		let _t = this;
		let flag;

		_t._each( _t.dom , function( thisNode ){

			let classArray = thisNode.className.split(' ');
			flag = classArray.indexOf( classname ) >= 0;
		});

		return flag;
	}

	addClass( classname ){

		let _t = this;

		_t._each( _t.dom , function( thisNode ){

			let classArray = thisNode.className.split(' ');
			let index = classArray.indexOf( classname );

			if( index === -1 ){
				classArray.push( classname );
				thisNode.className = _t._trim( classArray.join(' ') );
			}
		});

		return _t;
	}

	removeClass( classname ){

		let _t = this;

		_t._each( _t.dom , function( thisNode ){
			let classArray = thisNode.className.split(' ');
			let index = classArray.indexOf( classname );
			if( index >= 0 ){
				classArray.splice( index , 1 );
				thisNode.className = _t._trim( classArray.join(' ') );
			}
		});

		return _t;
	}

	toggleClass( classname ){

		let _t = this;

		_t._each( _t.dom , function( thisNode ){

			let classArray = thisNode.className.split(' ');
			let index = classArray.indexOf( classname );

			if( index >= 0 ){
				classArray.splice( index , 1 );
			}
			else{
				classArray.push( classname );
			}

			thisNode.className = _t._trim( classArray.join(' ') );

		});

		return _t;
	}

	append( appendNode ){

		let _t = this;

		_t._each( _t.dom , function( thisNode ){
			thisNode.appendChild( appendNode );
		});
		return _t;
	}

	preppend( preppendNode ){

		let _t = this;

		_t._each( _t.dom , function( thisNode ){
			thisNode.insertBefore( preppendNode , thisNode.firstChild );
		});
		return _t;
	}

	children(){    

		let _t = this;
		let childNodes;

		_t._each( _t.dom , function( thisNode ){
			childNodes = ( thisNode.children.length )? thisNode.children : false;
		});
		return childNodes;
	}

	parent(){    
		let _t = this;
		let parentNode;

		_t._each( _t.dom , function( thisNode ){
			parentNode = thisNode.parentNode;
		});
		return parentNode;
	}

	eq( index ){    

		let _t = this;
		_t.dom = ( _t.dom.length )? _t.dom[ index ] : _t.dom;

		return _t;
	}

	size(){

		let _t = this;
		let length = _t.dom.length || 0;
	
		return length;
	}

	clones(){

		let _t = this;
		let cloneArray = [];

		_t._each( _t.dom , function( thisNode ){
			cloneArray.push( thisNode.cloneNode( true ) );
		});
		return cloneArray;
	}

	offset(){

		let _t = this;
		let positionObject = {};

		_t._each( _t.dom , function( thisNode ){
			positionObject.left = thisNode.getBoundingClientRect().left + pageXOffset;
			positionObject.top = thisNode.getBoundingClientRect().top + pageYOffset;
		});

		return positionObject;
	}

	each( callback ){

		let _t = this;

		if( _t.dom.length ){

			for( let index = 0 ; index < _t.dom.length ; index++ ){
				callback( _t.dom[ index ] , index );
			}
		}
		else{
			callback( _t.dom , 0 );
		}

		return _t;
	}

	_each( dom , callback ){
		let _t = this;

		if( dom.length ){
			for( let index = 0 ; index < dom.length ; index++ ){
				callback( dom[  index ] );
			}
		}
		else{
			callback( dom );
		}
	}

	_trim( string ){
		return string.replace( /^\s+|\s+$/g , '' );
	}

}