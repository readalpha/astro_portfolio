import dom from "modules/dom";
import extend from "modules/extend";

export default class PriceBar{
/**
 *   <div id="js-priceBar" class="plp-priceBarBox">
 *      <span id="js-priceMinBtn" class="plp-priceBox_inline mod-min js-filterElement"></span>
 *       <span id="js-priceMaxBtn" class="plp-priceBox_inline mod-max js-filterElement"></span>
 *   </div>
 *   <div class="plp-priceInputBox">
 *       <div class="plp-priceInputInner">
 *           <span id="js-priceMinBox" class="plp-priceInputBox_inline">0</span>~<span id="js-priceMaxBox" class="plp-priceInputBox_inline">100000</span>
 *       </div>
 *   </div>
 */
  constructor( config ){

    let _t = this;

    _t.config = {
      wrap : '#js-priceBar',
      cursorMin : '#js-priceMinBtn',
      cursorMax : '#js-priceMaxBtn',
      priceBoxMin : '#js-priceMinBox',
      priceBoxMax : '#js-priceMaxBox',
      priceMin : 500,
      priceMax : 100000,
      callBack : ()=>{

      }
    }
    if( config ) extend( _t.config , config );

    if( document.querySelector(_t.config.wrap) ) _t.initialize();
  }

  initialize(){

    let _t = this;

    _t.priceBar = new dom( _t.config.wrap );
    _t.priceMinBtn = new dom( _t.config.cursorMin );
    _t.priceMaxBtn = new dom( _t.config.cursorMax );
    _t.priceMinBox = new dom( _t.config.priceBoxMin );
    _t.priceMaxBox = new dom( _t.config.priceBoxMax );
    _t.startEvent = _t.startEvent.bind( _t );
    _t.moveEvent = _t.moveEvent.bind( _t );
    _t.endEvent = _t.endEvent.bind( _t );
    _t.body = document.body; 
    _t.baseWidth = null;
    _t.startPosition = null;
    _t.targetCursor = null;
    _t.targetBox = null;
    _t.siblingCursorPosition = null;
    _t.currentTarget = null;
    _t.priceLength = _t.config.priceMax / _t.config.priceMin;
    _t.oneStepPercent = 100 / _t.priceLength;

    //値によってカーソルの初期位置を移動
    let currentMinPercent = parseInt( _t.priceMinBox.text() ) / _t.config.priceMax;
    let currentMaxPercent = parseInt( _t.priceMaxBox.text() ) / _t.config.priceMax;
    _t.priceMinBtn.css('left', ( ( currentMinPercent )? currentMinPercent * 100 : 0 ) + '%' ); 
    _t.priceMaxBtn.css('left', ( ( currentMaxPercent )? currentMaxPercent * 100 : 0 ) + '%' ); 
  
    _t.execute();
  }

  execute(){

    let _t = this;

    _t.priceBar.addEvent('mousedown', _t.startEvent );
    _t.priceBar.addEvent('touchstart', _t.startEvent );
    
  }

