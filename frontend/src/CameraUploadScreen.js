import React, { useState, useRef } from 'react';
import './CameraUploadScreen.css';
import { FiCamera, FiArrowRight, FiRefreshCw, FiRefreshCcw, FiHome, FiZap, FiZapOff } from 'react-icons/fi'; // Added icons for flash
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import OSS from 'ali-oss';

// Initialize OSS client
const client = new OSS({
    region: 'region',
    accessKeyId: 'accessKeyId',
    accessKeySecret: 'accessKeyId',
    bucket: 'bucket',
});

function CameraUploadScreen() {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);
    const [facingMode, setFacingMode] = useState('user');
    const [flashOn, setFlashOn] = useState(false);  // Flash state
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    };

    const retakePhoto = () => {
        setImage(null);
    };

    const toggleCamera = () => {
        setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
    };

    const toggleFlash = () => {
        setFlashOn(!flashOn);
    };

    const uploadFileToOSS = async (imageData) => {
        setIsUploading(true);
        try {
            const blob = await fetch(imageData).then(res => res.blob());
            const fileName = `image_${Date.now()}.jpeg`;
            const result = await client.put(fileName, blob);
            const signedUrl = client.signatureUrl(fileName, { expires: 3600 });
            return fileName;
        } catch (err) {
            console.error('Error uploading file to OSS:', err);
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    const handleAnalyze = async () => {
        if (image) {
            try {
                const imageName = await uploadFileToOSS(image);
                if (imageName) {
                    navigate('/summary', { state: { imageName } });
                }
            } catch (error) {
                console.error('Error during upload or analysis:', error);
            }
        }
    };

    return (
        <div className={`camera-upload-screen ${flashOn ? 'flash-active' : ''}`}>
            <button className="btn-home" onClick={() => navigate('/home')}>
                <FiHome className="btn-icon" />
            </button>
            {image ? (
                <div className="image-preview">
                    <img src={image} alt="Captured" className="captured-image" />
                    <div className="button-group">
                        <button className="btn-retake" onClick={retakePhoto} disabled={isUploading}>
                            <FiRefreshCw className="btn-icon" /> Retake Photo
                        </button>
                        <button className="btn-analyze" onClick={handleAnalyze} disabled={isUploading}>
                            {isUploading ? 'Uploading...' : <><FiArrowRight className="btn-icon" /> Upload & Analyze</>}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="camera-frame">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode }}
                        className="webcam-view"
                    />
                    <button className="btn-capture" onClick={capturePhoto}>
                        <FiCamera className="btn-icon" />
                    </button>
                    <button className="btn-switch" onClick={toggleCamera}>
                        <FiRefreshCcw className="btn-icon" />
                    </button>
                    <button className="btn-flash" onClick={toggleFlash}>
                        {flashOn ? <FiZapOff className="btn-icon" /> : <FiZap className="btn-icon" />}
                    </button>
                </div>
            )}
        </div>
    );
}

export default CameraUploadScreen;
