import dom from 'modules/dom';
import extend from 'modules/extend';

/*
** html template **

* common *
<ul class="colorbox-thumList">
	<li>
		<a></a>
	</li>
</ul>

** popup **
<div class="colorbox-wrap">
	<div class="colorbox-inner">
		<ul class="colorbox-popList">
			<li>
				<div>
					<img data-image="{image url}">
				</div>
			</li>
		</ul>
	</div>
</div>
*/

export default class Colorbox{

	constructor( config, options ){

		let _t = this;

		_t.config = {
			mode: 'popup', // slideshow
			// click要素（サムネイル）のリスト
			thumbnailList: '.colorbox-thumbList',
			
			// popup領域
			popupWrapper: '.colorbox-wrap',
			popupInner: '.colorbox-inner',
			popupList: '.colorbox-popList',

			width: false,
			height: false,
			speed: 400,			// resizeする時のloading時間(ms)
			slide: true,		// Next, Prev機能を付ける場合はtrue
			loop: true,			// 最後から先頭に移動する場合はtrue

			callbacks: {
				onOpen: ()=>{},		// 最初に開いた直後
				onChange: ()=>{},	// next prevで切り替えた直後
				onClosed: ()=>{}	// 閉じた直後
			}
		}

		_t.options = {
			thumbnailItem: '.colorbox-thumbItem',	// thumbnnailList直下のアイテムclass
			thumbnailLink: '.colorbox-thumbLink',	// thumbnnailItem直下のリンクclass
			popupItem: '.colorbox-popItem',			// popupアイテムに割り当てられるclass名
			popupBox: '.colorbox-contentBox',		// slideshowの時にimgが入るboxのclass名
			background:'.colorbox-bg',				// 背景に割り当てられるclass名
			datasetName: 'itemindex',				// サムネイルに割り当てられる連番のdataset名
			buttons: {
				buttonBox: '.colorbox-buttonBox',	 // buttonのwrapper
				closeBtn: '.colorbox_btn-close',
				prevBtn: '.colorbox_btn-prev',
				nextBtn: '.colorbox_btn-next',
			},
			classes: {
				open: 'add-open',
				load: 'add-loading',
				active: 'add-active',
			},
			initialWidth: 100,
			initialHeight: 300,
		}

		if( config ) extend( _t.config, config );
		if( options ) extend( _t.options, options );

		_t.popupHeight = '';
		_t.popupWidth = '';
		_t.index = '';
		_t.wrap = '';
		_t.popup = '';
		_t.len = '';
		_t.elements;
		_t.currentImg;
		_t.lastImage;

		_t.wrapper;
		_t.inner;
		_t.box;

		switch( _t.config.mode ) {
			case "popup":
				_t.initialize();
				_t.setOptions();
				_t.setInitialSize();
				_t.setEvents();

				break;
			case "slideshow":
				_t.initialize();
				_t.setSlideIndex();
				_t.setOptions();
				_t.setEvents();

				break;
		}

	}

