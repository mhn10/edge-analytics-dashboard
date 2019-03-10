import React, {Component} from "react";
import {Route} from "react-router-dom";

//Import Components
import Navbar from "./Navbar/navbar";


// Create a Main Component

class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={Navbar}/>
            </div>
        )
    }
}
// class Main extends Component {
//     render() {
//         return (
//             <Provider store={store}>
//                 <div>
//                     {/*Render Different Component based on Route*/}
//                     <Route exact path="/" component={Navbar}/>
//                 </div>
//             </Provider>
//         );
//     }
// }

//Export The Main Component
export default Main;