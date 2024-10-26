import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"
import "../styles/Home.css"
import FileUpload from "../components/GPSFileUpload";
import UploadGPS from "../components/GPSFileUpload";
import GPSFileList from "../components/GPSFileList";

function Home() {
    // Other states and useEffect logic for notes or other features...

    return (
        <div>
            <h1>Home Page</h1>
            <UploadGPS /> {}
            <GPSFileList /> {}
            
        </div>
    );
}

export default Home;