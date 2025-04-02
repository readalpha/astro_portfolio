export default array => {
	let i = array.length;
	while(i){
		const j = Math.floor(Math.random()*i);
		const t = array[--i];
		array[i] = array[j];
		array[j] = t;
	}
	return array;
}
