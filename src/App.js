import React, { useState, useEffect } from "react";
import './App.css';

export default function App(props) {
    const countries = [
        { name: "England and Wales", value: "england-and-wales" },
        { name: "Scotland", value: "scotland" },
        { name: "Northern Ireland", value: "northern-ireland" },
    ];

    const url = "https://www.gov.uk/bank-holidays.json";
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const [data, setData] = useState({});
    const [events, setEvents] = useState([]);
    const [years, setYears] = useState([]);

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedCountry, setSelectedCountry] = useState("england-and-wales");

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const getYears = (data) => {
        let years = [];
        try {
            const events = data["england-and-wales"].events;
            events.forEach((element) => {
                const year = new Date(element.date).getFullYear();
                if (!years.includes(year)) {
                    years.push(year);
                }
            });
            years.sort((a, b) => b - a);
            return years;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const handleCountryChange = (event) => {
        const newCountry = event.target.value;
        setSelectedCountry(newCountry);
    };

    const handleYearChange = (event) => {
        const newYear = parseInt(event.target.value, 10);
        setSelectedYear(newYear);
    };

    useEffect(() => {
        const fetchAndSet = async () => {
            try {
                const data = await fetchData(url);
                setData(data);

                const newEvents = data[selectedCountry].events.filter(event =>
                    new Date(event.date).getFullYear() === selectedYear
                );

                setEvents(newEvents);

                if (data) {
                    const yearsArray = getYears(data);
                    setYears(yearsArray);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAndSet();
    }, []);

    useEffect(() => {
        if (data[selectedCountry]) {
            const newEvents = data[selectedCountry].events.filter(event =>
                new Date(event.date).getFullYear() === selectedYear
            );
            setEvents(newEvents);
        }
    }, [selectedCountry, selectedYear, data]);

    return (
        <div className="App">
            <h1>Bank Holidays</h1>
            <h2>United Kingdom</h2>

            <div id="select-container">
                <div>
                    <label>Country:</label>
                    <select className="select-country" value={selectedCountry} onChange={handleCountryChange}>
                        {countries.map((country) => (
                            <option key={country.name} value={country.value}>{country.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Year:</label>
                    <select value={selectedYear} onChange={handleYearChange} className="select-year">
                        {years.map((year) => (
                            <option value={year} key={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div id="holiday-container">
                <ul>
                    {events.map((event) => (
                        <li key={event.date}>
                            <div className="event-name">{event.title}</div>
                            <div className="event-date">{
                                new Date(event.date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })
                            }</div>
                            <div className="event-day">{`${dayNames[new Date(event.date).getDay()]}`}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
