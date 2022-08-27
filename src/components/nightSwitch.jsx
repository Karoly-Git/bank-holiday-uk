import React, { useState } from "react";
import moon from './img/moon.png';
import sun from './img/sun.png';
import './css/styles.css';

export default function NightSwitch(props) {
    const [imgClass, setImgClass] = useState('d-switch');
    const [nightmode, setNightmode] = useState(false);
    const [img, setImg] = useState(moon);

    const darkMode = () => {
        console.log('cklick');
        console.log(imgClass);
        if (!nightmode) {
            setNightmode(true);
            setImg(sun);
            setImgClass('n-switch');
        } else {
            setNightmode(false);
            setImg(moon);
            setImgClass('d-switch');
        }
    }

    return (
        <>
            <img className={imgClass} src={img} onClick={darkMode}></img>
        </>
    );
}
