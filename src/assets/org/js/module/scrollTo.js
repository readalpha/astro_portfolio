import extend from 'modules/extend';

const Eases = {
    linear : (t, b, c, d) => {
        return c * t / d + b;
    },
    easeInQuad : (t, b, c, d) => {
        t /= d;
        return c*t*t + b;
    },
    easeOutQuad : (t, b, c, d) => {
        t /= d;
        return -c * t*(t-2) + b;
    },
    easeInOutQuad : (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    },
    easeInCubic : (t, b, c, d) => {
        t /= d;
        return c*t*t*t + b;
    },
    easeOutCubic : (t, b, c, d) => {
        t /= d;
        t--;
        return c*(t*t*t + 1) + b;
    },
    easeInOutCubic : (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    },
    easeInQuart : (t, b, c, d) => {
        t /= d;
        return c*t*t*t*t + b;
    },
    easeOutQuart : (t, b, c, d) => {
        t /= d;
        t--;
        return -c * (t*t*t*t - 1) + b;
    },
    easeInOutQuart : (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t + b;
        t -= 2;
        return -c/2 * (t*t*t*t - 2) + b;
    },
    easeInQuint : (t, b, c, d) => {
        t /= d;
        return c*t*t*t*t*t + b;
    },
    easeOutQuint : (t, b, c, d) => {
        t /= d;
        t--;
        return c*(t*t*t*t*t + 1) + b;
    },
    easeInOutQuint : (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t*t*t + 2) + b;
    },
    easeInSine : (t, b, c, d) => {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine : (t, b, c, d) => {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine : (t, b, c, d) => {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
    easeInExpo : (t, b, c, d) => {
        return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
    },
    easeOutExpo : (t, b, c, d) => {
        return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
    },
    easeInOutExpo : (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
        t--;
        return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
    },
    easeInCirc : (t, b, c, d) => {
        t /= d;
        return -c * (Math.sqrt(1 - t*t) - 1) + b;
    },
    easeOutCirc : (t, b, c, d) => {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t*t) + b;
    },
    easeInOutCirc : (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        t -= 2;
        return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
    }
}

export default ( config ) => {
    
    const Config = {
        target : null,
        durationTime : 1000 ,
        easing : 'linear',
        headerPadding : null,
        reference : window
    }
    if( config ) extend( Config , config );
    const HeaderHeight = Config.headerPadding || 0;
    const Ease = Config.easing;
    const WindowOffset = Config.reference === window ? pageYOffset : Config.reference.scrollTop;
    const BeginTime = new Date() - 0;
    const TargetOffset = ( Config.target )? Config.target.getBoundingClientRect().top + WindowOffset - HeaderHeight : 0;
    const Distance = WindowOffset - TargetOffset;
    const Timer = setInterval(()=>{
        let current = new Date() - BeginTime;
        if ( current > Config.durationTime ) {
        clearInterval( Timer );
            current = Config.durationTime;
        }
        let currentOffset = WindowOffset + Eases[ Ease ]( current , 0 , ( Distance * ( current / Config.durationTime ) ) * -1 , Config.durationTime );
        Config.reference === window ? Config.reference.scrollTo( 0 , currentOffset ) : Config.reference.scrollTop = currentOffset;
    } , 16 );
}