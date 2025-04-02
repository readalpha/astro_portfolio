import extend from "./extend";

export default class getScrollBetweenProgress{
  constructor( config ){

    const _t = this;
    
    _t.config = {
      startOffset : 0,
      endOffset : document.body.offsetHeight - innerHeight,
      callback : ()=>{}
    }
    if( config ) extend( _t.config , config );

    _t._requestAnimationFrame = _t._requestAnimationFrame.bind( _t )
    _t.cancelFlg = false;

    _t.execute();
  }

  execute(){
    const _t = this;

    _t.cancelFlg = false;
    requestAnimationFrame( _t._requestAnimationFrame );
  }

  _requestAnimationFrame(){
    const _t = this;
    _t.config.callback( _t._getOffsetProgress() );

    _t.cancelFlg ? cancelAnimationFrame( _t._requestAnimationFrame ) : requestAnimationFrame( _t._requestAnimationFrame );
  }

  _getOffsetProgress(){
    const _t = this;

    let progress = ( pageYOffset - _t.config.startOffset ) / ( _t.config.endOffset - _t.config.startOffset );
    if( progress > 1 ){
      progress = 1;
    }
    else if( progress < 0 ){
      progress = 0;
    }
    return progress;
  }

  updateConfig( config ){
    const _t = this;
    if( config ) extend( _t.config , config );
  }

  dispose(){
    const _t = this;
    _t.cancelFlg = true;
  }
}