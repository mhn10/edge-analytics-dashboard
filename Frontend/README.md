# FrontEnd

## React

Most of the components are written using React functional Components and leverages the context API and react hooks to manage states between components. We haven't used Redux as we never felt the need for it. Context API was more efficient and pure in our case. Hooks have been used, mainly the useState, useReducer and useEffect hooks. 

* [Context API](https://reactjs.org/docs/context.html)
* [React Hooks](https://reactjs.org/docs/hooks-intro.html)

### Structure
The app has been structured in a way to take advantage of the context api. We use main pages like Add new task, Deploy new task and Dashboard which holds the context and context state is transferred to child components named as fragments.
Each of the main pages will have a few fragments that are rendered on the basis of the 'step' state in appropriate context. The useReducer hook binds the context states to the reducer actions to change the state.
By doing so, we are able to rerender only the fragment inside a page, avoiding unnecessary rerenders in react [reconciliation](https://reactjs.org/docs/reconciliation.html).  

![Architecture Diagram](https://github.com/mhn10/edge-analytics-dashboard/blob/master/readme_assets/React.png)

### Styling
Styling has been done through [styled components](https://www.styled-components.com).Most fragments and pages have their own styled components. 
The whole pages are drawn on CSS-Grid, on which fragments are rendered.
[React-spring](https://www.react-spring.io/) animations are used for transition effects.

