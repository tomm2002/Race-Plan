import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"
import "../styles/Home.css"
import FileUpload from "../components/GPSFileUpload";
import UploadGPS from "../components/GPSFileUpload";

function Home() {
    // Other states and useEffect logic for notes or other features...

    return (
        <div>
            <h1>Home Page</h1>
            <UploadGPS /> {/* Include the UploadGPS component here */}
            {/* Other components or features like Note rendering */}
        </div>
    );
}

export default Home;