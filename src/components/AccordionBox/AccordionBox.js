import React, {useState,useEffect} from "react";
import classes from "./AccordionBox.module.css"
import PropTypes from 'prop-types';
import {isSafari} from 'react-device-detect'

const AccordionBox = (props) => {
    const {title, customClass, content,activeTab} = props;

    const [active, setActive] = useState(0);

    const itemsClickHandler = (index) => {
        setActive(index)
    }

    useEffect(()=>{
        if( activeTab !== undefined ){
            setActive(activeTab)
        }
    },[activeTab])

    return (
        <div className={`${customClass} ${classes.container} ${isSafari ? props.safari : ""}`}>
            <div className={`card-header-bg accordion-header ${classes.header}`}>
                <h3 className={`${props.titleClassName} ${classes.title}`}>{title}</h3>
                <div className={`${classes.items} ${props.headerClassName}`}>
                    <ul>
                        {content.map((item, index) => {
                            return <li className={active === index ? (classes.active) : ""}
                                       onClick={() => itemsClickHandler(index)}
                                       key={index}>{item.title}</li>
                        })}
                    </ul>
                </div>
            </div>
            <div className={`accordion-body ${classes.body}`}>
                {content[active].body}
            </div>
        </div>
    );
}

AccordionBox.prototype = {
    title: PropTypes.string,
    customClass: PropTypes.array,
    content: PropTypes.array,
}

export default AccordionBox;

