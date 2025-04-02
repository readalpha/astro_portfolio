export default ( nodeArray , func ) =>{
	Array.prototype.forEach.call( nodeArray , node =>{
		func( node );
	});
}