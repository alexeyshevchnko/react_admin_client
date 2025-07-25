import MagicOre from '../assets/icons/MagicOre.png';
import LuckyChip from '../assets/icons/LuckyChip.png';
import MMToken from '../assets/icons/MMToken.png';
import MMTokenSoft from '../assets/icons/MMTokenSoft.png';
import Ton from '../assets/icons/Ton.png';
import Gold from '../assets/icons/Gold.png';
import Emerald from '../assets/icons/Emerald.png';
import Copper from '../assets/icons/Copper.png';
import Ruby from '../assets/icons/Ruby.png';
import Sapphire from '../assets/icons/Sapphire.png';
import Silver from '../assets/icons/Silver.png'; 
import Scroll from '../assets/icons/Scroll.png'; 
import Ore from '../assets/icons/Ore.png'; 
import Arkenstone from '../assets/icons/Arkenstone.png';

import DwarfsCopper1 from '../assets/icons/Dwarfs/copper/1.png';
import DwarfsCopper2 from '../assets/icons/Dwarfs/copper/2.png';
import DwarfsCopper3 from '../assets/icons/Dwarfs/copper/3.png';
import DwarfsCopper4 from '../assets/icons/Dwarfs/copper/4.png';
import DwarfsCopper5 from '../assets/icons/Dwarfs/copper/5.png';
import DwarfsCopper6 from '../assets/icons/Dwarfs/copper/6.png';
import DwarfsCopper7 from '../assets/icons/Dwarfs/copper/7.png';

import DwarfsDiamond1 from '../assets/icons/Dwarfs/diamond/1.png';
import DwarfsDiamond2 from '../assets/icons/Dwarfs/diamond/2.png';

import DwarfsGold1 from '../assets/icons/Dwarfs/gold/1.png';
import DwarfsGold2 from '../assets/icons/Dwarfs/gold/2.png';
import DwarfsGold3 from '../assets/icons/Dwarfs/gold/3.png';

import DwarfsSilver1 from '../assets/icons/Dwarfs/silver/1.png';
import DwarfsSilver2 from '../assets/icons/Dwarfs/silver/2.png';
import DwarfsSilver3 from '../assets/icons/Dwarfs/silver/3.png';
import DwarfsSilver4 from '../assets/icons/Dwarfs/silver/4.png';
import DwarfsSilver5 from '../assets/icons/Dwarfs/silver/5.png';
import DwarfsUnique from '../assets/icons/Dwarfs/unique/Samurai.png';

import TrolleyCommon from '../assets/icons/Trolley/common.png';
import TrolleyLegendary from '../assets/icons/Trolley/legendary.png';
import TrolleyRunic from '../assets/icons/Trolley/runic.png';
import TrolleySecret from '../assets/icons/Trolley/secret.png';
import TrolleyUnique from '../assets/icons/Trolley/unique.png';

export const getResourcesIcon = (resourceType: string) => {
    const normalizedType = resourceType
        .toUpperCase()
        .replace(/\s+/g, '');

    if (normalizedType.startsWith('DWARF_')) {
        const parts = normalizedType.split('_');
        const dwarfType = parts[1];
        const sort = parts[2];

        switch (dwarfType) {
            case 'COPPER':
                switch (sort) {
                    case '1': return DwarfsCopper1;
                    case '2': return DwarfsCopper2;
                    case '3': return DwarfsCopper3;
                    case '4': return DwarfsCopper4;
                    case '5': return DwarfsCopper5;
                    case '6': return DwarfsCopper6;
                    case '7': return DwarfsCopper7;
                    default: return Copper;
                }
            case 'DIAMOND':
                switch (sort) {
                    case '1': return DwarfsDiamond1;
                    case '2': return DwarfsDiamond2;
                    default: return null;
                }
            case 'GOLD':
                switch (sort) {
                    case '1': return DwarfsGold1;
                    case '2': return DwarfsGold2;
                    case '3': return DwarfsGold3;
                    default: return Gold;
                }
            case 'SILVER':
                switch (sort) {
                    case '1': return DwarfsSilver1;
                    case '2': return DwarfsSilver2;
                    case '3': return DwarfsSilver3;
                    case '4': return DwarfsSilver4;
                    case '5': return DwarfsSilver5;
                    default: return Silver;
                }
            case 'UNIQUE':
                return DwarfsUnique;

            default:
                return null;
        }
    }

    if (normalizedType.startsWith('TROLLEY')) {
        switch (normalizedType) {
            case 'TROLLEY_COMMON': return TrolleyCommon;
            case 'TROLLEY_LEGENDARY': return TrolleyLegendary;
            case 'TROLLEY_RUNIC': return TrolleyRunic;
            case 'TROLLEY_SECRET': return TrolleySecret;
            case 'TROLLEY_UNIQUE': return TrolleyUnique;
            default: return null;
        }
    }

    switch (normalizedType) {
        case 'MAGICORE': return MagicOre;
        case 'LUCKYCHIP': return LuckyChip;
        case 'MMTOKEN': return MMToken;
        case 'MMTOKENSOFT': return MMTokenSoft;
        case 'TON': return Ton;
        case 'GOLD': return Gold;
        case 'EMERALD': return Emerald;
        case 'COPPER': return Copper;
        case 'RUBY': return Ruby;
        case 'SAPPHIRE': return Sapphire;
        case 'SILVER': return Silver;
        case 'SCROLL': return Scroll;
        case 'INCOME': return null;
        case 'ORE': return Ore;
        case 'ARKENSTONE': return Arkenstone;
        default: return null;
    }
};

export const copperIcons: Record<number, string> = {
    1: DwarfsCopper1,
    2: DwarfsCopper2,
    3: DwarfsCopper3,
    4: DwarfsCopper4,
    5: DwarfsCopper5,
    6: DwarfsCopper6,
    7: DwarfsCopper7,
};
