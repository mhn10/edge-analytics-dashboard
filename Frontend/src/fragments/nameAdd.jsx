import React, { useEffect, useState } from "react";
import { PageHeader} from '../components/Page';

import AddContext from "../context/addContext";
import styled from "styled-components";
import CreatableSelect from "react-select/lib/Creatable";
import axios from "axios";
const { CONSTANTS } = require("../Constants");
const NamesAdd = props => {
    const context = React.useContext(AddContext);
    const [defaultOption, setDefaultOption] = useState([]);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("fetch Task here");
        axios
            .get(`${CONSTANTS.BACKEND_URL}/taskdetail`, {
                params: {
                    username: context.addState.username,
                    type: context.addState.type
                }
            })
            .then(response => {
                console.log("Response taskdetails", response.data);
                //create option map to setDeafultoption
                const { data } = response;
                let result = data.map(task => createOption(task));
                console.log("Default options", result);
                setDefaultOption(result);
            })
            .catch(error => {
                console.log("Error in useEffect nameAdd", error);
                alert("Data fetch failed, reload");
            });
    }, []);

    const changeHandler = (newValue, actionMeta) => {
        console.log("Values, ", newValue);
        console.log(`action: ${actionMeta.action}`);
        setValue(newValue);
        context.dispatch({ type: "setName", newValue });
        // context.dispatch({ type: "changeState", value: 3 });
    };
    const submitHandler = values => {
        context.dispatch({ type: "changeState", value: 3 });
    };

    const createOption = label => ({
        label,
        value: label.toLowerCase().replace(/\W/g, "")
    });

    const handleCreate = inputValue => {
        setLoading(true);
        console.group("Option created");
        console.log("Wait a moment...");
        setTimeout(() => {
            //const { options } = this.state;
            const newOption = createOption(inputValue);
            console.log(newOption);
            console.groupEnd();
            setDefaultOption([...defaultOption, newOption]);
            setLoading(false);
            setValue(newOption.value);
            const newValue = newOption.value;
			console.log("TCL: newValue", newValue)

            context.dispatch({ type: "setName", newValue });


            //   this.setState({
            //     isLoading: false,
            //     options: [...options, newOption],
            //     value: newOption,
            //   });
        }, 500);
        setTimeout(() => {
            console.log("Moving to next step, ", context.addState);
            context.dispatch({ type: "changeState", value: 3 });
        }, 1000);
    };

    return (
        <NameWrapper>
            <section className="page-content">
            		<PageHeader title={'Add Task Name'} />
            <CreatableSelect
                isClearable
                isDisabled={loading}
                isLoading={loading}
                onChange={changeHandler}
                onCreateOption={handleCreate}
                options={defaultOption}
                value={value}
                defaultValue = {{value:context.addState.name, label:context.addState.name}}
            />
           			</section>
        </NameWrapper>
    );
};

export default NamesAdd;

const NameWrapper = styled.div`
    background: white;
    border: 2px solid #f8f8f8;
    margin-top: 2rem;
    padding: 2rem;
    box-sizing: border-box;
    border-radius: 10px;
    color: #606060;
    /* font-size: 1.2rem; */
    text-align: center;

    .item-name {
        font-size: 1rem;
        /* text-transform: uppercase; */
        color: #008fda;
        font-weight: lighter;
        text-align: center;
    }
`;
