import React from "react";

export default function YearItem(props) {
    return (
        <>
            <option selected={props.selected}>{props.year}{props.nname}</option>
        </>
    );
}
