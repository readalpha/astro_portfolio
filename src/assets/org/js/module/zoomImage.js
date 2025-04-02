import extend from "./extend";

export default class ZoomImage{

  constructor( config ){

    const _T = this;

    _T.config = {
      boxClass: 'js-zoomBox',
      imageClass:'js-zoomImage',
      clickStart : true,
      responsiveSettings : [
        {
          width : 999999, //  less than
          zoomType : 'window', // inner or window or false
        },
        {
          width : 960, 
          zoomType : 'inner',
        },
        {
          width : 767, 
          zoomType : 'inner',
        },
      ],
      initializeCallback: element => {
      }
    }
    if( config ) extend( _T.config , config );

    if( document.getElementsByClassName( _T.config.boxClass ) ) _T._initialize();
  }

  _initialize(){
    const _T = this;

    _T.boxes = document.getElementsByClassName( _T.config.boxClass );
    _T.zoomWindow = document.getElementsByClassName('js-zoomWindow')[0];
    _T.zoomingClass = 'add-zooming';
    _T.loadingClass = 'add-zoomloading';
    _T.loadedClass = 'add-zoomloaded';
    _T.zoomableClass = 'add-zoomable';
    _T.hideLayerClass = 'zoomHideLayer';
    _T.zoomLensClass = 'zoomLens';
    _T.zoomFlg = false;
    _T.zoomImgClass = 'zoomImage';
    _T.zoomImgSizes = [];
    _T.zoomType = _T._getZoomType();
    _T._pointerOutEvent = _T._pointerOutEvent.bind(_T);
    _T._zoomElements = _T._zoomElements.bind(_T);
    _T._pointerInEvent = _T._pointerInEvent.bind(_T);
    _T._setZoomElements();
    _T._setEventListener();
  }
  _setEventListener(){

    const _T = this;

    _T._each( ( box , index ) => {
      const ThisElement = box;
      _T._setPointerInEvent( ThisElement , index );
      _T._setPointerOutEvent( ThisElement , index );
      _T._setPointerMoveEvent( ThisElement , index );
    });
  }
  _setPointerMoveEvent( thisElement , index ){

    const _T = this;
    const ThisConfig = _T.zoomImgSizes[ index ];

    thisElement.addEventListener( 'mousemove' , e => {
      _T._pointerMoveEvent( ThisConfig , thisElement , e );
    });
    thisElement.addEventListener( 'touchmove' , e => {
      _T._pointerMoveEvent( ThisConfig , thisElement , e );
    });
  }
  _pointerMoveEvent( thisConfig , thisElement , e ){
    
    const _T = this;

    if( thisConfig.isZoomable && _T.zoomFlg && ( thisElement.className.split(' ').indexOf( _T.zoomingClass ) > -1 ) ){
      e.stopPropagation();
      e.preventDefault();
      switch( _T.zoomType ){
        case 'inner':
          _T._setInnerZoomImagePosition( thisElement , e , thisConfig );
        break;
        case 'window':
          _T._setWindowZoomImagePosition( thisElement , e , thisConfig );
        break;
      }
    }
  }
  _setPointerInEvent( thisElement , index ){

    const _T = this;
    const ThisConfig = _T.zoomImgSizes[ index ];
    
    if( _T.config.clickStart ){
      thisElement.addEventListener( 'click' , e => {

        const Target = e.currentTarget;

        if( !ThisConfig.isZoomable || !_T.zoomType ) return false;
        if( thisElement.className.split(' ').indexOf( _T.zoomingClass ) === -1 ){
          switch( _T.zoomType ){
            case 'inner':
              _T._setInnerZoomImage( Target , index );
              _T._setInnerZoomImagePosition( thisElement , e , ThisConfig );
            break;
            case 'window':
              _T._setWindowZoomImage( Target , index );
              _T._setWindowZoomImagePosition( thisElement , e , ThisConfig );
            break;
          }
          
          thisElement.className += ( ' ' + _T.zoomingClass );
          _T.zoomFlg = true;
        }else{
          switch( _T.zoomType ){
            case 'inner':
              _T._removeInnerZoomImage( Target );
            break;
            case 'window':
              _T._removeWindowZoomImage( Target );
            break;
          }

          thisElement.className = thisElement.className.replace( ' ' + _T.zoomingClass , '' );
          _T.zoomFlg = false;
        }
      });
    }
    else{
      thisElement.addEventListener( 'mouseenter' , _T._pointerInEvent( thisElement , index , thisConfig ) );
      thisElement.addEventListener( 'touchstart' , _T._pointerInEvent( thisElement , index , thisConfig ) );
    }

  }
  _pointerInEvent( thisElement , index , thisConfig ){
    const _T = this;
    return ()=>{
      if( !thisConfig.isZoomable || !_T.zoomType ) return false;
      switch( _T.zoomType ){
        case 'inner':
          _T._setInnerZoomImage( thisElement , index );
        break;
        case 'window':
          _T._setWindowZoomImage( thisElement , index );
        break;
      }
      thisElement.className += ( ' ' + _T.zoomingClass );
      _T.zoomFlg = true;
    }
  }
  _setPointerOutEvent( thisElement ){

    const _T = this;

    thisElement.addEventListener( 'mouseleave' , _T._pointerOutEvent( thisElement ));
    thisElement.addEventListener( 'touchend' ,  _T._pointerOutEvent( thisElement ) );
  }
  _pointerOutEvent( thisElement ){
    const _T = this;
    return () => {
      if( thisElement.className.split(' ').indexOf( _T.zoomingClass ) > -1 ){
        
        switch( _T.zoomType ){
          case 'inner':
            _T._removeInnerZoomImage( thisElement );
          break;
          case 'window':
            _T._removeWindowZoomImage( thisElement );
          break;
        }

        thisElement.className = thisElement.className.replace( ' ' + _T.zoomingClass , '' );
        _T.zoomFlg = false;
      }
    }
  }
  _setZoomElements(){

    const _T = this;

    _T._each( ( box , index ) => {
      const ThisImage = box.getElementsByClassName( _T.config.imageClass )[ 0 ];
      const Config = _T.zoomImgSizes[ index ] = {
        imageSrc : ThisImage.getAttribute( 'src' ),
        zoomSrc : ThisImage.getAttribute( 'data-zoomSrc' ),
        width: null,
        height: null,
        zoomWidth: null,
        zoomHeight: null,
        isZoomable : false,
        isLoaded : false,
        magnification : null,
        aspectRatio : null
      }
      
      const NormalImage = new Image();
      NormalImage.src = Config.imageSrc;
      NormalImage.addEventListener( 'load' , function(){
        _T._setImageSize( ThisImage , Config );
        _T._setIsZoomable( Config , box );
      });

      ThisImage.addEventListener('mouseenter', _T._zoomElements( Config , box , false ) );
      ThisImage.addEventListener('touchstart', _T._zoomElements( Config , box , false ) );

      let resizeTimer = false;
      window.addEventListener('resize', () => {
        if ( resizeTimer !== false ) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout( () => {
          _T._setImageSize( ThisImage , Config );
          _T._setMagnification( Config );
          _T.zoomType = _T._getZoomType();
          resizeTimer = false;
        }, 200 );
      });

    });
  }
  _zoomElements( thisConfig , box , zoomLoadFlg ){

    const _T = this;
    
    return () => {
      if( !_T.zoomType ) return false;        
      if( !zoomLoadFlg ){
        const ZoomImage = new Image();
        ZoomImage.className = _T.zoomImgClass;
        ZoomImage.src = thisConfig.zoomSrc;

        box.className += ' ' + _T.loadingClass;
        
        ZoomImage.addEventListener( 'load' , () => {
          _T._setZoomImageSize( ZoomImage , thisConfig );
          _T._setIsZoomable( thisConfig , box );
          box.className = box.className.replace( ' ' + _T.loadingClass , '' );
          box.className += ' ' + _T.loadedClass;
          
          thisConfig.aspectRatio = ZoomImage.height / ZoomImage.width;
        });
        zoomLoadFlg = true;
      }
    }
  }

