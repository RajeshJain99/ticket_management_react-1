import React from 'react'
import './Loader.css'
import LoaderImg from '../images/loader.png'

export default function Loader() {
    return (
        <div className="gif">
            <img src={LoaderImg} alt="Loading image" />
        </div>
    )
}
