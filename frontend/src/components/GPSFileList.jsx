import { useEffect, useState } from "react";
import api from "../api";
import togpx from "togpx";
import * as togeojson from 'togeojson';

function GPSFileList() {
    const [gpsFiles, setGpsFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [gpsData, setGpsData] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');

    useEffect(() => {
        const fetchGPSFiles = async () => {
            try {
                const response = await api.get('/api/gps/files/');
                setGpsFiles(response.data);
            } catch (error) {
                setError('Error fetching GPS files: ' + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false);
            }
        };

        fetchGPSFiles();
    }, []);

    const handleFileClick = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            const text = await response.text();
            
            // Log the GPX file content
            console.log("GPX file content:", text);
        } catch (error) {
            console.error('Error fetching GPX file:', error);
        }
    };

    const log100thPoint = () => {
        if (
            gpsData &&
            gpsData.features &&
            gpsData.features[0] &&
            gpsData.features[0].geometry.coordinates.length >= 100
        ) {
            console.log("100th GPS point:", gpsData.features[0].geometry.coordinates[99]);
        } else if (gpsData && gpsData.features[0]) {
            console.log(`Only ${gpsData.features[0].geometry.coordinates.length} GPS points available.`);
        } else {
            console.log("No GPS data available.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Uploaded GPS Files</h2>
            <ul>
                {gpsFiles.map((file) => (
                    <li key={file.file_url}>
                        <a href="#" onClick={() => handleFileClick(file.file_url, file.file_name)}>
                            {file.file_name}
                        </a>
                        <span> (Uploaded at: {new Date(file.uploaded_at).toLocaleString()})</span>
                    </li>
                ))}
            </ul>
            {gpsData && (
                <div>
                    <h3>GPS Data for {selectedFileName}</h3>
                    <ul>
                        {gpsData.features.map((feature, index) => (
                            <li key={index}>
                                <strong>Feature {index + 1}:</strong>
                                <ul>
                                    <li>Type: {feature.geometry.type}</li>
                                    <li>Coordinates: {JSON.stringify(feature.geometry.coordinates)}</li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <button onClick={log100thPoint}>Log 100th GPS Point</button>
                </div>
            )}
        </div>
    );
}

export default GPSFileList;