  _setInnerZoomImage( thisElement , index ){
    const _T = this;

    const ZoomImage = document.createElement('img');
    ZoomImage.className = _T.zoomImgClass;
    ZoomImage.src = _T.zoomImgSizes[ index ].zoomSrc;
    
    let styles = ZoomImage.style;
    styles.position = 'absolute';
    styles.opacity = 1;        

    thisElement.appendChild( ZoomImage ); 

    ZoomImage.style.opacity = 1;
  }

  _setWindowZoomImage( thisElement , index ){
    const _T = this;

    //zoomwindow
    _T.zoomWindow.style.display = 'block';
    _T.zoomWindow.style.height = _T.zoomWindow.offsetWidth * _T.zoomImgSizes[index].aspectRatio + 'px';
    _T.zoomWindow.style.backgroundImage = 'url(' + _T.zoomImgSizes[index].zoomSrc + ')';
    
    //lens
    const ZoomLens = document.createElement('div');
    ZoomLens.className = _T.zoomLensClass;

    const Styles = ZoomLens.style;
    Styles.position = 'absolute';
    const LensWidth = thisElement.getElementsByClassName( _T.config.imageClass )[0].offsetWidth * ( _T.zoomWindow.offsetWidth / _T.zoomImgSizes[index].zoomWidth );
    Styles.width = LensWidth + 'px';
    Styles.height = LensWidth * _T.zoomImgSizes[index].aspectRatio + 'px';
    Styles.backgroundImage = 'url(' + _T.zoomImgSizes[index].imageSrc + ')';
    Styles.backgroundSize = _T.zoomImgSizes[index].width + 'px';
    Styles.top = 0;
    Styles.left = 0;
    Styles.zIndex = 2;    

    thisElement.appendChild( ZoomLens ); 
    
    //masklayer
    const HideLayer = document.createElement('div');
    HideLayer.className = _T.hideLayerClass;
    
    const Styles2 = HideLayer.style;
    Styles2.position = 'absolute';
    Styles2.backgroundColor = 'rgba(0,0,0,0.5)';
    Styles2.top = '0';        
    Styles2.right = '0';        
    Styles2.bottom = '0';        
    Styles2.left = '0';        
    
    thisElement.appendChild( HideLayer ); 
  }

