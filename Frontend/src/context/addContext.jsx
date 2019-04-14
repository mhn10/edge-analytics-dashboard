import * as React from 'react';


const addContext = {
	addState: {
        name: '',
        username: '',
        requirement : null,
        data : null,
        input : null,
        result : null,
        code: null,
        step  : 1

	},
	dispatch: (action) => action
};

export default React.createContext(addContext);
