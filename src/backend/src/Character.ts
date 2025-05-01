class Character {
    name: string;
    color: string;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }
}

export function CharacterFactory(): Character[] {
    return [
        new Character('Character', '#FF4B4B'),      // Bright Red
        new Character('Character_01', '#4169E1'),   // Royal Blue
        new Character('Character_02', '#32CD32'),   // Lime Green
        new Character('Character_03', '#FFD700'),   // Golden
        new Character('Character_04', '#8A2BE2'),   // Purple
        new Character('Character_05', '#FF8C00'),   // Dark Orange
        new Character('Character_06', '#20B2AA'),   // Light Sea Green
        new Character('Character_07', '#FF69B4'),   // Hot Pink
        new Character('Character_08', '#E67E22'),   // Bright Orange (était Sienna Brown)
        new Character('Character_09', '#00CED1'),   // Dark Turquoise
        new Character('Killer', '#FF3333'),         // Bright Red (était Maroon)
        new Character('Killer_01', '#6A5ACD'),      // Slate Blue (était Dark Slate Blue)
        new Character('Man_Pot', '#F4D03F'),        // Bright Yellow (était Dark Khaki)
        new Character('Mr_Smiles', '#FF1493'),      // Deep Pink
        //new Character('Blender_Head', '#9B59B6'), // Medium Purple (était Indigo)
        new Character('Creature', '#2ECC71'),       // Emerald Green (était Dark Slate Gray)
        new Character('Clown', '#ff1cc6'),          // Orange Red (était Tomato)
    ];
}

export default Character;