  _removeInnerZoomImage( thisElement ){
    const _T = this;
    thisElement.removeChild(thisElement.getElementsByClassName( _T.zoomImgClass )[0]);
  }

  _removeWindowZoomImage( thisElement ){
    const _T = this;

    _T.zoomWindow.style.display = 'none';
    thisElement.removeChild(thisElement.getElementsByClassName( _T.hideLayerClass )[0]);
    thisElement.removeChild(thisElement.getElementsByClassName( _T.zoomLensClass )[0]);
  }

  _setInnerZoomImagePosition( thisElement , event , thisConfig ){

    const _T = this;

    const Rect = thisElement.getBoundingClientRect();
    const Left = ( ( ( typeof event.touches === 'undefined' )? event.clientX : event.touches[0].clientX ) - Rect.left ) * ( thisConfig.magnification - 1 ) * -1;
    const Top = ( ( ( typeof event.touches === 'undefined' )? event.clientY : event.touches[0].clientY ) - Rect.top ) * ( thisConfig.magnification - 1 ) * -1;

    thisElement.getElementsByClassName( _T.zoomImgClass )[0].style.left = Left + 'px';
    thisElement.getElementsByClassName( _T.zoomImgClass )[0].style.top = Top + 'px';
  }

  _setWindowZoomImagePosition( thisElement , event , thisConfig ){

    const _T = this;

    const Lens = thisElement.getElementsByClassName( _T.zoomLensClass )[0];

    const Rect = thisElement.getBoundingClientRect();
    const Left = ( ( ( typeof event.touches === 'undefined' )? event.clientX : event.touches[0].clientX ) - Rect.left ) - ( Lens.offsetWidth / 2 );
    const Top = ( ( ( typeof event.touches === 'undefined' )? event.clientY : event.touches[0].clientY ) - Rect.top ) - ( Lens.offsetHeight / 2 );
    //lens
    if( Left < 0 ){
      Left = 0;
    }
    else if( Left > ( thisElement.offsetWidth - Lens.offsetWidth ) ){
      Left = thisElement.offsetWidth - Lens.offsetWidth;
    }
    if( Top < 0 ){
      Top = 0;
    }
    else if( Top > ( thisElement.offsetHeight - Lens.offsetHeight ) ){
      Top = thisElement.offsetHeight - Lens.offsetHeight;
    }
    Lens.style.left = Left + 'px';
    Lens.style.top = Top + 'px';
    Lens.style.backgroundPosition = Left * -1 + 'px' + ' ' + Top * -1 + 'px';

    //window
    _T.zoomWindow.style.backgroundPosition = ( Left * thisConfig.magnification * -1 ) + 'px' + ' ' + ( Top * thisConfig.magnification * -1 ) + 'px';
  }

  _setIsZoomable( thisConfig , element ){

    const _T = this;
    if( thisConfig.isLoaded ){
      thisConfig.isZoomable = true;
      _T._setMagnification( thisConfig );

      element.className += ( ' ' + _T.zoomableClass );
      _T.config.initializeCallback( element );
    }
    else{
      thisConfig.isLoaded = true;
      return false;
    }
  }
  _setMagnification( thisConfig ){
    thisConfig.magnification = thisConfig.zoomWidth / thisConfig.width;
  }
  _setImageSize( thisImage , thisConfig ){
    thisConfig.width = thisImage.width;
    thisConfig.height = thisImage.height;
  }
  _setZoomImageSize( thisImage , thisConfig ){
    thisConfig.zoomWidth = thisImage.width;
    thisConfig.zoomHeight = thisImage.height;
  }
  _each( callback ){

    const _T = this;

    for( let index = 0 ; index < _T.boxes.length ; index++ ){
      callback( _T.boxes[ index ] , index );
    }
  }
  _getZoomType(){

    const _T = this;
    const Width = document.documentElement.clientWidth;
    let type = null;

    for( let index = 0 ; index < _T.config.responsiveSettings.length ; index++ ){
      if( _T.config.responsiveSettings[index].width >= Width ){
        type = _T.config.responsiveSettings[index].zoomType;
      }
    }
    return ( type === null )? 'inner' : type;
  }

  destroy(){
    const _T = this;

    _T.zoomImgSizes = [];
    _T._each( ( box , index ) => {
      
      box.className = box.className.replace( ' ' + _T.zoomableClass , '' );
      box.className = box.className.replace( ' ' + _T.zoomingClass , '' );
      box.className = box.className.replace( ' ' + _T.loadedClass , '' );
      box.className = box.className.replace( ' ' + _T.loadingClass , '' );

      box.outerHTML = box.outerHTML;
      
    });
  }
}