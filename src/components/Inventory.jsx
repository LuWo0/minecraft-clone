import { useStore } from '../hooks/useStore'

export function Inventory() {
  const [inventory, activeItem] = useStore((state) => [state.inventory, state.activeItem])
  
  return (
    <div className="inventory-bar">
      {inventory.map((item) => (
        <div 
          key={item.id}
          className={`inventory-slot ${activeItem === item.id ? 'active' : ''}`}
        >
          <img src={item.texture} alt={item.name} />
        </div>
      ))}
    </div>
  )
} 