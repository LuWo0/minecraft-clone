import { useEffect, useState } from 'react';
import { useSound } from './useSound';

export const useAutoMusic = () => {
  const { toggleMusic, isMusicPlaying } = useSound();
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && !isMusicPlaying) {
        toggleMusic();
        setHasInteracted(true);
        document.removeEventListener('click', handleFirstInteraction);
      }
    };

    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [hasInteracted, toggleMusic, isMusicPlaying]);
}; 