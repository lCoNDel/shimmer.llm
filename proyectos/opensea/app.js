document.addEventListener('DOMContentLoaded', () => {
    // 0. Touron S.A. Dealer Network Data
    // 0. Touron S.A. Dealer Network Data (Exhaustive List)
    const dealers = [
        { name: "Touron S.A. (Sede Central)", lat: 40.4561, lng: -3.4562, location: "Torrejón de Ardoz, Madrid" },
        // Galicia & Asturias
        { name: "Náutica Perez", lat: 42.2328, lng: -8.7226, location: "Vigo, Pontevedra" },
        { name: "Astilleros Amilibia", lat: 43.3083, lng: -2.0003, location: "Orio, Gipuzkoa" },
        { name: "Nautica Cangas", lat: 42.2644, lng: -8.7844, location: "Cangas, Pontevedra" },
        { name: "Marina Sada", lat: 43.3551, lng: -8.2461, location: "Sada, A Coruña" },
        { name: "Astilleros de Bermeo", lat: 43.4189, lng: -2.7196, location: "Bermeo, Bizkaia" },
        { name: "Marina Yates", lat: 43.5413, lng: -5.6601, location: "Gijón, Asturias" },
        // Cataluña
        { name: "Hermanos Guasch", lat: 41.0183, lng: 0.9634, location: "L'Hospitalet de l'Infant, Tarragona" },
        { name: "Motonáutica Llonch", lat: 41.8211, lng: 3.0336, location: "Sant Feliu de Guíxols, Girona" },
        { name: "Nautic Center Menorca (Sede BCN)", lat: 41.3851, lng: 2.1734, location: "Barcelona" },
        { name: "Marina Estrella", lat: 41.7107, lng: 2.8256, location: "Blanes, Girona" },
        { name: "Náutica Casas", lat: 41.8105, lng: 3.0645, location: "Platja d'Aro, Girona" },
        { name: "Jaume Vermell Nautica", lat: 41.7451, lng: 2.9150, location: "Tossa de Mar, Girona" },
        // Baleares
        { name: "Náutica Reynés", lat: 39.8879, lng: 4.2546, location: "Mahón, Menorca" },
        { name: "Nautic Center Menorca", lat: 39.9984, lng: 3.8291, location: "Ciutadella de Menorca" },
        { name: "Pedro's Boat", lat: 39.8863, lng: 4.2678, location: "Maó, Menorca" },
        { name: "Campos Marinos", lat: 39.5696, lng: 2.6502, location: "Palma de Mallorca" },
        { name: "Náutica Colom", lat: 39.4214, lng: 3.2687, location: "Portocolom, Mallorca" },
        { name: "Ibiza Náutica", lat: 38.9067, lng: 1.4206, location: "Ibiza" },
        // Levante (Comunidad Valenciana & Murcia)
        { name: "Náutica Marina Sport", lat: 38.3840, lng: -0.4984, location: "Alicante" },
        { name: "Náutica Mengual", lat: 38.6253, lng: 0.0524, location: "Calp, Alicante" },
        { name: "Motonáutica Ibiza", lat: 38.8351, lng: 0.1118, location: "Dénia, Alicante" },
        { name: "Don Marino Boats", lat: 36.4251, lng: -5.1472, location: "Estepona, Málaga" }, // Technically Andalusia but moving south
        { name: "San Pedro Náutica", lat: 37.8288, lng: -0.7892, location: "San Pedro del Pinatar, Murcia" },
        { name: "Náutica Mar Menor", lat: 37.6416, lng: -0.7180, location: "Cabo de Palos, Murcia" },
        // Andalucía
        { name: "Marinas de Andalucía", lat: 36.5050, lng: -4.8824, location: "Marbella, Málaga" },
        { name: "Náutica Corcho", lat: 37.2614, lng: -6.9447, location: "Huelva" },
        { name: "Almería Náutica", lat: 36.8340, lng: -2.4637, location: "Almería" },
        { name: "Cádiz Marítima", lat: 36.5271, lng: -6.2886, location: "Cádiz" },
        { name: "Sherry Náutica", lat: 36.5828, lng: -6.2307, location: "El Puerto de Santa María, Cádiz" },
        // Canarias
        { name: "Náutica El Chicharro", lat: 28.4682, lng: -16.2546, location: "Santa Cruz de Tenerife" },
        { name: "Las Palmas Marinas", lat: 28.1235, lng: -15.4363, location: "Las Palmas de Gran Canaria" },
        // Portugal
        { name: "Touron Portugal (Sucursal)", lat: 38.6968, lng: -9.4206, location: "Cascais, Portugal" },
        { name: "Lisnave", lat: 38.6534, lng: -9.0494, location: "Setúbal, Portugal" },
        { name: "Angel Pilot", lat: 37.1352, lng: -8.5377, location: "Portimão, Portugal" }
    ];

    // 1. Initialize Map
    // Coordinates set to focus on the Balearic Islands / Mediterranean coast of Spain by default
    const map = L.map('map', {
        zoomControl: false // We will move it to bottom right
    }).setView([39.5, 2.5], 7);

    // Relocate zoom control
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // 2. Add Base Map (Dark Mode to match branding)
    // CartoDB Dark Matter is an excellent dark base map
    const baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18
    }).addTo(map);

    // 3. Add OpenSeaMap layer for Nautical Charts (Buoys, lights, marks)
    L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 4. UI Elements
    const weatherPanel = document.getElementById('weatherPanel');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const weatherContent = document.getElementById('weatherContent');
    const loader = document.getElementById('loader');
    const latlonDisplay = document.getElementById('latlonDisplay');
    const geoBtn = document.getElementById('geoBtn');

    // Search Panel Elements
    const searchPanel = document.getElementById('searchPanel');
    const openSearchBtn = document.getElementById('openSearchBtn');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchInput = document.getElementById('searchInput');
    const dealerList = document.getElementById('dealerList');

    // Legend Panel Elements
    const legendPanel = document.getElementById('legendPanel');
    const openLegendBtn = document.getElementById('openLegendBtn');
    const closeLegendBtn = document.getElementById('closeLegendBtn');

    // Theme Elements
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');

    let currentMarker = null;
    let dealerMarkers = [];

    // Handle Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');

        if (isLightMode) {
            // Switch map to CartoDB Positron (Light)
            baseLayer.setUrl('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');
            // Change icon to Moon
            themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        } else {
            // Switch map back to Carto Dark Matter
            baseLayer.setUrl('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png');
            // Change icon to Sun
            themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
        }
    });

    // Handle Search Panel events
    openSearchBtn.addEventListener('click', () => {
        searchPanel.classList.remove('closed');
        searchInput.focus();
        // Close legend if open to avoid clutter
        legendPanel.classList.add('closed');
    });

    closeSearchBtn.addEventListener('click', () => {
        searchPanel.classList.add('closed');
    });

    // Handle Legend Panel events
    openLegendBtn.addEventListener('click', () => {
        legendPanel.classList.toggle('closed'); // acts as a toggle
        // Close search if open
        if (!legendPanel.classList.contains('closed')) {
            searchPanel.classList.add('closed');
        }
    });

    closeLegendBtn.addEventListener('click', () => {
        legendPanel.classList.add('closed');
    });

    // Populate Dealer Markers and List
    function initDealers() {
        // Custom icon for dealers
        const dealerIconHtml = `<div style="background-color: transparent; width: 14px; height: 14px; border-radius: 50%; border: 3px solid var(--brand-primary); box-shadow: 0 0 10px rgba(107, 181, 255, 0.8);"></div>`;
        const dealerIcon = L.divIcon({
            html: dealerIconHtml,
            className: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        dealers.forEach((dealer, index) => {
            // Add marker to map
            const marker = L.marker([dealer.lat, dealer.lng], { icon: dealerIcon }).addTo(map);
            marker.bindPopup(`<b>${dealer.name}</b><br>${dealer.location}`);
            dealerMarkers.push({ data: dealer, marker: marker });
        });

        renderDealerList(dealers);
    }

    function renderDealerList(filteredDealers) {
        dealerList.innerHTML = '';
        if (filteredDealers.length === 0) {
            dealerList.innerHTML = '<div class="empty-state">No se encontraron clientes.</div>';
            return;
        }

        filteredDealers.forEach((dealer) => {
            const card = document.createElement('div');
            card.className = 'dealer-card';
            card.innerHTML = `
                <div class="dealer-name">${dealer.name}</div>
                <div class="dealer-location">${dealer.location}</div>
            `;

            card.addEventListener('click', () => {
                map.flyTo([dealer.lat, dealer.lng], 13, { duration: 1.5 });
                // Find and open popup
                const match = dealerMarkers.find(m => m.data.name === dealer.name);
                if (match) {
                    setTimeout(() => match.marker.openPopup(), 1500);
                }

                // On mobile, maybe close search panel
                if (window.innerWidth < 768) {
                    searchPanel.classList.add('closed');
                }
            });

            dealerList.appendChild(card);
        });
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = dealers.filter(d =>
            d.name.toLowerCase().includes(query) ||
            d.location.toLowerCase().includes(query)
        );
        renderDealerList(filtered);
    });

    initDealers();

    // Handle closing the weather panel
    closePanelBtn.addEventListener('click', () => {
        weatherPanel.classList.add('closed');
        if (currentMarker) map.removeLayer(currentMarker);
    });

    // 5. Handle Map Clicks to fetch Marine Data
    map.on('click', async (e) => {
        const { lat, lng } = e.latlng;

        // Update Marker
        if (currentMarker) {
            currentMarker.setLatLng(e.latlng);
        } else {
            // Create a custom styled marker using Leaflet DivIcon
            const iconHtml = `<div style="background-color: var(--brand-primary); width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(107, 181, 255, 0.8);"></div>`;
            const customIcon = L.divIcon({
                html: iconHtml,
                className: '',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            currentMarker = L.marker(e.latlng, { icon: customIcon }).addTo(map);
        }

        // Open panel and show loader
        weatherPanel.classList.remove('closed');
        latlonDisplay.textContent = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
        weatherContent.classList.add('hidden');
        loader.classList.remove('hidden');

        try {
            await fetchMarineWeatherAnalysis(lat, lng);
        } catch (error) {
            console.error("Error fetching marine dat:", error);
            loader.classList.add('hidden');
            weatherContent.classList.remove('hidden');
            weatherContent.innerHTML = `
                <div class="empty-state">
                    <p style="color: #ff6b6b;">No se pudo obtener datos marinos para esta ubicación. Asegúrate de hacer clic en el mar.</p>
                </div>
            `;
        }
    });

    // 6. Geolocation Logic
    geoBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta la geolocalización.');
            return;
        }

        const originalText = geoBtn.innerHTML;
        geoBtn.innerHTML = 'Buscando...';
        geoBtn.style.opacity = '0.7';

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const latlng = L.latLng(latitude, longitude);

                // Fly to user location
                map.flyTo(latlng, 10, {
                    duration: 1.5
                });

                // Simulate a map click to trigger the weather data fetch
                map.fire('click', { latlng: latlng });

                geoBtn.innerHTML = originalText;
                geoBtn.style.opacity = '1';
            },
            (error) => {
                geoBtn.innerHTML = originalText;
                geoBtn.style.opacity = '1';
                let errorMsg = 'No se pudo obtener la ubicación.';
                if (error.code === 1) errorMsg = 'Permiso de ubicación denegado por el usuario.';
                if (error.code === 2) errorMsg = 'Ubicación no disponible.';
                if (error.code === 3) errorMsg = 'Tiempo de espera agotado al buscar ubicación.';
                alert(errorMsg);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });

    // 7. Fetch Open-Meteo Marine Data
    async function fetchMarineWeatherAnalysis(lat, lng) {
        // We request current swell data (fondo), wind wave data, and hourly sea surface temperature
        const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=swell_wave_height,swell_wave_direction,swell_wave_period,wind_wave_height&hourly=sea_surface_temperature`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();

        // If data.current is undefined, it might be an invalid point (like land far inland)
        if (!data.current) throw new Error("No current data found for this location");

        const swellHeight = data.current.swell_wave_height;
        const swellDirection = data.current.swell_wave_direction; // degrees
        const swellPeriod = data.current.swell_wave_period;
        const windWaveHeight = data.current.wind_wave_height;

        // Sea Surface Temperature is an hourly array, we take the first value
        let wTemp = '-';
        if (data.hourly && data.hourly.sea_surface_temperature && data.hourly.sea_surface_temperature.length > 0) {
            wTemp = data.hourly.sea_surface_temperature[0];
        }

        // Render UI
        renderWeatherGrid({
            swellHeight: swellHeight !== null ? swellHeight : '-',
            swellDirection: swellDirection !== null ? swellDirection : '-',
            swellPeriod: swellPeriod !== null ? swellPeriod : '-',
            windWaveHeight: windWaveHeight !== null ? windWaveHeight : '-',
            waterTemp: wTemp !== null ? wTemp : '-'
        });
    }

    function renderWeatherGrid(data) {
        loader.classList.add('hidden');
        weatherContent.classList.remove('hidden');

        let dirArrow = '';
        if (data.swellDirection !== '-') {
            dirArrow = `<span style="display:inline-block; transform: rotate(${data.swellDirection}deg);">↓</span>`;
        }

        const html = `
            <div class="weather-grid">
                <div class="weather-card">
                    <span class="card-label">Mar de Fondo (Swell)</span>
                    <div class="card-value">${data.swellHeight} <span class="card-unit">metros</span></div>
                </div>
                <div class="weather-card">
                    <span class="card-label">Dirección (Swell)</span>
                    <div class="card-value">${data.swellDirection}° ${dirArrow}</div>
                </div>
                <div class="weather-card">
                    <span class="card-label">Periodo (Swell)</span>
                    <div class="card-value">${data.swellPeriod} <span class="card-unit">seg</span></div>
                </div>
                <div class="weather-card">
                    <span class="card-label">Mar de Viento</span>
                    <div class="card-value">${data.windWaveHeight} <span class="card-unit">metros</span></div>
                </div>
                <div class="weather-card" style="grid-column: span 2;">
                    <span class="card-label">Temperatura del Agua Superficial</span>
                    <div class="card-value">${data.waterTemp} <span class="card-unit">°C</span></div>
                </div>
            </div>
        `;

        weatherContent.innerHTML = html;
    }
});
