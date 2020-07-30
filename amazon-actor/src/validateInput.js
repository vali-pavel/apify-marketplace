const typeCheck = require('type-check').typeCheck;

module.exports.validateInput = (input) => {
    const INPUT_TYPE = `{
        keyword: String,
    }`;

    if (!typeCheck(INPUT_TYPE, input)) {
        console.log('Expected input:');
        console.log(INPUT_TYPE);
        console.log('Received input:');
        console.dir(input);
        throw new Error('Received invalid input');
    }
}
