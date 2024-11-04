import { useStore } from '../hooks/useStore'

export function CraftingMenu() {
  const recipes = useStore((state) => state.recipes)
  
  return (
    <div className="crafting-menu">
      <div className="crafting-grid">
        {/* 3x3 crafting grid */}
      </div>
      <div className="result-slot">
        {/* Crafting result */}
      </div>
    </div>
  )
} 