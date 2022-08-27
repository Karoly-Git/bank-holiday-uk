import React, { useState } from 'react';
import BankHoliday from "./components/bankHoliday";

export default function App(props) {
  const [appClass, setAppClass] = useState('d-App');
  const [title, setTitle] = useState('Bank Holidays')

  return (
    <div className={appClass}>
      <h1>{title}</h1>
      <BankHoliday />
    </div>
  );
}

