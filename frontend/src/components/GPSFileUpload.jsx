import { useState } from "react";
import api from "../api";

function UploadGPS() {
    const [gpsFile, setGpsFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    const handleFileChange = (e) => {
        setGpsFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!gpsFile) {
            alert('Please select a GPS file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', gpsFile); 

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/api/upload/gps/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('File uploaded successfully!');
            setFileUrl(response.data.file_url);
        } catch (error) {
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
            {fileUrl && (
                <div>
                    <p>File URL:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
                </div>
            )}
        </div>
    );
}

export default UploadGPS;