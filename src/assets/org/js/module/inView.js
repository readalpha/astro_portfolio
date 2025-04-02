import extend from "./extend";
export default class InView{
  constructor( config ){
    const _T = this;
    _T.config = {
      elemment: document.getElementsByClassName( 'js-inView' ),
      reference : window,
      className: "add-inView",
      visibleType: 'top', // String [ top , middle , bottom ] or Number
      responsive: false,
      reverse: false,
      callback: ()=>{}
    }
    _T._execute = _T._execute.bind( _T );
    _T.count = 0;
    if( config ) extend( _T.config , config );
    if( _T.config.elemment ) _T._initialize();;
  }
  _initialize(){
    const _T = this;
    _T._execute();
    _T.config.reference.addEventListener( 'scroll' , _T._execute );
    _T.config.reference.addEventListener( 'resize' , _T._execute );
  }
  _dispose(){
    const _T = this;
    _T.config.reference.removeEventListener( 'scroll' , _T._execute );
    _T.config.reference.removeEventListener( 'resize' , _T._execute );
  }
  _execute(){
    const _T = this;
    for( let index = 0 ; index < _T._getElemmentLength() ; index++ ){
      _T._jadgeInView( _T.config.elemment[ index ] );
    }
  }
  _getElemmentLength(){
    return this.config.elemment.length;
  }
  _hasClass( thisObject ){
    return ( thisObject.className.split(' ').indexOf( this.config.className ) !== -1  );
  }
  _getReferenceOffset(){
    return this.config.reference === window ? window.pageYOffset : this.config.reference.scrollTop;
  }
  _getThisOffset( thisObject , visibleType ){
    const Offset = thisObject.getBoundingClientRect().top + this._getReferenceOffset();
    let range = ( typeof visibleType === 'number' )? visibleType : 0;
    if( visibleType === 'middle' ){
      range = ( thisObject.offsetHeight / 2 );
    }
    else if( visibleType === 'bottom' ){
      range = thisObject.offsetHeight;
    }
    return ( Offset + range );
  }
  _jadgeInView( thisObject ){
    const _T = this;
    const Offset = _T._getThisOffset( thisObject , _T.config.visibleType );
    if( _T._getReferenceOffset() + innerHeight >= Offset ){
      if( !_T._hasClass( thisObject ) ){
        thisObject.className += ( ' ' + _T.config.className );
        thisObject.className = thisObject.className.replace( /^\s|\s$/g , '' );
        _T.config.callback( thisObject );
        if( !_T.config.reverse ){
          _T.count++;
          if( _T._getElemmentLength() === _T.count ) _T._dispose();
        }
      }
    }
    else{
      if( _T.config.reverse ){
        if( _T._hasClass( thisObject ) ){
          const DeleteClass = ' ' + thisObject.className + ' ';
          thisObject.className = ( DeleteClass.replace( ' ' + _T.config.className + ' ' , '' ).replace( /^\s|\s$/g , '' ) );
          _T.config.callback( thisObject );
        }
      }
    }
  }
}