import { React } from 'react'
import { Link } from 'react-router-dom'
import './landingPage.css';
import BrandIcon from '../icons/brandIcon';

export default function LandingPage() {
    return (
        <div id='all-landing'>
            <div className="landing-page">
                <BrandIcon/>
                <Link to='/home'>
                    <button id='btn-in'>LET'S GET HEALTHY</button>
                </Link>
            </div>
        </div>
    )
}