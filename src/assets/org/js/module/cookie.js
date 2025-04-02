export default class Cookie{

  /**
   *
   * ** cookieの追加、削除 ** *
   *
   * how to use / importname.set( 値 , 期間( 経過ms ) , 有効パス ); /
   * how to use / importname.get( ); /
   * how to use / importname.delete( ); /

   *期間の設定例
   let now = new Date().getTime();
   let clear = new Date( now + ( 60 * 60 * 24 * 1000 * expires ));
   let expires = clear.toGMTString();
  */
  static set( cookieName , cookieValue , expires , path ){
    document.cookie = cookieName + "=" + escape( cookieValue ) + ";path=" + ( ( path )? path : "/" )  + ";expires=" + expires;
  }

  static get( cookieName ){

    if ( document.cookie ) {
      const Cookies = document.cookie.split("; ");

      for (let index = 0 ; index < Cookies.length ; index++ ){

        const CookieArray = Cookies[index].split("=");
        if( CookieArray[0] === cookieName ) return CookieArray[1];
      }
    }
    return false;
  }

  static delete( cookieName ){

    if ( document.cookie ) {
      const Now = new Date();
      const Clear = new Date( Now - ( 60 * 60 * 24 * 1000 ) );
      const Expires = Clear.toGMTString();

      document.cookie = cookieName + "=;path=/;expires=" + Expires;
      return true;
    }
    return false;
  }
}