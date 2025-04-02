import extend from 'modules/extend';

export default class OverflowMenu{
        
    constructor( config ){
        const _T = this;

        _T.config = {
            box : document.getElementById('js-box'),
            menu : document.getElementById('js-menu'),
            menuItem : document.getElementsByClassName('js-menuItem'),
            activeClass : 'add-active',
            endTransitionTime : '.5s',
            mode : 'center', // smooth or center or left or right
            items : '110px', // @string px or number( 表示したい個数 , centerの時に偶数だと-1される )
            centerPadding : 50,//px指定の時は無効 , 奇数でcenterだとあんまり意味ない
            initialize : ()=>{},
            beforeSlideChange : ()=>{},
            afterSlideChange : ()=>{}
        }
        if( config ) extend( _T.config , config );

        _T.body = document.body;
        _T._setBasePosition = _T._setBasePosition.bind(_T);
        _T._setCurrentPosition = _T._setCurrentPosition.bind(_T);
        _T._dispose = _T._dispose.bind(_T);
        _T._setEachSize = _T._setEachSize.bind(_T);
        _T._setActivePosition = _T._setActivePosition.bind(_T);
        _T._setResizeEvent = _T._setResizeEvent.bind(_T);
        _T.basePosition = 0;
        _T.currentPositionIndex = 0;
        _T.resizeTimer = false;
        _T.clickTime = 100;

        _T._initialize();
    }

    _initialize(){

        const _T = this;

        //iosの対策で空イベントをadd
        document.addEventListener('touchstart', () => {});        
        
        _T._setEachSize();
        _T._setDisableDefaultAnchor();

        window.addEventListener('resize',_T._setResizeEvent);

        _T.config.box.addEventListener('mousedown',_T._setBasePosition);
        _T.config.box.addEventListener('touchstart',_T._setBasePosition);

        _T.config.box.style.position = 'relative';
        _T.config.box.style.overflowX = 'hidden';
        _T.config.menu.style.position = 'absolute';
        _T.config.menu.style.left = '0px';
        _T.config.menu.style.overflowX = 'hidden';
        _T.config.menu.style.top = '0px';

        _T._setActivePosition();

        _T.config._initialize( _T._getFirstActiveIndex() );        
    }

    _setResizeEvent(){
        const _T = this;

        if (_T.resizeTimer !== false) {
            clearTimeout( _T.resizeTimer );
        }
        _T.resizeTimer = setTimeout( () => {
            _T._setEachSize();
            _T._setActivePosition( _T.currentPositionIndex );
        }, 300)
    }

    _setEachSize(){
        const _T = this;

        _T.clientCenter = _T.config.box.offsetWidth/ 2;
        if( typeof _T.config.items === 'string' && _T.config.items.match('px') ){
            _T.menuWidth = Number( _T.config.items.replace('px','') );
        }
        else{
            _T.menuWidth = Math.round( ( _T.config.box.offsetWidth - _T.config.centerPadding * 2 ) / _T.config.items );
        }

        if( !_T.config.responsive || ( _T.config.responsive && innerWidth < _T.config.switchWidth )) {
            
            _T.offsetCapacityMin = _T.clientCenter - _T.menuWidth / 2;
            _T.offsetCapacityMax = _T.clientCenter + _T.menuWidth / 2;

            for( let index = 0; index < _T.config.menuItem.length; index++ ){
                _T.config.menuItem[ index ].style.width = _T.menuWidth + 'px';
                _T.config.menuItem[ index ].style.float = 'left';

                if( index === _T.config.menuItem.length - 1 ){
                    _T.config.menu.style.width = _T.config.menuItem[0].offsetWidth * _T.config.menuItem.length + 'px';
                }
            }
        } else {

            _T.offsetCapacityMin = '';
            _T.offsetCapacityMax = '';

        }
            
    }

    _setDisableDefaultAnchor(){//chrome対策でリンクを無効に
        const _T = this;

        if( !_T.config.box.getElementsByTagName('a').length ) return false;

        const ChildLink = _T.config.box.getElementsByTagName('a');

        for( let index = 0 ; index < ChildLink.length ; index++ ){
            let startTime = 0;
            let endTime = 0;
            let startPosition = 0;

            ChildLink[index].addEventListener('click', e => {
                e.preventDefault();
            });
            ChildLink[index].addEventListener('mousedown', e => {
                e.preventDefault();
                startTime = Math.floor(Date.now());
                startPosition = _T._getCurrentMenuPosition();
            });
            ChildLink[index].addEventListener('mouseup', e => {
                e.preventDefault();
                endTime = Math.floor(Date.now());
                const Difference = startPosition - _T._getCurrentMenuPosition();
                
                if( endTime - startTime <= _T.clickTime && ( Difference <= 50 && Difference >= -50 ) ){
                    location.href = e.currentTarget.href;
                }
            });
            ChildLink[index].addEventListener('touchstart', e => {
                e.preventDefault();
                startTime = Math.floor(Date.now());
                startPosition = _T._getCurrentMenuPosition();                    
            });
            ChildLink[index].addEventListener('touchend', e => {
                e.preventDefault();
                endTime = Math.floor(Date.now());
                const Difference = startPosition - _T._getCurrentMenuPosition();

                if( endTime - startTime <= _T.clickTime && ( Difference <= 50 && Difference >= -50 ) ){
                    location.href = e.currentTarget.href;
                }
            });    
        }
    }

