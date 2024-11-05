import { useState, useEffect } from 'react';
import { useStore } from "../hooks/useStore";

export const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const saveWorld = useStore((state) => state.saveWorld);
    const resetWorld = useStore((state) => state.resetWorld);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.code === 'KeyM') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                if (document.pointerLockElement) {
                    document.exitPointerLock();
                }
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the world? This cannot be undone.')) {
            resetWorld();
            setIsOpen(false);
            document.querySelector('canvas').requestPointerLock();
        }
    };

    const handleSave = () => {
        saveWorld();
        setIsOpen(false);
        document.querySelector('canvas').requestPointerLock();
        const saveConfirm = document.getElementById('save-confirmation');
        saveConfirm.classList.add('show');
        setTimeout(() => {
            saveConfirm.classList.remove('show');
        }, 2000);
    };

    const handleClose = () => {
        setIsOpen(false);
        document.querySelector('canvas').requestPointerLock();
    };

    return (
        <>
            {!isOpen ? (
                <div className="controls-hint">Press M for menu</div>
            ) : (
                <div className="menu-overlay">
                    <div className="menu-content">
                        <h2>Game Menu</h2>
                        <div className="menu-buttons">
                            <button 
                                className="menu-button"
                                onClick={handleSave}
                            >
                                Save World
                            </button>
                            <button 
                                className="menu-button"
                                onClick={handleReset}
                            >
                                Reset World
                            </button>
                            <button 
                                className="menu-button"
                                onClick={handleClose}
                            >
                                Back to Game
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div id="save-confirmation" className="save-confirmation">
                World saved successfully!
            </div>
        </>
    );
};