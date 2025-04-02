import extend from "./extend";

export default class visibleCover{

  constructor( dom , config ){

    const _T = this;

    _T.config = { 
      aspect : 0.5625,
      positionType : "fixed",
      topPosition : "0",
      centering : false
    };

    if( config ) extend( _T.config , config );
    
    _T.dom = dom;
    _T.aspect = _T.config.aspect;
    _T.dom.style.position = _T.config.positionType;

    if( _T.config.centering ){
      _T.dom.style.top = '50%';
      _T.dom.style.left = '50%';
      _T.dom.style.transform = 'translateX( -50% ) translateY( -50% )';      
    }
    else{
      _T.dom.style.top = _T.config.topPosition + 'px';
      _T.dom.style.top = '0px';
    }
    
    _T._initialize();
  }

  _getJudgmentDirection(){

    const _T = this;
    
    if( innerWidth * _T.aspect > innerHeight ){
      return "widthChange";
    }
    else{
      return "heightChange";
    }
  }

  _setSize( changeType ){

    const _T = this;
    
    switch( changeType ){
      case "heightChange":
        _T.dom.style.width = innerWidth + "px";
        _T.dom.style.height = innerWidth * _T.aspect + "px";
      break;

      case "widthChange":
        _T.dom.style.width = innerHeight / _T.aspect + "px";
        _T.dom.style.height = innerHeight + "px";
      break;
    }
  }

  _initialize(){

    const _T = this;
    
    _T._setSize( _T._getJudgmentDirection() );

    window.addEventListener( 'resize' , function(){
      _T._setSize( _T._getJudgmentDirection() );
    });
  }

}
