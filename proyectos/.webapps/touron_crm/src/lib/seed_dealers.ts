
import { db } from './db';
import { clients } from './schema';

const realDealers = [
    // Andalucía
    { name: "Mecánica Náutica del Sur", location: "Benalmádena, Málaga", region: "Sur", type: "Dealer", email: "info@mecanicanautica.com" },
    { name: "Marina Marbella", location: "Marbella, Málaga", region: "Sur", type: "Dealer", email: "service@marinamarbella.com", tier: "Premium" },
    { name: "Náutica Jonatan López", location: "Málaga", region: "Sur", type: "Dealer", email: "contacto@nauticalopez.com" },
    { name: "Xtreme Marine Spain", location: "Puerto Banús, Málaga", region: "Sur", type: "Dealer", email: "info@xtrememarine.es", tier: "Premium" },
    { name: "River Boats Náutica", location: "Alcolea, Córdoba", region: "Sur", type: "Dealer", email: "riverboats@email.com" },
    { name: "SUN SAILS Yachts", location: "Sevilla", region: "Sur", type: "Dealer", email: "info@sunsails.es" },

    // Baleares
    { name: "Marine Point", location: "Palma de Mallorca", region: "Baleares", type: "Dealer", email: "office@marinepoint.com" },
    { name: "Pinmar Yacht", location: "Palma de Mallorca", region: "Baleares", type: "Dealer", email: "support@pinmar.com", tier: "Premium" },
    { name: "Náutica Pins", location: "La Sabina, Formentera", region: "Baleares", type: "Dealer", email: "info@nauticapins.com" },
    { name: "Náutica Mari", location: "Santa Eulalia, Ibiza", region: "Baleares", type: "Dealer", email: "nauticamari@email.com" },
    { name: "Olmo Marine", location: "Portals Nous, Mallorca", region: "Baleares", type: "Dealer", email: "service@olmomarine.com" },
    { name: "Tot Nàutic", location: "Andratx, Mallorca", region: "Baleares", type: "Service", email: "info@totnautic.com" },
    { name: "Supermercado Náutico", location: "Ibiza", region: "Baleares", type: "Dealer", email: "shop@supernautico.com" },
    { name: "Náutica Santa Eulalia", location: "Ibiza", region: "Baleares", type: "Dealer", email: "info@nauticasantaeulalia.com" },

    // Canarias
    { name: "Motonáutica Las Palmas", location: "Agüimes, Las Palmas", region: "Canarias", type: "Dealer", email: "ventas@motonauticalaspalmas.com" },

    // Centro
    { name: "Nautimotor", location: "Pelayos de la Presa, Madrid", region: "Centro", type: "Dealer", email: "madrid@nautimotor.com" },

    // Levante
    { name: "Marina Sureste", location: "Los Alcázares, Murcia", region: "Levante", type: "Dealer", email: "marina@sureste.com" },

    // Norte
    { name: "TBO Marine", location: "Redondela, Pontevedra", region: "Norte", type: "Service", email: "tbo@marine.gal" },

    // Cataluña
    { name: "Náutica Palamós", location: "Palamós, Girona", region: "Norte", type: "Dealer", email: "info@nauticapalamos.com" },
];

async function seedDealers() {
    console.log('Seeding real Touron dealers...');

    for (const dealer of realDealers) {
        try {
            await db.insert(clients).values({
                name: dealer.name,
                type: dealer.type,
                email: dealer.email,
                location: dealer.location,
                region: dealer.region,
                tier: dealer.tier || 'Official',
                status: 'Active',
                phone: '+34 900 000 000', // Placeholder
                address: dealer.location,
            });
            console.log(`Added: ${dealer.name}`);
        } catch (e) {
            console.error(`Error adding ${dealer.name}:`, e);
        }
    }

    console.log('Done!');
}

seedDealers();
