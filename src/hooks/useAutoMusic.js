import { useEffect, useState } from 'react';
import { useSound } from './useSound';

export const useAutoMusic = () => {
  const { toggleMusic } = useSound();
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        toggleMusic();
        setHasInteracted(true);
        document.removeEventListener('click', handleFirstInteraction);
      }
    };

    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [hasInteracted, toggleMusic]);
}; 