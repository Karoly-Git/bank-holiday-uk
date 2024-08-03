import React, { useState } from "react";

export default function App(props) {
    const [appClass, setAppClass] = useState("d-App");

    const countries = ["england-and-wales", "scotland", "northern-ireland"];
    const url = "https://www.gov.uk/bank-holidays.json";

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const getYears = async (dataPromise) => {
        let years = [];
        try {
            const data = await dataPromise; // Await the promise to get the data
            const events = data["england-and-wales"].events;
            events.forEach((element) => {
                const year = new Date(element.date).getFullYear(); // Correctly call getFullYear()
                if (!years.includes(year)) {
                    years.push(year);
                }
            });
            years.sort((a, b) => b - a);
            return years;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={appClass}>
            <h1>Bank Holidays UK</h1>
        </div>
    );
}
