import { useProgress } from '@react-three/drei'
import './Loader.css'

export default function Loader() {
    const { progress } = useProgress()

    return (
        <div className="loader">
        <div className="loader-content">
            <h1 className="loader-logo">MyE46</h1>
            <div className="loader-bar-track">
            <div
                className="loader-bar-fill"
                style={{ width: `${progress}%` }}
            />
            </div>
            <p className="loader-status">
            {progress < 100 ? 'Loading model…' : 'Preparing scene…'}
            </p>
        </div>
        </div>
    )
}