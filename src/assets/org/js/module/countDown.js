import extend from 'modules/extend';

export default class CountDown{

    constructor( config ){
        this.config = {
            date : ( new Date( 2020, 0, 1, 0, 0, 0 ) ).getTime(), // [ 年 , 月(0始まり) , 日 , 時 , 分 , 秒 ]
            updateCallback : ()=>{
                //この中で第一引数をとれば残り時間( 日 , 時 , 分 , 秒 )の入ったオブジェクトが取得できる
            },
            endCallback : ()=>{
                //カウントダウン終わった後の処理
            }       
        }
        if( config ) extend( this.config , config );

        //時差を計算し、加算代入
        this.config.date += ( new Date() ).getTimezoneOffset() * 60000;

        this._execute();
    }

    _execute(){

        const _T = this;

        _T.timer = setInterval( ()=> {
            if( _T.config.date < _T._getCurrentTime() ){
                _T.destroy();
                return
            }
            _T.config.updateCallback( _T._getDifferenceTime() );
        } , 1000 );
    }

    _getCurrentTime(){
        return ( new Date() ).getTime() + ( new Date() ).getTimezoneOffset() * 60000;
    }

    _getDifferenceTime(){

        const _T = this;

        const Dates = {};
            
        const DifferenceSecond = ( _T.config.date - _T._getCurrentTime() ) / 1000;

        Dates.day = _T._getDefferenceDay( DifferenceSecond );
        Dates.hour = _T._getDefferenceHour( DifferenceSecond , Dates.day );
        Dates.minute = _T._getDefferenceMinute( DifferenceSecond );
        Dates.second = _T._getDefferenceSecond( DifferenceSecond );
                
        return Dates;
    }

    _getDefferenceDay( differenceSecond ){
        return Math.floor( differenceSecond / 86400 );
    }
    _getDefferenceDaySecond( day ){
        return ( day !== 0 )? day * 86400 : 0;
    }
    _getDefferenceHour( differenceSecond , differenceDay ){
        const _T = this;
        return Math.floor( ( differenceSecond - _T._getDefferenceDaySecond( differenceDay ) ) / 3600 );
    }
    _getDefferenceMinute( differenceSecond ){
        return Math.floor( differenceSecond / 60 ) % 60;
    }
    _getDefferenceSecond( differenceSecond ){
        return Math.floor( differenceSecond ) % 60 % 60;
    }

    destroy(){

        const _T = this;
        
        clearInterval( _T.timer );
        _T.config.endCallback();        
    }

}