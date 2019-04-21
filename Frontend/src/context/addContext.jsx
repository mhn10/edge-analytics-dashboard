import * as React from 'react';


const addContext = {
	addState: {
        name: '',
        type: '',
        username: '',

        requirement : '',
        data : '',
        input : '',
        result : '',
        code: '',
        model: '',

        step  : 1

	},
	dispatch: (action) => action
};

export default React.createContext(addContext);
