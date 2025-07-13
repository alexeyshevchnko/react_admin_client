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

export const getResourcesIcon = (resourceType: string) => {
       const normalizedType = resourceType
        .toUpperCase()
        .replace(/\s+/g, ''); 

    switch (normalizedType) {
        case 'MAGICORE':
            return MagicOre;
        case 'LUCKYCHIP':
            return LuckyChip;
        case 'MMTOKEN':
            return MMToken;
        case 'MMTOKENSOFT':
            return MMTokenSoft;
        case 'TON':
            return Ton;
        case 'GOLD':
            return Gold;
        case 'EMERALD':
            return Emerald;
        case 'COPPER':
            return Copper;
        case 'RUBY':
            return Ruby;
        case 'SAPPHIRE':
            return Sapphire;
        case 'SILVER':
            return Silver;
        case 'SCROLL':
            return Scroll;
        case 'INCOME': 
            return null;
        case 'ORE': 
            return null;
        default:
            //console.warn(`Unknown resource type: ${resourceType}`);
            return null;
    }
};


