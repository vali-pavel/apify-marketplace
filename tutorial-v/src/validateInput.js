const MIN_MEMORY = 128;

module.exports.validateInput = (input) => {
    const {
        memory,
        useClient,
        fields,
        maxItems
    } = input;

    const validationErrors = [];

    if(!memory) {
        const errMsg = errFieldMissing('memory');
        validationErrors.push(errMsg);
    } else {
        if(typeof memory !== 'number') {
            const fieldType = typeof memory;
            const errMsg = errInvalidFieldValue('memory', 'number', fieldType);
            validationErrors.push(errMsg);
        }
        if(memory < MIN_MEMORY) {
            const errMsg = `Memory has to be greater or equal to ${MIN_MEMORY}`;
            validationErrors.push(errMsg);
        } else if(!powerOfTwo(memory)) {
            const errMsg = `Memory has to be a power of 2`;
            validationErrors.push(errMsg);
        }
    }

    if(!useClient) {
        const errMsg = errFieldMissing('useClient');
        validationErrors.push(errMsg);
    } else if(typeof useClient !== 'boolean') {
        const fieldType = typeof useClient;
        const errMsg = errInvalidFieldValue('useClient', 'boolean', fieldType);
        validationErrors.push(errMsg);
    }

    if(!fields) {
        errFieldMissing('fields');
    } else if(!Array.isArray(fields)) {
        const fieldType = typeof fields;
        const errMsg = errInvalidFieldValue('fields', 'array', fieldType);
        validationErrors.push(errMsg);
    }

    if(!maxItems) {
        const errMsg = errFieldMissing('maxItems');
        validationErrors.push(errMsg);
    } else if(typeof maxItems !== 'number') {
        const fieldType = typeof maxItems;
        const errMsg = errInvalidFieldValue('maxItems', 'number', fieldType);
        validationErrors.push(errMsg);
    }

    if(validationErrors.length > 0) {
        const errorMessage = validationErrors.join('\n\n');
        throw new Error(errorMessage);
    }
}

const errFieldMissing = (field) => {
    return `The ${field} field is missing from input.`;
}

const errInvalidFieldValue = (field, expected, received) => {
    return `Invalid value added to the ${field} field.
        Expected: ${expected}
        Received: ${received}`;
}

const powerOfTwo = (number) => {
    return ((number & (number - 1)) === 0);
}
