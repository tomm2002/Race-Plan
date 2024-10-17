// src/components/UploadGPS.jsx
import { useState } from "react";
import api from "../api"; // Ensure the API path is correct

function UploadGPS() {
    const [gpsFile, setGpsFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        setGpsFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!gpsFile) {
            alert('Please select a GPS file to upload.');
            return;
        }

        // Create form data to upload the file
        const formData = new FormData();
        formData.append('gpsFile', gpsFile);

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/api/upload/gps/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully:', response.data);
            setSuccess('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Error uploading file: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Upload GPS File</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="gpsFile">GPS File:</label>
                <br />
                <input
                    type="file"
                    id="gpsFile"
                    name="gpsFile"
                    accept=".gpx"
                    required
                    onChange={handleFileChange}
                />
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload GPS'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}

export default UploadGPS;
