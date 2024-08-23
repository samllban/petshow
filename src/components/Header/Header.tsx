import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-center gap-12 bg-purple-700 p-5">
            <Link to="/" className="text-white no-underline">PetShow</Link>
            <Link to="/registrationForm" className="text-white no-underline">Form</Link>
        </header>
    );
}

export default Header;