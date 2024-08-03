// src/App.js

import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// The main component of the application
export default function App() {
    // List of countries with their respective values used for selection
    const countries = [
        { name: "England and Wales", value: "england-and-wales" },
        { name: "Scotland", value: "scotland" },
        { name: "Northern Ireland", value: "northern-ireland" },
    ];

    // URL for fetching bank holiday data
    const url = "https://www.gov.uk/bank-holidays.json";

    // Array containing the names of the days of the week
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // State variables for storing fetched data, filtered events, available years, selected year, and selected country
    const [data, setData] = useState({});
    const [events, setEvents] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedCountry, setSelectedCountry] = useState("england-and-wales");

    // Function to fetch data from the specified URL
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

    // Function to extract and return an array of available years from the fetched data
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
            years.sort((a, b) => b - a); // Sort years in descending order
            return years;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // Handler for changing the selected country
    const handleCountryChange = (newCountry) => {
        setSelectedCountry(newCountry);
    };

    // Handler for changing the selected year
    const handleYearChange = (newYear) => {
        setSelectedYear(newYear);
    };

    // Effect to fetch data and set initial state on component mount
    useEffect(() => {
        const fetchAndSet = async () => {
            try {
                const data = await fetchData(url);
                setData(data);

                // Filter events for the selected country and year
                const newEvents = data[selectedCountry].events.filter(event =>
                    new Date(event.date).getFullYear() === selectedYear
                );

                setEvents(newEvents);

                // Set available years from the fetched data
                if (data) {
                    const yearsArray = getYears(data);
                    setYears(yearsArray);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAndSet();
    }, []); // Empty dependency array ensures this effect runs only once

    // Effect to update events when selected country, year, or data changes
    useEffect(() => {
        if (data[selectedCountry]) {
            // Filter events based on the selected country and year
            const newEvents = data[selectedCountry].events.filter(event =>
                new Date(event.date).getFullYear() === selectedYear
            );
            setEvents(newEvents);
        }
    }, [selectedCountry, selectedYear, data]);

    // Function to find the index of the upcoming bank holiday
    const getUpcomingEventIndex = () => {
        const today = new Date();
        // Check if the selected year is the current year
        if (selectedYear === today.getFullYear()) {
            for (let i = 0; i < events.length; i++) {
                // Find the first event with a date greater than today
                if (new Date(events[i].date) > today) {
                    return i;
                }
            }
        }
        return -1; // Return -1 if no upcoming event is found or if the selected year is not the current year
    };

    // Get the index of the upcoming bank holiday
    const upcomingEventIndex = getUpcomingEventIndex();

    // CustomDropdown Component
    const CustomDropdown = ({ options, selectedValue, onChange, label }) => {
        const [isOpen, setIsOpen] = useState(false);

        const toggleDropdown = () => {
            setIsOpen(!isOpen);
        };

        const handleItemClick = (value) => {
            onChange(value);
            setIsOpen(false);
        };

        return (
            <div className="dropdown">
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    onClick={toggleDropdown}
                    aria-expanded={isOpen}
                >
                    {options.find((option) => option.value === selectedValue)?.name || label}
                </button>
                <ul className={`dropdown-menu ${isOpen ? "show" : ""}`}>
                    {options.map((option) => (
                        <li key={option.value}>
                            <button
                                className="dropdown-item"
                                onClick={() => handleItemClick(option.value)}
                            >
                                {option.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Render the component UI
    return (
        <div className="App">
            <h1>Bank Holidays</h1>
            <h2>United Kingdom</h2>

            <div id="select-container">
                {/* Dropdown for selecting the country */}
                <div>
                    <label>Country:</label>
                    <CustomDropdown
                        options={countries}
                        selectedValue={selectedCountry}
                        onChange={handleCountryChange}
                        label="Select Country"
                    />
                </div>

                {/* Dropdown for selecting the year */}
                <div>
                    <label>Year:</label>
                    <CustomDropdown
                        options={years.map((year) => ({
                            name: year.toString(),
                            value: year,
                        }))}
                        selectedValue={selectedYear}
                        onChange={handleYearChange}
                        label="Select Year"
                    />
                </div>
            </div>

            {/* List of bank holidays */}
            <div id="holiday-container">
                <ul>
                    {events.map((event, index) => (
                        <li key={event.date} className={index === upcomingEventIndex ? 'upcoming' : ''}>
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
