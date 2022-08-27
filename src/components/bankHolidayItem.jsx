import React from "react";

export default function BankHolidayItem(props) {
    return (
        <>
            <li>
                <div className="name">{props.name}</div>
                <div className="date">
                    {props.day}/{props.month}/{props.year}
                </div>
                <div className="day">{props.dayName}</div>
            </li>
        </>
    );
}
