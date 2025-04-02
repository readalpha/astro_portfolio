import extend from 'modules/extend';

export default class Progress{
    constructor( config ){
        const _T = this;
        _T.config = {
            durationTime : 1000,
            update : ( progress )=>{

            }
        }
        if( config ) _T.config = extend( _T.config , config );
        _T.currentTime = 0;
        _T._updateProgress = _T._updateProgress.bind(_T);
        _T.start = _T.start.bind(_T);
        _T.stop = _T.stop.bind(_T);
        _T.restart = _T.restart.bind(_T);
        _T.counter;
    }
    _updateProgress(){
        const _T = this;
        _T.currentTime += 10;
        const Progress = _T.currentTime >= _T.config.durationTime ? 100 : ( _T.currentTime / _T.config.durationTime ) * 100;
        _T.config.update( Progress );
    }
    start(){
        const _T = this;
        _T.counter = setInterval( _T._updateProgress , 10 );
    }
    stop(){
        clearInterval( this.counter );
    }
    restart(){
        const _T = this;        
        _T.currentTime = 0;
        _T.stop();
        _T.start();
    }
    updateOptions( config ){
        const _T = this;        
        _T.config = extend( _T.config , config );
    }
} 
