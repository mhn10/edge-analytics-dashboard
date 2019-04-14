import * as React from 'react';


const addContext = {
	addState: {
        name: '',
        type: '',
        username: '',

        requirement : null,
        data : null,
        input : null,
        result : null,
        code: null,
        model: null,

        step  : 1

	},
	dispatch: (action) => action
};

export default React.createContext(addContext);


// Classification FileF
// code
// data
// input (JSON)
// model
// req
// result