	initialize() {
		let _t = this;

		let regClass = new RegExp(/^\./);
		let regId = new RegExp(/^#/);
		let obj = new Object();

		let wrapper;

		if( _t.config.mode === 'slideshow' ) {
			_t.wrapper = document.createElement('div');
			_t.inner = document.createElement('div');
			_t.box = document.createElement('div');

			_t.wrapper.className = _t.replaceInitial( _t.config.popupWrapper );
			_t.inner.className = _t.replaceInitial( _t.config.popupInner );
			_t.box.className = 'colorbox-contentBox';

			_t.wrapper.appendChild(_t.inner).appendChild(_t.box);
			document.querySelectorAll( _t.config.thumbnailList )[0].parentNode.appendChild(_t.wrapper)

			_t.wrap = new dom( _t.config.popupWrapper + ' ' + _t.config.popupInner );
		}

		// set wrapper status
		wrapper = document.querySelectorAll( _t.config.popupWrapper )[0];
		wrapper.setAttribute("role", "dialog");
		wrapper.setAttribute("aria-hidden", "true");

		// set buttons
		obj['buttonBox'] = document.createElement('div');
		obj['closeBtn'] = document.createElement('button');
		obj['nextBtn'] = document.createElement('button');
		obj['prevBtn'] = document.createElement('button');

		let buttons = _t.options.buttons;
		let result = Object.keys(buttons).filter((key) => {
			return key;
		});

		for( let i = 0; i < result.length; i++ ) {
			if( regClass.test(_t.options.buttons[result[i]]) && !regId.test(_t.options.buttons[result[i]]) ) {
				obj[result[i]].className = _t.replaceInitial(_t.options.buttons[result[i]]);
			} else {
				obj[result[i]].id = _t.replaceInitial(_t.options.buttons[result[i]]);
			}
		}

		obj['buttonBox'].appendChild(obj['closeBtn']);
		if( _t.config.slide ) {
			obj['buttonBox'].appendChild(obj['nextBtn']);
			obj['buttonBox'].appendChild(obj['prevBtn']);
		}

		new dom( _t.config.popupWrapper + ' ' + _t.config.popupInner ).append( obj['buttonBox'] );

		//set background
		obj['background'] = document.createElement('div');
		if( regClass.test(_t.options.background) && !regId.test(_t.options.background) ) {
			obj['background'].className = _t.replaceInitial(_t.options.background);
		} else {
			obj['background'].id = _t.replaceInitial(_t.options.background);
		}

		new dom( _t.config.popupWrapper ).preppend( obj['background'] );
	}
	
	setOptions() {
		let _t = this;

		let thumbEl = new dom( _t.config.thumbnailList ).dom;
		let thumbChild = '';
		let thumbItemClass = _t.replaceInitial(_t.options.thumbnailItem);
		let thumbLinkClass = _t.replaceInitial(_t.options.thumbnailLink);
		let innerEl = new dom( _t.config.popupInner ).dom;

		if( _t.config.mode === "popup" ) {
			let popupEl = new dom( _t.config.popupList ).dom;
			let popupChild = '';
			let popItemClass = _t.replaceInitial(_t.options.popupItem);

			for( let j = 0; j < thumbEl.length; j++ ) {

				thumbEl[j].setAttribute( 'data-colorbox', j );
				innerEl[j].setAttribute( 'data-colorbox', j );
				thumbChild = thumbEl[j].children;
				popupChild = popupEl[j].children;

				for( let i = 0; i < thumbChild.length; i++ ) {
					let link = thumbChild[i].getElementsByTagName('a')[0];
					
					thumbChild[i].classList.add(thumbItemClass);
					link.classList.add(thumbLinkClass);
					link.setAttribute( 'data-' + _t.options.datasetName , i);

					popupChild[i].classList.add( popItemClass );
				}
			}

			_t.popup = document.querySelectorAll(_t.options.popupItem);
		}

		if( _t.config.mode === "slideshow") {

			for( let j = 0; j < thumbEl.length; j++ ) {

				thumbEl[j].setAttribute( 'data-colorbox', j );
				innerEl[j].setAttribute( 'data-colorbox', j );
				thumbChild = thumbEl[j].children;

				for( let i = 0; i < thumbChild.length; i++ ) {
					let link = thumbChild[i].getElementsByTagName('a')[0];
					
					thumbChild[i].classList.add(thumbItemClass);
					link.classList.add(thumbLinkClass);
					link.setAttribute( 'data-' + _t.options.datasetName , i);
				}
			}
		}
		_t.wrap = new dom( _t.config.popupWrapper + ' ' + _t.config.popupInner );
		_t.len = document.querySelectorAll(_t.options.thumbnailItem).length;

		if( _t.config.mode === "slideshow") {
			new dom( '.colorbox-totalIndex' ).text( _t.len );
		}
	}

	setInitialSize() {
		let _t = this;

		_t.wrap.css( 'width', _t.adjustSizeUnit(_t.options.initialWidth) );
		_t.wrap.css( 'height', _t.adjustSizeUnit(_t.options.initialHeight) );
	}

	setEvents(){
		let _t = this;
		
		_t.wrap.css('transition', _t.config.speed + 'ms');

		// open 
		new dom( _t.options.thumbnailLink ).addEvent( 'click', function(e) {

			_t.index = Number(this.getAttribute( 'data-' + _t.options.datasetName ));
			_t.wrap.addClass( _t.options.classes['load'] );

			_t.change();

			new dom( _t.config.popupWrapper ).addClass( _t.options.classes['open'] );

			_t.config.callbacks['onOpen']();
		});

		// close
		new dom( _t.options.buttons['closeBtn'] ).addEvent( 'click', function() {
			_t.click_close();
		});
		new dom( _t.options.background ).addEvent( 'click', function() {
			_t.click_close();
		});

		if( _t.config.slide ) {
			// next
			new dom( _t.options.buttons['nextBtn'] ).addEvent( 'click', function(e) {
				_t.click_next(e);
			});

			// prev
			new dom( _t.options.buttons['prevBtn'] ).addEvent( 'click', function(e) {
				_t.click_prev(e);
			});
		}
	}

	setSlideIndex() {
		let boxHtml = document.createElement('div');
		boxHtml.className = 'colorbox-indexBox';
		boxHtml.innerHTML = 'image <span class="colorbox-currentIndex"></span> of <span class="colorbox-totalIndex"></span>';
		
		new dom( '.colorbox-inner' ).append( boxHtml );
	}
	
	click_close() {
		let _t = this;

		new dom( _t.config.popupWrapper ).removeClass( _t.options.classes['open'] );
		
		if( _t.config.mode === "popup" ) {

			new dom( _t.options.popupItem ).removeClass( _t.options.classes['active'] );

		}

		_t.config.callbacks['onClosed']();

		_t.setInitialSize();
	}

	click_next() {
		let _t = this;
			
		if( _t.config.loop ) {
			_t.clickFnc();

			_t.index = ++_t.index % _t.len;

			_t.change();
			_t.config.callbacks['onChange']();
		} else {
			if( _t.index < _t.len - 1 ) {
				_t.clickFnc();
				// new dom( _t.options.buttons['prevBtn'] ).removeClass( 'disabled' );

				_t.index++;

				_t.change();
				_t.config.callbacks['onChange']();
				// if ( _t.index == _t.len - 1 ) {
				// 	new dom( _t.options.buttons['nextBtn'] ).addClass( 'disabled' );
				// }
			}
		}
	}

	click_prev() {
		let _t = this;

		if( _t.config.loop ) {
			_t.clickFnc();

			if( _t.index > 0 ) {
				_t.index--;
			} else {
				_t.index = _t.len - 1;
			}

			_t.change();
			_t.config.callbacks['onChange']();
		} else {
			if( _t.index > 0 ) {
				_t.clickFnc();
				// new dom( _t.options.buttons['nextBtn'] ).removeClass( 'disabled' );

				_t.index--;

				_t.change();
				_t.config.callbacks['onChange']();
				// if( _t.index === 0 ) {
				// 	new dom( _t.options.buttons['prevBtn'] ).addClass( 'disabled' );
				// }
			}
		}
	}

	clickFnc() {
		let _t = this;

		if( _t.config.mode === "popup" ) {

			_t.popup[_t.index].classList.remove( _t.options.classes['active'] );

		}
	}

	change(index) {
		let _t = this;

		_t.index = index ? index : _t.index; 

		if( _t.config.mode === "popup" ) {

			if( !_t.popup[_t.index].imgloaded ) {

				_t.wrap.addClass( _t.options.classes['load'] );

				_t.elements = _t.popup[_t.index].getElementsByTagName('img');

				for( let i = 0; i < _t.elements.length; i++ ) {
					_t.elements[i].src = _t.elements[i].dataset.image;
				}

				_t.popup[_t.index].imgloaded = true;

				let callback = function() {
					setTimeout( function() {

						_t.wrap.removeClass( _t.options.classes['load'] );
						
					}, _t.config.speed);

					_t.resize();

				}

				_t.imageLoadChecker(_t.elements, callback);

			} else {

				setTimeout( function() {
					_t.wrap.removeClass( _t.options.classes['load'] );
				}, _t.config.speed);
			}
			
			_t.popup[_t.index].classList.add( _t.options.classes['active'] );

			_t.resize();

		} else if(_t.config.mode === "slideshow" ) {

			let elem = _t.box.childNodes[0];
			let img = new Image();
			let targetThumb = document.querySelectorAll( _t.options.thumbnailItem )[_t.index];

			img.alt = "";
			img.src = targetThumb.querySelectorAll( _t.options.thumbnailLink )[0].getAttribute( 'data-itemimg' );

			_t.currentImg = img;

			_t.resize();

			_t.box.appendChild(img);
			if( elem ) _t.box.removeChild(elem);

			new dom( '.colorbox-currentIndex' ).text( _t.index + 1 );
		}

	}

	imageLoadChecker(elem, callback) {
		let len = elem.length;
		let imgLoader = function(num) {
			let cnt = 0;
			return function() {
				if( ++cnt >= num ) {
					callback();
				}
			};
		}

		let loader = imgLoader(len);

		for( let i = 0; i < len; i++ ) {
			elem[i].onload = loader;
		}

	}

	resize() {
		let _t = this;

		if( _t.config.mode === "popup" ) {

			if ( _t.popupHeight !== _t.popup[_t.index].children[0].clientHeight || _t.popupWidth !== _t.popup[_t.index].children[0].clientWidth ) {

				_t.wrap.addClass( _t.options.classes['load'] );
				
				_t.popupHeight = _t.config.height ? _t.config.height : _t.popup[_t.index].children[0].clientHeight;
				_t.popupWidth = _t.config.width ? _t.config.width : _t.popup[_t.index].children[0].clientWidth;

				setTimeout( function() {
					_t.wrap.removeClass( _t.options.classes['load'] );
				}, _t.config.speed);

			}

		} else if( _t.config.mode === "slideshow" ) {

			let inner = document.querySelectorAll('.colorbox-inner')[0];
			if ( inner.clientHeight !== _t.currentImg.height || inner.clientWidth !== _t.currentImg.width ) {
				_t.wrap.addClass( _t.options.classes['load'] );

				_t.popupHeight = _t.config.height ? _t.config.height : _t.currentImg.height;
				_t.popupWidth = _t.config.width ? _t.config.width : _t.currentImg.width;


				setTimeout( function() {
					_t.wrap.removeClass( _t.options.classes['load'] );
				}, _t.config.speed);
			}
		}
		_t.wrap.css( 'width', _t.adjustSizeUnit( _t.popupWidth ));
		_t.wrap.css( 'height', _t.adjustSizeUnit( _t.popupHeight ));

	}

	reload() {
		let _t = this;

		// 再定義
		_t.wrap = new dom( _t.config.popupWrapper + ' ' + _t.config.popupInner );
		_t.len = document.querySelectorAll(_t.options.thumbnailItem).length;

		if(_t.config.mode === "popup") {
			_t.popup = document.querySelectorAll(_t.options.popupItem);
		}

		_t.setOptions();

		new dom( _t.options.thumbnailLink ).addEvent( 'click', function() {
			_t.index = Number(this.getAttribute( 'data-' + _t.options.datasetName ));
			_t.wrap.addClass( _t.options.classes['load'] );
			new dom( _t.config.popupWrapper ).addClass( _t.options.classes['open'] );

			_t.change();
			_t.config.callbacks['onOpen']();
		});

	}

	replaceInitial(elem) {
		return elem.replace(/^\.|#/g, '');
	}
	adjustSizeUnit(num) {
		return Number(num) ? num + 'px': num;
	}

}
