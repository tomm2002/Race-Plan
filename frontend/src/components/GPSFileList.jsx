
import { useEffect, useState } from "react";
import api from "../api"; // Ensure the API path is correct

function GPSFileList() {
    const [gpsFiles, setGpsFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Uploaded GPS Files</h2>
            <ul>
                {gpsFiles.map((file) => (
                    <li key={file.file_url}>
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                            {file.file_name}
                        </a>
                        <span> (Uploaded at: {new Date(file.uploaded_at).toLocaleString()})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GPSFileList;
