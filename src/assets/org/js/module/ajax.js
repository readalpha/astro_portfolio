import extend from "./extend";

export default class Ajax{

  /*
   * data はオブジェクトで渡す( ex: { test="test" , test2="test2" } )
   */
  constructor( config ){

    this.request = new XMLHttpRequest();
    this.config = {
      method: "GET",
      relativepath: null,
      data: null,
      asyncmode: true,
      success: ()=>{},
      failed: ()=>{},
      loaded: ()=>{}
    }

    if( config ) extend( this.config , config );

    this._execute();
  }

  _execute(){

    const _T = this;
    const Req = this.request;
    const Config = this.config;

    Req.onreadystatechange = () => {
      if ( Req.readyState == 4 ) { // 通信の完了時
        if ( Req.status == 200 ) { // 通信の成功時
          Config.success( Req.responseText , Req.statusText , Req.status );
        }
        else{
          Config.failed( Req.statusText , Req.status );
        }
      }
    }
    Req.onload = () => {
      Config.loaded();
    }

    Req.open( Config.method , ( Config.method === "POST" )? Config.relativepath : Config.relativepath + "?" + _T._dataEncode( Config.data ) , Config.asyncmode );
    if( Config.method === "POST" ) Req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');//POST通信の場合このheader情報が必要
    Req.send( ( Config.method === "POST" )? _T._dataEncode( Config.data ) : null );

  }

  _dataEncode( data ){
    const Params = [];

    for( let name in data ){
      const Value = data[ name ];
      const Param = encodeURIComponent( name ) + '=' + encodeURIComponent( Value );
      Params.push( Param );
    }
    return Params.join( '&' ).replace( /%20/g, '+' );
  }
}