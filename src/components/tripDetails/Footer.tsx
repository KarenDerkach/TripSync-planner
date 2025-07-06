import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-10">
      <p className="text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} TripSync. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
