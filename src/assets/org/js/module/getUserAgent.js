export default class GetUserAgent{
  constructor(){
    this._ua = navigator.userAgent.toLowerCase();
    this._objects = {};
    this._initialize();

    return this._objects;
  }
  _initialize(){
    this._objects = {
      isIe : null,
      isIe11 : null,
      isEdge : null,
      isChrome : null,
      isSafari : null,
      isFirefox : null,
      isMobile : null,
      isIphone : null,
      isAndroidPhone : null,
      isTablet : null,
      isIpad : null,
      isAndroidTablet : null,
    }
    for ( const key in this._objects ) {
      this._objects[ key ] = this[ `_${ key }` ]();
    }
  }
  _isIe(){
    return this._ua.indexOf('msie') !== -1 || this._isIe11();
  }
  _isIe11(){
    return this._ua.indexOf('trident') !== -1;
  }
  _isEdge(){
    return this._ua.indexOf('edge') !== -1;
  }
  _isChrome(){
    return !this._isEdge() && this._ua.indexOf('chrome') !== -1;
  }
  _isSafari(){
    return !this._isChrome() && this._ua.indexOf('safari') !== -1;
  }
  _isFirefox(){
    return this._ua.indexOf('firefox') !== -1;
  }
  _isMobile(){
    return this._isIphone() || this._isAndroidPhone();
  }
  _isIphone(){
    return this._ua.indexOf('iphone') !== -1;
  }
  _isAndroidPhone(){
    return this._ua.indexOf('android') !== -1 && this._ua.indexOf('mobile') !== -1;
  }
  _isTablet(){
    return this._isIpad() || this._isAndroidTablet();
  }
  _isIpad(){
    return this._ua.indexOf('ipad') !== -1 || this._ua.indexOf('macintosh') !== -1 && 'ontouchend' in document;
  }
  _isAndroidTablet(){
    return this._ua.indexOf('android') !== -1 && this._ua.indexOf('mobile') === -1;
  }
}