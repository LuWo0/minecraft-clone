export const CONTROLS_CONFIG = [
    {
        category: 'Movement',
        shortcuts: [
            { key: 'W', description: 'Move forward' },
            { key: 'S', description: 'Move backward' },
            { key: 'A', description: 'Move left' },
            { key: 'D', description: 'Move right' },
            { key: 'Space', description: 'Jump' }
        ]
    },
    {
        category: 'Building',
        shortcuts: [
            { key: 'Left Click', description: 'Place block' },
            { key: 'Right Click', description: 'Remove block' },
            { key: '1-5', description: 'Select block type' }
        ]
    },
    {
        category: 'Menu',
        shortcuts: [
            { key: 'M', description: 'Toggle menu' },
            { key: 'Esc', description: 'Close menu' }
        ]
    }
]; 