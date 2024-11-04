import { useStore } from "../hooks/useStore"

export const Menu = () => {
    const saveWorld = useStore((state) => state.saveWorld);
    const resetWorld = useStore((state) => state.resetWorld);

    return (
        <div className="menu absolute">
            <button onClick={() => saveWorld()}>Save</button>
            <button onClick={() => resetWorld()}>Reset</button>
        </div>
    )
}