  startEvent( e ){

    e.preventDefault();
    let _t = this;
    let clientX = ( e.type === 'touchstart' )? e.changedTouches[0].clientX : e.clientX;
    
    _t.startPosition = ( e.type === 'touchstart' )? e.changedTouches[0].pageX : e.pageX;
    _t.baseWidth = _t.priceBar.dom[0].offsetWidth;
    _t.barPosition = clientX - e.currentTarget.getBoundingClientRect().left;
    _t.currentTarget = _t.getTargetCursor( clientX - e.currentTarget.getBoundingClientRect().left , _t.priceMinBtn.dom[0].offsetLeft , _t.priceMaxBtn.dom[0].offsetLeft );
    
    if( _t.currentTarget === 'min' ){
      _t.targetCursor = _t.priceMinBtn;
      _t.targetBox = _t.priceMinBox;
      _t.siblingCursorPosition = _t.priceMaxBtn.css('left');    
    }
    else{
      _t.targetCursor = _t.priceMaxBtn;
      _t.targetBox = _t.priceMaxBox;  
      _t.siblingCursorPosition = _t.priceMinBtn.css('left');    
    }
    
    _t.targetCursor.css( 'left' , _t.getCursorPosition( _t.barPosition , _t.baseWidth ) );
    _t.targetBox.text( String( _t.getPriceValue( _t.barPosition , _t.baseWidth ) ) );

    _t.body.addEventListener( 'mousemove' , _t.moveEvent );
    _t.body.addEventListener( 'mouseup' , _t.endEvent );    
    _t.body.addEventListener( 'touchmove' , _t.moveEvent );
    _t.body.addEventListener( 'touchend' , _t.endEvent );    
  }
  moveEvent( e ){
    e.preventDefault();

    let _t = this;
    let pageX = ( e.type === 'touchmove' )? Math.round( e.touches[0].pageX ) : e.pageX;
    
    let left = _t.getCursorPosition(  pageX - _t.startPosition + _t.barPosition , _t.baseWidth );
    let value = String( _t.getPriceValue( pageX - _t.startPosition + _t.barPosition , _t.baseWidth ) );
    
    if( _t.currentTarget === 'min' ){
      if( parseInt( _t.siblingCursorPosition.replace('%','') ) < parseInt( left.replace('%','') ) ){
        left = _t.siblingCursorPosition;
        value = _t.priceMaxBox.text();
      }
    }
    else{
      if( parseInt( _t.siblingCursorPosition.replace('%','') ) > parseInt( left.replace('%','') ) ){
        left = _t.siblingCursorPosition;
        value = _t.priceMinBox.text();
      }      
    }
    _t.targetCursor.css( 'left' , left );
    _t.targetBox.text( value );
  }
  endEvent(){
    let _t = this;
    _t.body.removeEventListener( 'mousemove' , _t.moveEvent );
    _t.body.removeEventListener( 'mouseup' , _t.endEvent );    
    _t.body.removeEventListener( 'touchmove' , _t.moveEvent );
    _t.body.removeEventListener( 'touchend' , _t.endEvent );    

    _t.config.callBack({
      min : Number( _t.priceMinBox.text() ),
      max : Number( _t.priceMaxBox.text() )
    });
  }

  getTargetCursor( barOffset , cursorMinOffset , cursorMaxOffset ){

    let _t = this;
    let cursorMin = ( barOffset - cursorMinOffset < 0 )? ( barOffset - cursorMinOffset ) * -1 : barOffset - cursorMinOffset;
    let cursorMax = ( barOffset - cursorMaxOffset < 0 )? ( barOffset - cursorMaxOffset ) * -1 : barOffset - cursorMaxOffset;

    if( cursorMin === cursorMax ){
      return ( barOffset >= cursorMinOffset )? 'max' : 'min';
    }
    else{
      return ( cursorMin < cursorMax )? 'min' : 'max';
    }

  }
  getCursorPosition( barOffset , barWidth ){

    let position = ( Math.floor( ( barOffset / barWidth ) * 1000 ) / 10 );

    if( position < 0 ){
      position = 0;
    }
    else if( position > 100 ){
      position = 100;
    }    
    return ( position + '%' );
  }
  getPriceValue( barOffset , barWidth ){

    let _t = this;  
    let ceil = Math.ceil(( Math.floor( ( barOffset / barWidth ) * 1000 ) / 10 / _t.oneStepPercent ));
    let price = _t.config.priceMin * ceil;
    
    if( price < _t.config.priceMin ){
      price = 0;
    }
    else if( price > _t.config.priceMax ){
      price = _t.config.priceMax;
    }

    return price;
  }
  setValue( min , max ){
    let _t = this;  
    _t.priceMinBox.text( min );
    _t.priceMaxBox.text( max );
  }

}