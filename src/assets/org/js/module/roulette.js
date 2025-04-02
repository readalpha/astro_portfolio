import extend from "./extend";
import anime from "npms/animejs";

class Roulette{

    constructor( config ){
        const _T = this;

        _T.config = {
            rouletteNode: document.querySelector( '#roulette' ),
            buttonNode: null,
            duration: 1000,
            rotationalAverage: 10,
            squares: 6,
            easing: 'easeInOutBack',
            progressingDirection: true,
            after:  currentSquares => {
                console.log( currentSquares );
            }
        }

        if( config ) extend( _T.config , config );
        _T._initialize();
    }

    _initialize(){
        const _T = this;

        _T.progressingDirection = _T.config.progressingDirection ? '+=':'+=-';
        _T.currentSquares = 1;
        _T.oneSquares = 360 / _T.config.squares;
        _T.rotationalAverage = 360 * _T.config.rotationalAverage;
        _T.inAnimationClassName = 'in-animation';
        _T.config.buttonNode = _T.config.buttonNode || _T.config.rouletteNode;

        _T.config.buttonNode.addEventListener('click',function(){ 
            
            if( _T.config.rouletteNode.className.match( _T.inAnimationClassName ) ) return false;
            _T._rotationalExecute();
        });
    }

    _getRotationalResult( rotationalFrequency ){
        const _T = this;
        const Result = ( rotationalFrequency - _T.rotationalAverage ) / _T.oneSquares;

        if( _T.config.progressingDirection ){
            _T.currentSquares =  _T.currentSquares - Result + ( ( _T.currentSquares - Result <= 0 )? _T.config.squares: 0 );
        }
        else{
            _T.currentSquares =  _T.currentSquares + Result - ( ( _T.currentSquares + Result > _T.config.squares )? _T.config.squares : 0 );
        }

        return _T.currentSquares;
    }

    _rotationalExecute(){
        const _T = this;
        
        _T.config.rouletteNode.classList.add( _T.inAnimationClassName );
        const RotationalFrequency = _T.rotationalAverage + ( _T.oneSquares * Math.floor( Math.random() * _T.config.squares + 1 ) );

        anime({
            targets: _T.config.rouletteNode,
            rotate: {
                duration: _T.config.duration,
                value: _T.progressingDirection + RotationalFrequency,
                easing: _T.config.easing
            },
            complete: () => {

                _T.config.rouletteNode.classList.remove( _T.inAnimationClassName );                
                _T.config.after( _T._getRotationalResult( RotationalFrequency ) );
            }
        });
    }

}