    _setActivePosition( index , boolean ){

        const _T = this;

        _T.config.beforeSlideChange( _T.currentPositionIndex );
        
        _T.currentPositionIndex = ( typeof index !== 'undefined' )? index : _T._getFirstActiveIndex();
        if( _T.currentPositionIndex === 0 || innerWidth > _T.menuWidth * _T.config.menuItem.length ){
            _T.config.menu.style.left = '0px';
        }
        else{

            let adjustment = 0;
            if( _T.config.mode === 'right' ){
                adjustment = _T.menuWidth / 2 * -1;
            }
            else if( _T.config.mode === 'left' ){
                adjustment = _T.menuWidth / 2;
            }
        
            const EndPosition = ( _T.menuWidth * _T.currentPositionIndex - _T.offsetCapacityMin + adjustment ) * -1;
            const MaxPosition = ( _T.menuWidth * _T.config.menuItem.length - _T.config.box.clientWidth ) * -1;
            if( EndPosition < MaxPosition ){
                _T.config.menu.style.left = MaxPosition + 'px';
            }
            else if( EndPosition > 0 ){
                _T.config.menu.style.left = '0px';
            }
            else{
                if( typeof index === 'undefined' || _T.config.mode !== 'smooth' || boolean ) _T.config.menu.style.left = EndPosition + 'px';
            }
                
        }

        _T.config.afterSlideChange( _T.currentPositionIndex );
        
    }

    _getFirstActiveIndex(){
        const _T = this;
        for( let index = 0; index < _T.config.menuItem.length; index++ ){
            if( _T.config.menuItem[ index ].className.split(' ').indexOf( _T.config.activeClass ) > 0 ) return index;
        }
        return 0;
    }

    _setBasePosition(e){
        const _T = this;
        _T.basePosition = Math.round( ( e.type === 'touchstart' )? e.touches[0].clientX : e.clientX );
        _T.mousedownFlag = true;
        _T.config.menu.style.webkitTransition = '';
        _T.config.menu.style.transition = '';

        _T.body.addEventListener( 'touchmove' , _T._setCurrentPosition);
        _T.body.addEventListener( 'touchend' , _T._dispose);
        _T.body.addEventListener( 'mousemove' , _T._setCurrentPosition);
        _T.body.addEventListener( 'mouseup' , _T._dispose);
    }
    _setCurrentPosition(e){
        const _T = this;   

        _T.body.classList.add( _T.movingClass );
        
        _T.config.menu.style.left = _T._getMathPosition(e);
        _T.basePosition = Math.round( ( e.type === 'touchmove' )? e.touches[0].clientX : e.clientX );
    }

    _getCurrentMenuPosition(){
        return Number( this.config.menu.style.left.replace('px','') );
    }
    _getMathPosition(e){
        const _T = this;
        return _T._getCurrentMenuPosition() - ( _T.basePosition - Math.round( ( e.type === 'touchmove' )? e.touches[0].clientX : e.clientX ) ) + 'px';
    }
    _getActiveIndex(){

        const _T = this;
        let activeIndex = 0;

        _T.config.menu.style.WebkitTransition = _T.config.endTransitionTime;
        _T.config.menu.style.transition = _T.config.endTransitionTime;

        if( _T._getCurrentMenuPosition() < 0 ){
            
            for( let index = 1; index < _T.config.menuItem.length; index++ ){
                let currentMenuOffset = _T.config.menuItem[ index ].getBoundingClientRect().left + pageXOffset + _T.menuWidth / 2;
                if( currentMenuOffset <= _T.offsetCapacityMax && currentMenuOffset >= _T.offsetCapacityMin  ){
                    activeIndex = index;
                    break;
                }
                else if( _T.config.menuItem.length - 1 === index ){
                    activeIndex = index;
                }                     
            }

        }
        return activeIndex;
    }

    _dispose(){

        const _T = this;
        _T._setActivePosition( _T._getActiveIndex() );

        setTimeout( function(){
            _T.body.classList.remove( _T.movingClass );           
        } , ( _T.clickTime + 1 ) );

        _T.body.removeEventListener('touchmove',_T._setCurrentPosition);
        _T.body.removeEventListener('touchend',_T._dispose);
        _T.body.removeEventListener('mousemove',_T._setCurrentPosition);
        _T.body.removeEventListener('mouseup',_T._dispose);
    }

    setAnyPosition( index ){
        const _T = this;

        _T.config.menu.style.WebkitTransition = _T.config.endTransitionTime;
        _T.config.menu.style.transition = _T.config.endTransitionTime;

        _T._setActivePosition( index , true );
    }
    destroy(){
        const _T = this;
        _T.config.box.removeEventListener('mousedown',_T._setBasePosition);
        _T.config.box.removeEventListener('touchstart',_T._setBasePosition);
        window.removeEventListener('resize',_T._setResizeEvent);
        _T.config.box.style = {};
        _T.config.menu.style = {};
        _T.config.menuItem.style = {};
        for( let index = 0; index < _T.config.menuItem.length; index++ ){
            _T.config.menuItem[index].style = {};
        }
    }

}
