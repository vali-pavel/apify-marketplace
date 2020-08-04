module.exports.validateInput = (input) => {
    const { keyword } = input;
    if(!keyword) {
        throw new Error('The keyword field is missing from input.');
    } else if(typeof keyword !== 'string') {
        throw new Error(`Invalid value added to the keyword field.
            Expected: string
            Received: ${typeof keyword}`
        );
    }
}
