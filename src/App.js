import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// The main component of the application
export default function App() {
    const countries = [
        { name: "England and Wales", value: "england-and-wales" },
        { name: "Scotland", value: "scotland" },
        { name: "Northern Ireland", value: "northern-ireland" },
    ];

    const url = "https://www.gov.uk/bank-holidays.json";
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const [data, setData] = useState({});
    const [events, setEvents] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);
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
            years.sort((a, b) => b - a); // Sort years in descending order
            return years;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const handleCountryChange = (newCountry) => {
        setSelectedCountry(newCountry);
    };

    const handleYearChange = (newYear) => {
        setSelectedYear(newYear);
    };

    useEffect(() => {
        const fetchAndSet = async () => {
            try {
                const data = await fetchData(url);

                if (data) {
                    setHasFetched(true);
                    setData(data);
                }

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

    const getUpcomingEventIndex = () => {
        const today = new Date();
        if (selectedYear === today.getFullYear()) {
            for (let i = 0; i < events.length; i++) {
                if (new Date(events[i].date) > today) {
                    return i;
                }
            }
        }
        return -1;
    };

    const upcomingEventIndex = getUpcomingEventIndex();

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

    return (
        !hasFetched ?
            <div className="loading-screen">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            </div>
            :
            <div className="App">
                {/* Animate only on first load */}
                <header>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} // Initial state before the animation
                        animate={{ opacity: 1, y: 0 }} // Animate to this state
                        transition={{ duration: 0.5 }} // Animation duration
                    >
                        Bank Holidays
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} // Initial state before the animation
                        animate={{ opacity: 1, y: 0 }} // Animate to this state
                        transition={{ duration: 0.5, delay: 0.1 }} // Animation duration with delay
                    >
                        United Kingdom
                    </motion.h2>

                    <motion.div
                        id="select-container"
                        initial={{ opacity: 0, y: 20 }} // Initial state before the animation
                        animate={{ opacity: 1, y: 0 }} // Animate to this state
                        transition={{ duration: 0.5, delay: 0.2 }} // Animation duration with delay
                    >
                        <div>
                            <CustomDropdown
                                options={countries}
                                selectedValue={selectedCountry}
                                onChange={handleCountryChange}
                                label="Select Country"
                            />
                        </div>

                        <div>
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
                    </motion.div>
                </header>


                {/* Animated holiday container */}
                <main>

                    <motion.div
                        id="holiday-container"
                        key={`${selectedCountry}-${selectedYear}`} // Unique key to trigger re-render
                        initial={{ opacity: 0, y: 20 }} // Initial state before the animation
                        animate={{ opacity: 1, y: 0 }} // Animate to this state
                        transition={{ duration: 0.5 }} // Animation duration
                    >
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
                    </motion.div>
                </main>

                <footer>Made by <a href="https://karolyhornyak.co.uk/" target="_blank" rel="noopener noreferrer">Karoly Hornyak</a></footer>
            </div>
    );
}
