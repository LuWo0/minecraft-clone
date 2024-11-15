import { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { useSound } from '../hooks/useSound';
import { useGameTime } from '../hooks/useGameTime';
import { useWeather } from '../hooks/useWeather';
import { CONTROLS_CONFIG } from '../config/controls';

export const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('main');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [isSaving, setIsSaving] = useState(false);
    
    const saveWorld = useStore((state) => state.saveWorld);
    const resetWorld = useStore((state) => state.resetWorld);
    const { 
        musicVolume, 
        effectsVolume, 
        setMusicVolume, 
        setEffectsVolume,
        isThunderEnabled,
        toggleThunder
    } = useSound();

    const timeSpeed = useGameTime((state) => state.timeSpeed);
    const setTimeSpeed = useGameTime((state) => state.setTimeSpeed);
    const isPaused = useGameTime((state) => state.isPaused);
    const togglePause = useGameTime((state) => state.togglePause);

    const isRaining = useWeather((state) => state.isRaining);
    const rainIntensity = useWeather((state) => state.rainIntensity);
    const toggleRain = useWeather((state) => state.toggleRain);
    const setRainIntensity = useWeather((state) => state.setRainIntensity);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.code === 'KeyM') {
                setIsOpen(prev => !prev);
                if (!isOpen) {
                    document.exitPointerLock();
                }
            }
            if (e.code === 'Escape' && isOpen) {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        setActiveTab('main');
        document.querySelector('canvas').requestPointerLock();
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveWorld();
            showNotification('World saved successfully', 'success');
        } catch (error) {
            showNotification('Failed to save world', 'error');
        } finally {
            setIsSaving(false);
            handleClose();
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the world? This cannot be undone.')) {
            try {
                resetWorld();
                handleClose();
                showNotification('World has been reset successfully', 'warning');
            } catch (error) {
                showNotification('Failed to reset world', 'error');
            }
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleMenuClick = (e) => {
        e.stopPropagation();
    };

    // Simplified percentage calculation
    const getTimeSpeedPercentage = (speed) => {
        return ((speed - 0.00001) / (0.001 - 0.00001)) * 100;
    };

    return (
        <>
            {!isOpen ? (
                <div className="controls-hint">Press M for menu</div>
            ) : (
                <div className="menu-overlay" onClick={handleMenuClick}>
                    <div className="menu-content">
                        <div className="menu-tabs">
                            <button 
                                className={`menu-tab ${activeTab === 'main' ? 'active' : ''}`}
                                onClick={() => setActiveTab('main')}
                            >
                                Main
                            </button>
                            <button 
                                className={`menu-tab ${activeTab === 'controls' ? 'active' : ''}`}
                                onClick={() => setActiveTab('controls')}
                            >
                                Controls
                            </button>
                            <button 
                                className={`menu-tab ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                Settings
                            </button>
                        </div>

                        {activeTab === 'main' && (
                            <div className="menu-buttons">
                                <button className="menu-button" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save World'}
                                </button>
                                <button className="menu-button" onClick={handleReset}>
                                    Reset World
                                </button>
                                <button className="menu-button" onClick={handleClose}>
                                    Back to Game
                                </button>
                            </div>
                        )}

                        {activeTab === 'controls' && (
                            <div className="controls-container">
                                {CONTROLS_CONFIG.map((section) => (
                                    <div key={section.category} className="control-section">
                                        <h3 className="control-category">{section.category}</h3>
                                        <div className="control-list">
                                            {section.shortcuts.map((shortcut) => (
                                                <div key={shortcut.key} className="control-item">
                                                    <kbd className="key-binding">{shortcut.key}</kbd>
                                                    <span className="key-description">{shortcut.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <button className="menu-button" onClick={handleClose}>
                                    Back to Game
                                </button>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="menu-settings">
                                <div className="setting-item">
                                    <label>Music Volume</label>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.1"
                                        value={musicVolume}
                                        onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                    />
                                    <span>{Math.round(musicVolume * 100)}%</span>
                                </div>
                                <div className="setting-item">
                                    <label>Effects Volume</label>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.1"
                                        value={effectsVolume}
                                        onChange={(e) => setEffectsVolume(parseFloat(e.target.value))}
                                    />
                                    <span>{Math.round(effectsVolume * 100)}%</span>
                                </div>
                                <div className="setting-item">
                                    <label>Time Speed</label>
                                    <input 
                                        type="range" 
                                        min="0.00001" 
                                        max="0.001" 
                                        step="0.00001"
                                        value={timeSpeed}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            setTimeSpeed(value);
                                            const percentage = getTimeSpeedPercentage(value);
                                            e.target.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percentage}%, #1a1a1a ${percentage}%, #1a1a1a 100%)`;
                                        }}
                                        style={{
                                            background: `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${getTimeSpeedPercentage(timeSpeed)}%, #1a1a1a ${getTimeSpeedPercentage(timeSpeed)}%, #1a1a1a 100%)`
                                        }}
                                    />
                                    <span>{Math.round(timeSpeed * 100000)}x</span>
                                </div>
                                <div className="setting-item checkbox">
                                    <label>Pause Time</label>
                                    <input 
                                        type="checkbox"
                                        checked={isPaused}
                                        onChange={togglePause}
                                    />
                                </div>
                                <div className="setting-item checkbox">
                                    <label>Rain</label>
                                    <input 
                                        type="checkbox"
                                        checked={isRaining}
                                        onChange={toggleRain}
                                    />
                                </div>
                                {isRaining && (
                                    <>
                                        <div className="setting-item">
                                            <label>Rain Intensity</label>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="1" 
                                                step="0.1"
                                                value={rainIntensity}
                                                onChange={(e) => {
                                                    const value = parseFloat(e.target.value);
                                                    setRainIntensity(value);
                                                    e.target.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${value * 100}%, #1a1a1a ${value * 100}%, #1a1a1a 100%)`;
                                                }}
                                                style={{
                                                    background: `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${rainIntensity * 100}%, #1a1a1a ${rainIntensity * 100}%, #1a1a1a 100%)`
                                                }}
                                            />
                                            <span>{Math.round(rainIntensity * 100)}%</span>
                                        </div>
                                        <div className="setting-item checkbox">
                                            <label>Thunder</label>
                                            <input 
                                                type="checkbox"
                                                checked={isThunderEnabled}
                                                onChange={toggleThunder}
                                            />
                                        </div>
                                    </>
                                )}
                                <button className="menu-button" onClick={handleClose}>
                                    Back to Game
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {notification.show && (
                <div className={`notification ${notification.type} show`}>
                    <div className="notification-content">
                        <div className="notification-icon">
                            {notification.type === 'success' && '✓'}
                            {notification.type === 'warning' && '!'}
                            {notification.type === 'error' && '✕'}
                        </div>
                        <div className="notification-message">
                            {notification.message}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};