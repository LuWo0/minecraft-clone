import { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { useSound } from '../hooks/useSound';

export const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('main');
    const saveWorld = useStore((state) => state.saveWorld);
    const resetWorld = useStore((state) => state.resetWorld);
    const { 
        musicVolume, 
        effectsVolume, 
        setMusicVolume, 
        setEffectsVolume,
        toggleMusic 
    } = useSound();

    // Handle pointer lock changes
    useEffect(() => {
        const handlePointerLockChange = () => {
            if (!document.pointerLockElement && !isOpen) {
                setIsOpen(true);
            }
        };

        document.addEventListener('pointerlockchange', handlePointerLockChange);
        return () => {
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
        };
    }, [isOpen]);

    // Handle keyboard controls
    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.code === 'KeyM') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                if (!isOpen) {
                    document.exitPointerLock();
                } else {
                    document.querySelector('canvas').requestPointerLock();
                }
            }
            if (e.code === 'Escape' && isOpen) {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [isOpen]);

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the world? This cannot be undone.')) {
            resetWorld();
            handleClose();
        }
    };

    const handleSave = () => {
        saveWorld();
        handleClose();
        showSaveConfirmation();
    };

    const handleClose = () => {
        setIsOpen(false);
        setActiveTab('main');
        document.querySelector('canvas').requestPointerLock();
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const showSaveConfirmation = () => {
        const saveConfirm = document.getElementById('save-confirmation');
        saveConfirm.classList.add('show');
        setTimeout(() => {
            saveConfirm.classList.remove('show');
        }, 2000);
    };

    // Prevent pointer lock when clicking menu elements
    const handleMenuClick = (e) => {
        e.stopPropagation();
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
                                onClick={() => handleTabChange('main')}
                            >
                                Main
                            </button>
                            <button 
                                className={`menu-tab ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => handleTabChange('settings')}
                            >
                                Settings
                            </button>
                        </div>

                        {activeTab === 'main' && (
                            <div className="menu-buttons">
                                <button className="menu-button" onClick={handleSave}>
                                    Save World
                                </button>
                                <button className="menu-button" onClick={handleReset}>
                                    Reset World
                                </button>
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
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            setMusicVolume(value);
                                            // Update gradient
                                            e.target.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${value * 100}%, #1a1a1a ${value * 100}%, #1a1a1a 100%)`;
                                        }}
                                        style={{
                                            background: `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${musicVolume * 100}%, #1a1a1a ${musicVolume * 100}%, #1a1a1a 100%)`
                                        }}
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
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            setEffectsVolume(value);
                                            // Update gradient
                                            e.target.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${value * 100}%, #1a1a1a ${value * 100}%, #1a1a1a 100%)`;
                                        }}
                                        style={{
                                            background: `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${effectsVolume * 100}%, #1a1a1a ${effectsVolume * 100}%, #1a1a1a 100%)`
                                        }}
                                    />
                                    <span>{Math.round(effectsVolume * 100)}%</span>
                                </div>
                                <button className="menu-button" onClick={handleClose}>
                                    Back to Game
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div id="save-confirmation" className="save-confirmation">
                World saved successfully!
            </div>
        </>
    );
};