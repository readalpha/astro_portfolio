
export default ( dest , source ) => {
    for ( let property in source ) {
        dest[property] = source[property];
    }
    return dest;
}