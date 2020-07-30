const typeCheck = require('type-check').typeCheck;

module.exports.validateInput = (input) => {
    const INPUT_TYPE = `{
        memory: Number,
        useClient: Boolean,
        fields: [String],
        maxItems: Number,
    }`;

    const CUSTOM_TYPES = {
        customTypes: {
            Even: {
                typeOf: 'Number',
                validate: function(number) {
                    return (number != 1) && ((number & (number - 1)) == 0);
                }
            }
        }
    }

    if (!typeCheck(INPUT_TYPE, input)) {
        console.log('Expected input:');
        console.log(INPUT_TYPE);
        console.log('Received input:');
        console.dir(input);
        throw new Error('Received invalid input');
    }

    if(!typeCheck('Even', input.memory, CUSTOM_TYPES)) {
        throw new Error('Memory has to be a power of 2');
    }
}
