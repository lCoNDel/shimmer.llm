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

    // 2. Add Base Map (Light Mode default to improve legibility)
    // CartoDB Positron is an excellent light base map
    const baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18,
        className: 'cartodb-base-layer'
    }).addTo(map);

    // 3. Add OpenSeaMap layer for Nautical Charts (Buoys, lights, marks)
    // Reverted the scaling trick as it breaks the overlay grid against the 256px base layer.
    // OpenSeaMap renders icons statically at specific zoom levels (usually 10/11+).
    L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 4. UI Elements
    const weatherPanel = document.getElementById('weatherPanel');
    const weatherContent = document.getElementById('weatherContent');
    const loader = document.getElementById('loader');
    const latlonDisplay = document.getElementById('latlonDisplay');
    const geoBtn = document.getElementById('geoBtn');

    // Search Panel Elements
    const searchPanel = document.getElementById('searchPanel');
    const openSearchBtn = document.getElementById('openSearchBtn');
    const closeSearchBtn = document.getElementById('closeSearchBtn');

    // Information Modal Elements
    const infoBtn = document.getElementById('infoBtn');
    const infoModal = document.getElementById('infoModal');
    const closeInfoBtn = document.getElementById('closeInfoBtn');

    const searchInput = document.getElementById('searchInput');
    const dealerList = document.getElementById('dealerList');

    // Legend Panel Elements
    const legendPanel = document.getElementById('legendPanel');
    const openLegendBtn = document.getElementById('openLegendBtn');
    const closeLegendBtn = document.getElementById('closeLegendBtn');

    // Global Search Elements
    const globalSearchInput = document.getElementById('globalSearchInput');
    const globalSearchBtn = document.getElementById('globalSearchBtn');
    const globalSearchResults = document.getElementById('globalSearchResults');

    let currentMarker = null;
    let dealerMarkers = [];
    let globalSearchTimeout = null;

    // Weather Lock / Tracking State
    let isTrackingActive = false;
    let trackingWatchId = null;

    // Unified Boat Marker Update Function
    function updateBoatMarker(latlng) {
        const iconHtml = `<div style="background-color: #3498db; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(52, 152, 219, 0.8);"></div>`;
        const boatIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [20, 20], iconAnchor: [10, 10] });

        if (currentMarker) {
            currentMarker.setLatLng(latlng);
            currentMarker.setIcon(boatIcon);
            currentMarker.setZIndexOffset(1100);
        } else {
            currentMarker = L.marker(latlng, { icon: boatIcon, zIndexOffset: 1100 }).addTo(map);
        }

        // Update SOS Distance if active
        if (isSosActive && sosMarker) {
            const sosLatLng = sosMarker.getLatLng();
            const dist = map.distance(sosLatLng, latlng);
            const distText = document.getElementById('sos-distance-text');
            if (distText) {
                distText.innerHTML = `Distancia a víctima: <strong>${dist.toFixed(1)} metros</strong>`;
            }
        }
    }

    // Handle Global Map Search Suggestions (Nominatim)
    async function fetchSuggestions(query) {
        if (!query || query.length < 3) {
            globalSearchResults.innerHTML = '';
            globalSearchResults.classList.add('hidden');
            return;
        }

        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`;
            const response = await fetch(url);
            const data = await response.json();
            renderSuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    function renderSuggestions(results) {
        globalSearchResults.innerHTML = '';

        if (!results || results.length === 0) {
            globalSearchResults.classList.add('hidden');
            return;
        }

        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';

            // Extract main name and secondary details
            const displayName = result.display_name;
            const parts = displayName.split(',');
            const mainName = parts[0].trim();
            const secondaryText = parts.slice(1).join(',').trim();

            item.innerHTML = `
                <strong>${mainName}</strong>
                <span>${secondaryText}</span>
            `;

            item.addEventListener('click', () => {
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);

                map.flyTo([lat, lon], 13, { duration: 1.5 });

                globalSearchInput.value = displayName;
                globalSearchResults.classList.add('hidden');

                // Add/Update marker
                if (currentMarker) map.removeLayer(currentMarker);
                const iconHtml = `<div style="background-color: var(--brand-primary); width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(107, 181, 255, 0.8);"></div>`;
                const customIcon = L.divIcon({
                    html: iconHtml,
                    className: '',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
                currentMarker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
            });

            globalSearchResults.appendChild(item);
        });

        globalSearchResults.classList.remove('hidden');
    }

    // Handle Global Map Search (Manual Trigger/Fallback)
    async function performGlobalSearch() {
        const query = globalSearchInput.value.trim();
        if (!query) return;

        // Show loading state
        const originalIcon = globalSearchBtn.innerHTML;
        globalSearchBtn.innerHTML = '..';

        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                map.flyTo([lat, lon], 13, { duration: 1.5 });
                globalSearchResults.classList.add('hidden');

                // Add/Update marker
                if (currentMarker) map.removeLayer(currentMarker);
                const iconHtml = `<div style="background-color: var(--brand-primary); width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(107, 181, 255, 0.8);"></div>`;
                const customIcon = L.divIcon({
                    html: iconHtml,
                    className: '',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
                currentMarker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
            } else {
                alert('No se encontró el lugar. Prueba con otro nombre.');
            }
        } catch (error) {
            console.error('Error in manual search:', error);
        } finally {
            globalSearchBtn.innerHTML = originalIcon;
        }
    }

    globalSearchBtn.addEventListener('click', performGlobalSearch);

    globalSearchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (globalSearchTimeout) clearTimeout(globalSearchTimeout);
        globalSearchTimeout = setTimeout(() => fetchSuggestions(query), 400);
    });

    globalSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (globalSearchTimeout) clearTimeout(globalSearchTimeout);
            performGlobalSearch();
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!globalSearchInput.contains(e.target) && !globalSearchResults.contains(e.target)) {
            globalSearchResults.classList.add('hidden');
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

    // Handle Information Modal
    infoBtn.addEventListener('click', () => {
        infoModal.classList.remove('hidden');
    });

    closeInfoBtn.addEventListener('click', () => {
        infoModal.classList.add('hidden');
    });

    // Close modal when clicking outside content
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.classList.add('hidden');
        }
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

                // Close search panel immediately upon selection
                searchPanel.classList.add('closed');
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

    // 5. Handle Map Clicks to fetch Marine Data
    map.on('click', async (e) => {
        if (isTrackingActive) return; // Prevent manual override when GPS lock is active

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

    // 6. Geolocation Logic (With Weather Lock Toggle)
    geoBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta la geolocalización.');
            return;
        }

        if (isTrackingActive) {
            // STOP TRACKING - Guard against SOS
            if (isSosActive) {
                alert("⚠️ EL GPS ES OBLIGATORIO DURANTE S.O.S\n\nNo puedes desactivar el seguimiento mientras hay una emergencia MOB activa.");
                return;
            }
            isTrackingActive = false;
            if (trackingWatchId !== null) {
                navigator.geolocation.clearWatch(trackingWatchId);
                trackingWatchId = null;
            }
            geoBtn.classList.remove('active');
            geoBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Usar mi ubicación actual
            `;
        } else {
            // START TRACKING
            const originalHTML = geoBtn.innerHTML;
            geoBtn.innerHTML = 'Buscando...';
            
            isTrackingActive = true;
            geoBtn.classList.add('active');

            trackingWatchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const latlng = L.latLng(latitude, longitude);

                    // If first time or significantly moved, center map
                    if (geoBtn.innerHTML === 'Buscando...') {
                        const zoomLevel = isSosActive ? 17 : 12;
                        map.flyTo(latlng, zoomLevel, { duration: 1.5 });
                        geoBtn.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            BLOQUEO GPS ACTIVO
                        `;
                    }

                    updateBoatMarker(latlng);

                    // Update weather panel coordinates
                    latlonDisplay.textContent = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`;
                    
                    try {
                        await fetchMarineWeatherAnalysis(latitude, longitude);
                    } catch (error) {
                        console.error("GPS Weather Fetch Error:", error);
                    }
                },
                (error) => {
                    console.error("WatchPosition Error:", error);
                    // Don't kill the tracking immediately if in SOS, maybe it's just a transient error
                    if (isSosActive) {
                        console.warn("GPS glitch during SOS - retrying in background...");
                        return; 
                    }
                    
                    isTrackingActive = false;
                    geoBtn.classList.remove('active');
                    geoBtn.innerHTML = originalHTML;
                    if (trackingWatchId !== null) {
                        navigator.geolocation.clearWatch(trackingWatchId);
                        trackingWatchId = null;
                    }
                    
                    let errorMsg = 'No se pudo obtener tu ubicación precisa.';
                    if (error.code === 1) errorMsg = 'Permiso de ubicación denegado.';
                    if (error.code === 3) errorMsg = 'Tiempo de espera agotado al buscar ubicación.';
                    alert(errorMsg);
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
            );
        }
    });

    // 7. Fetch Open-Meteo Marine Data
    async function fetchMarineWeatherAnalysis(lat, lng) {
        window.lastRequestedLat = lat;
        window.lastRequestedLng = lng;

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
                    <span class="card-label">Oleaje (Swell)</span>
                    <div class="card-value">${data.swellHeight} <span class="card-unit">metros</span></div>
                </div>
                <div class="weather-card">
                    <span class="card-label">Dirección</span>
                    <div class="card-value">${data.swellDirection}° ${dirArrow}</div>
                </div>
                <div class="weather-card">
                    <span class="card-label">Tiempo Ola</span>
                    <div class="card-value">${data.swellPeriod} <span class="card-unit">segundos</span></div>
                </div>
                <div class="weather-card">
                    <span class="card-label">Oleaje (Chop)</span>
                    <div class="card-value">${data.windWaveHeight} <span class="card-unit">metros</span></div>
                </div>
                <div class="weather-card" style="grid-column: span 2;">
                    <span class="card-label">Temperatura Superficie</span>
                    <div class="card-value">${data.waterTemp} <span class="card-unit">°C</span></div>
                </div>
            </div>
        `;

        weatherContent.innerHTML = html;
    }

    // 8. Radio System Integration (Free Radio Browser API)
    const radioSearchInput = document.getElementById('radioSearchInput');
    const radioResults = document.getElementById('radioResults');
    const radioPlayer = document.getElementById('radioPlayer');
    const activeRadio = document.getElementById('activeRadio');
    const radioNameDisplay = document.getElementById('radioNameDisplay');

    async function searchRadioStations(query) {
        if (!query.trim()) return;

        radioResults.innerHTML = '<p style="padding: 0.5rem; text-align: center; font-size: 0.9rem; color: var(--brand-text-muted);">Buscando emisoras...</p>';

        try {
            // Using the free, no-key-required Radio Browser API
            const url = `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(query)}&limit=10&order=clickcount&reverse=true`;

            const response = await fetch(url);
            const data = await response.json();

            radioResults.innerHTML = ''; // clear loading state

            if (data && data.length > 0) {
                data.forEach(station => {
                    const card = document.createElement('div');
                    card.style.cssText = `
                        background: rgba(0, 118, 214, 0.05); 
                        padding: 0.6rem; 
                        border-radius: 6px; 
                        cursor: pointer; 
                        border: 1px solid transparent;
                        transition: all 0.2s;
                    `;

                    const name = station.name || 'Estación Desconocida';
                    const format = station.tags ? station.tags.split(',')[0] : 'Radio';

                    card.innerHTML = `
                        <div style="font-weight: 600; font-size: 0.9rem; color: var(--brand-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${name}</div>
                        <div style="font-size: 0.75rem; color: var(--brand-text-muted);">${format}</div>
                    `;

                    card.addEventListener('mouseover', () => {
                        card.style.borderColor = 'var(--brand-primary)';
                        card.style.background = 'rgba(0, 118, 214, 0.1)';
                    });

                    card.addEventListener('mouseout', () => {
                        card.style.borderColor = 'transparent';
                        card.style.background = 'rgba(0, 118, 214, 0.05)';
                    });

                    card.addEventListener('click', () => {
                        playRadio(station.url_resolved || station.url, name);
                    });

                    radioResults.appendChild(card);
                });
            } else {
                radioResults.innerHTML = '<p class="empty-state" style="padding: 0.5rem; font-size: 0.9rem;">No se encontraron emisoras.</p>';
            }
        } catch (error) {
            console.error("Error fetching radio stations:", error);
            radioResults.innerHTML = '<p style="color: #ff6b6b; padding: 0.5rem; font-size: 0.9rem;">Error al buscar emisoras.</p>';
        }
    }

    function playRadio(streamUrl, name) {
        activeRadio.classList.remove('hidden');
        radioNameDisplay.textContent = name;

        radioPlayer.src = streamUrl;
        radioPlayer.play().catch(e => {
            console.error("Playback failed:", e);
            radioNameDisplay.textContent = "Error de reproducción. Prueba otra.";
            radioNameDisplay.style.color = "#ff6b6b";
        });

        // Reset color on success
        radioPlayer.onplaying = () => {
            radioNameDisplay.style.color = "var(--brand-primary)";
        };

        // Reset search field and results list back to "empty state"
        radioSearchInput.value = '';
        radioResults.innerHTML = '<p class="empty-state" style="padding: 0.5rem; font-size: 0.9rem;">Más de 90,000 estaciones disponibles</p>';
    }

    // Radio Search Debounce Logic
    let radioSearchTimeout = null;

    function handleRadioInput(e) {
        const query = e.target.value;

        // Clear previous timeout
        if (radioSearchTimeout) clearTimeout(radioSearchTimeout);

        if (query.trim().length === 0) {
            radioResults.innerHTML = '<p class="empty-state" style="padding: 0.5rem; font-size: 0.9rem;">Busca una estación para escuchar.</p>';
            return;
        }

        // Show loading state immediately if typing
        if (query.trim().length >= 2) {
            radioResults.innerHTML = '<p style="padding: 0.5rem; text-align: center; font-size: 0.9rem; color: var(--brand-text-muted);">Escribiendo...</p>';
        }

        // Wait 600ms after user stops typing to trigger search
        radioSearchTimeout = setTimeout(() => {
            if (query.trim().length >= 2) {
                searchRadioStations(query);
            }
        }, 600);
    }

    radioSearchInput.addEventListener('input', handleRadioInput);
    radioSearchInput.addEventListener('keyup', (e) => {
        // Force search on enter just in case
        if (e.key === 'Enter') {
            if (radioSearchTimeout) clearTimeout(radioSearchTimeout);
            searchRadioStations(radioSearchInput.value);
        }
    });

    // Custom Radio UI Extension
    const customRadioPlayBtn = document.getElementById('customRadioPlayBtn');
    const customRadioMuteBtn = document.getElementById('customRadioMuteBtn');
    const radioVisualizer = document.getElementById('radioVisualizer');

    // Play/Pause toggling
    if (customRadioPlayBtn) {
        customRadioPlayBtn.addEventListener('click', () => {
            if (!radioPlayer.src) return;
            if (radioPlayer.paused) {
                radioPlayer.play().catch(e => console.log("Play failed", e));
            } else {
                radioPlayer.pause();
            }
        });
    }

    // Mute toggling
    if (customRadioMuteBtn) {
        customRadioMuteBtn.addEventListener('click', () => {
            radioPlayer.muted = !radioPlayer.muted;
            if (radioPlayer.muted) {
                document.getElementById('iconVolWaves').classList.add('hidden');
                document.getElementById('iconVolMute').classList.remove('hidden');
                document.getElementById('iconVolMute2').classList.remove('hidden');
                customRadioMuteBtn.style.color = '#ff6b6b';
            } else {
                document.getElementById('iconVolWaves').classList.remove('hidden');
                document.getElementById('iconVolMute').classList.add('hidden');
                document.getElementById('iconVolMute2').classList.add('hidden');
                customRadioMuteBtn.style.color = 'var(--brand-text-muted)';
            }
        });
    }

    // Volume Slider Logic
    const radioVolumeSlider = document.getElementById('radioVolumeSlider');
    const radioVolumeValue = document.getElementById('radioVolumeValue');
    if (radioVolumeSlider) {
        radioVolumeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            radioPlayer.volume = val;

            // Update percentage text
            if (radioVolumeValue) {
                radioVolumeValue.innerText = `${Math.round(val * 100)}%`;
            }

            // Unmute if volume is adjusted
            if (radioPlayer.muted && radioPlayer.volume > 0) {
                customRadioMuteBtn.click();
            }
        });
    }

    // Audio native events synced with SVG and visualizer
    radioPlayer.addEventListener('play', () => {
        document.getElementById('iconPlay').classList.add('hidden');
        document.getElementById('iconPause').classList.remove('hidden');
        if (radioVisualizer) radioVisualizer.classList.add('playing');
    });

    radioPlayer.addEventListener('pause', () => {
        document.getElementById('iconPause').classList.add('hidden');
        document.getElementById('iconPlay').classList.remove('hidden');
        if (radioVisualizer) radioVisualizer.classList.remove('playing');
    });

    radioPlayer.addEventListener('ended', () => {
        document.getElementById('iconPause').classList.add('hidden');
        document.getElementById('iconPlay').classList.remove('hidden');
        if (radioVisualizer) radioVisualizer.classList.remove('playing');
    });

    // 9. VesselFinder Integration
    const toggleTrafficBtn = document.getElementById('toggleTrafficBtn');
    const vesselFinderOverlay = document.getElementById('vesselFinderOverlay');
    let isTrafficActive = false;
    let vesselIframe = null;

    toggleTrafficBtn.addEventListener('click', () => {
        isTrafficActive = !isTrafficActive;

        if (isTrafficActive) {
            toggleTrafficBtn.classList.add('active');

            // Set off other map modes
            if (isWindLayerActive) windLayerBtn.click();
            if (isRadarActive) owmLayerBtn.click();
            if (isRulerActive) rulerBtn.click();

            // Get current map view
            const center = map.getCenter();
            const zoom = map.getZoom();

            if (!vesselIframe) {
                // Creates and injects iframe dynamically
                vesselIframe = document.createElement('iframe');
                vesselIframe.setAttribute('name', 'vesselfinder');
                vesselIframe.setAttribute('id', 'vesselfinder');
                vesselIframe.setAttribute('width', '100%');
                vesselIframe.setAttribute('height', '100%');
                vesselIframe.setAttribute('frameborder', '0');

                // We use tracking=0 and fleet=false for free api usage
                vesselIframe.src = `https://www.vesselfinder.com/aismap?zoom=${zoom}&lat=${center.lat}&lon=${center.lng}&names=false`;

                vesselFinderOverlay.appendChild(vesselIframe);
            } else {
                // Update src to sync location if it was hidden
                vesselIframe.src = `https://www.vesselfinder.com/aismap?zoom=${zoom}&lat=${center.lat}&lon=${center.lng}&names=false`;
            }

            vesselFinderOverlay.classList.remove('hidden');
            weatherPanel.classList.add('hidden'); // Hide maritime conditions and radio
            searchPanel.classList.add('closed'); // Close dealer search if open
            legendPanel.classList.add('closed'); // Close nautical legend if open

        } else {
            toggleTrafficBtn.classList.remove('active');

            vesselFinderOverlay.classList.add('hidden');
            weatherPanel.classList.remove('hidden'); // Show maritime conditions and radio again
        }
    });

    // 9.5 RainViewer Radar Integration (Replacing OpenWeatherMap)
    const owmLayerBtn = document.getElementById('owmLayerBtn');
    let radarLayer = null;
    let isRadarActive = false;

    // Function to get the latest radar timestamp from RainViewer
    async function getRainViewerTimestamp() {
        try {
            const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
            const data = await response.json();
            // data.radar.past contains an array of timestamps, the last one is the most recent
            if (data && data.radar && data.radar.past && data.radar.past.length > 0) {
                return data.radar.past[data.radar.past.length - 1].time;
            }
        } catch (error) {
            console.error('Error fetching RainViewer timestamps:', error);
        }
        return null;
    }

    if (owmLayerBtn) {
        owmLayerBtn.addEventListener('click', async () => {
            if (isRadarActive) {
                // Disable layer
                if (radarLayer) {
                    map.removeLayer(radarLayer);
                    radarLayer = null;
                }
                owmLayerBtn.classList.remove('active');
                isRadarActive = false;
            } else {
                // Fetch latest timestamp
                const timestamp = await getRainViewerTimestamp();
                if (!timestamp) {
                    alert('No se pudieron obtener datos del radar en este momento.');
                    return;
                }

                // Enable layer
                owmLayerBtn.classList.add('active');

                // Incompatible with vessel finder overriding the map
                if (isTrafficActive) toggleTrafficBtn.click();
                if (isWindLayerActive) windLayerBtn.click();
                if (isRulerActive) rulerBtn.click();

                // Create RainViewer Tile Layer
                // v2/radar/{ts}/256/{z}/{x}/{y}/{color}/{options}.png
                // Color 2 is universal, 1_1 is smooth + labels
                radarLayer = L.tileLayer(`https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/2/1_1.png`, {
                    maxZoom: 18,
                    opacity: 0.7,
                    zIndex: 400,
                    attribution: '&copy; <a href="https://www.rainviewer.com/api.html">RainViewer</a>'
                });

                radarLayer.addTo(map);
                isRadarActive = true;
            }
        });
    }

    // 10. Nautical Ruler

    const rulerBtn = document.getElementById('rulerBtn');
    let isRulerActive = false;
    let rulerPoints = [];
    let rulerPolyline = null;
    let rulerMarkers = [];
    let rulerTooltip = null;
    let rulerHoverLine = null;

    function getBearing(startLat, startLng, destLat, destLng) {
        const startLatRad = startLat * Math.PI / 180;
        const startLngRad = startLng * Math.PI / 180;
        const destLatRad = destLat * Math.PI / 180;
        const destLngRad = destLng * Math.PI / 180;

        const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
        const x = Math.cos(startLatRad) * Math.sin(destLatRad) -
            Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);

        const brng = Math.atan2(y, x);
        const brngDeg = brng * 180 / Math.PI;
        return (brngDeg + 360) % 360;
    }

    function clearRuler() {
        if (rulerPolyline) map.removeLayer(rulerPolyline);
        if (rulerHoverLine) map.removeLayer(rulerHoverLine);
        rulerMarkers.forEach(m => map.removeLayer(m));
        if (rulerTooltip) map.closePopup(rulerTooltip);
        rulerPolyline = null;
        rulerHoverLine = null;
        rulerMarkers = [];
        rulerPoints = [];
        rulerTooltip = null;
    }

    rulerBtn.addEventListener('click', () => {
        isRulerActive = !isRulerActive;
        if (isRulerActive) {
            rulerBtn.classList.add('active');
            document.getElementById('map').style.cursor = 'crosshair';

            // Si el tráfico marítimo u otros modos están activos, los cerramos
            if (isTrafficActive) toggleTrafficBtn.click();
            if (isWindLayerActive) windLayerBtn.click();
            if (isRadarActive) owmLayerBtn.click();

        } else {
            rulerBtn.classList.remove('active');
            document.getElementById('map').style.cursor = '';
            clearRuler();
        }
    });

    map.on('click', (e) => {
        if (!isRulerActive) return;

        if (rulerPoints.length === 2) {
            // Reset if already 2 points
            clearRuler();
        }

        rulerPoints.push(e.latlng);

        const marker = L.circleMarker(e.latlng, {
            radius: 5,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        }).addTo(map);
        rulerMarkers.push(marker);

        if (rulerPoints.length === 1) {
            // First click, initialize hover line
            rulerHoverLine = L.polyline([rulerPoints[0], rulerPoints[0]], {
                color: '#ff7800',
                dashArray: '5, 5',
                weight: 2
            }).addTo(map);

            rulerTooltip = L.popup({
                closeButton: false,
                autoClose: false,
                closeOnClick: false,
                className: 'ruler-popup'
            }).setLatLng(e.latlng).setContent('<div style="font-family: \'Outfit\', sans-serif;">Haz clic en el destino</div>').openOn(map);

        } else if (rulerPoints.length === 2) {
            // Second click, finalize
            if (rulerHoverLine) map.removeLayer(rulerHoverLine);

            rulerPolyline = L.polyline(rulerPoints, {
                color: '#ff7800',
                weight: 3
            }).addTo(map);

            const distanceMeters = map.distance(rulerPoints[0], rulerPoints[1]);
            const distanceNM = (distanceMeters / 1852).toFixed(2);
            const bearing = getBearing(rulerPoints[0].lat, rulerPoints[0].lng, rulerPoints[1].lat, rulerPoints[1].lng).toFixed(0);

            rulerTooltip.setLatLng(rulerPoints[1]).setContent(`
                <div style="text-align: center; font-family: 'Outfit', sans-serif;">
                    <div style="font-weight: 600; font-size: 1.1rem; color: #ff7800;">${distanceNM} NM</div>
                    <div style="font-size: 0.85rem; color: #555;">Rumbo: ${bearing}°</div>
                </div>
             `);
        }
    });

    map.on('mousemove', (e) => {
        if (!isRulerActive || rulerPoints.length !== 1) return;

        // Update hover line
        rulerHoverLine.setLatLngs([rulerPoints[0], e.latlng]);

        // Update popup
        const distanceMeters = map.distance(rulerPoints[0], e.latlng);
        const distanceNM = (distanceMeters / 1852).toFixed(2);
        const bearing = getBearing(rulerPoints[0].lat, rulerPoints[0].lng, e.latlng.lat, e.latlng.lng).toFixed(0);

        rulerTooltip.setLatLng(e.latlng).setContent(`
            <div style="text-align: center; font-family: 'Outfit', sans-serif;">
                <div style="font-weight: 600; font-size: 1.1rem; color: #ff7800;">${distanceNM} NM</div>
                <div style="font-size: 0.85rem; color: #555;">Rumbo: ${bearing}°</div>
            </div>
        `);
    });

    // 11. Custom Waypoints
    let customWaypoints = JSON.parse(localStorage.getItem('shimmer_waypoints')) || [];
    let customMarkers = {};

    const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    function saveWaypoints() {
        localStorage.setItem('shimmer_waypoints', JSON.stringify(customWaypoints));
    }

    function renderWaypointMarker(wp) {
        const marker = L.marker([wp.lat, wp.lng], { icon: redIcon }).addTo(map);

        const popupContent = document.createElement('div');
        popupContent.className = 'waypoint-info';
        popupContent.innerHTML = `
            <h3>${wp.name}</h3>
            <p style="font-size: 0.85rem; color: #666; margin-bottom: 1rem;">
                ${wp.lat.toFixed(4)}, ${wp.lng.toFixed(4)}
            </p>
            <button class="btn btn-danger" id="delete-wp-${wp.id}" style="width: 100%; padding: 0.5rem; font-size: 0.85rem; background: #ff4757; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Eliminar Favorito
            </button>
        `;

        marker.bindPopup(popupContent, { className: 'waypoint-popup' });

        marker.on('popupopen', () => {
            const deleteBtn = document.getElementById(`delete-wp-${wp.id}`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    map.removeLayer(marker);
                    customWaypoints = customWaypoints.filter(w => w.id !== wp.id);
                    delete customMarkers[wp.id];
                    saveWaypoints();
                });
            }
        });

        customMarkers[wp.id] = marker;
    }

    // Render loaded waypoints
    customWaypoints.forEach(renderWaypointMarker);

    // Right Clic implementation
    map.on('contextmenu', (e) => {
        if (isTrafficActive || isRulerActive) return;

        // Create container
        const formContainer = document.createElement('div');
        formContainer.className = 'waypoint-form';

        // Add HTML
        formContainer.innerHTML = `
            <div style="font-weight: 600; font-size: 1rem; color: var(--brand-primary); text-align: center;">Nuevo Favorito</div>
            <input type="text" id="wp-name-input" placeholder="Nombre (ej. Fondeadero Cala)" autocomplete="off">
            <button id="wp-save-btn">Guardar</button>
        `;

        // Bind event to button directly via the container to avoid timing issues
        const saveBtn = formContainer.querySelector('#wp-save-btn');
        const nameInput = formContainer.querySelector('#wp-name-input');

        const popup = L.popup({ className: 'waypoint-popup' })
            .setLatLng(e.latlng)
            .setContent(formContainer)
            .openOn(map);

        saveBtn.addEventListener('click', () => {
            const name = nameInput.value.trim() || 'Punto sin nombre';
            const wp = {
                id: Date.now().toString(),
                name: name,
                lat: e.latlng.lat,
                lng: e.latlng.lng
            };

            customWaypoints.push(wp);
            saveWaypoints();
            map.closePopup(popup);
            renderWaypointMarker(wp);
        });

        // Focus input when popup opens
        setTimeout(() => {
            if (nameInput) nameInput.focus();
        }, 100);
    });

    // 12. Anchor Alarm
    const floatingAlarmToggle = document.getElementById('floatingAlarmToggle');
    const floatingAlarmPanel = document.getElementById('floatingAlarmPanel');

    let anchorAutoCloseTimeout = null;

    floatingAlarmToggle.addEventListener('click', () => {
        const isClosed = floatingAlarmPanel.classList.toggle('closed');

        if (!isClosed) {
            floatingAlarmToggle.classList.add('active'); // Turn on button illumination
        } else {
            // Only remove active if the alarm itself isn't actively monitoring
            if (!isAnchorActive) {
                floatingAlarmToggle.classList.remove('active');
            }
        }

        if (!isClosed && !isAnchorActive) {
            // Panel opened & alarm not active -> start auto-close timer
            if (anchorAutoCloseTimeout) clearTimeout(anchorAutoCloseTimeout);
            anchorAutoCloseTimeout = setTimeout(() => {
                // If it's still open and not active, close it
                if (!floatingAlarmPanel.classList.contains('closed') && !isAnchorActive) {
                    floatingAlarmPanel.classList.add('closed');
                    floatingAlarmToggle.classList.remove('active');
                }
            }, 15000);
        } else {
            // Panel closed OR alarm is active -> clear timer
            if (anchorAutoCloseTimeout) clearTimeout(anchorAutoCloseTimeout);
        }
    });

    const toggleAnchorBtn = document.getElementById('toggleAnchorBtn');
    const anchorRadiusInput = document.getElementById('anchorRadius');
    const anchorStatusPanel = document.getElementById('anchorStatusPanel');
    const anchorDistanceDisplay = document.getElementById('anchorDistanceDisplay');

    let isAnchorActive = false;
    let anchorCenter = null;
    let anchorRadius = 50;
    let anchorCircle = null;
    let watchId = null;
    let alarmAudio = new Audio('https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg');
    alarmAudio.loop = true;

    function stopAnchorAlarm() {
        isAnchorActive = false;
        if (watchId !== null) {
            clearInterval(watchId);
            watchId = null;
        }
        if (anchorCircle) {
            map.removeLayer(anchorCircle);
            anchorCircle = null;
        }
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
        anchorCenter = null;

        toggleAnchorBtn.textContent = 'ACTIVAR ALARMA';
        toggleAnchorBtn.classList.add('btn-primary');
        toggleAnchorBtn.classList.remove('btn-danger');
        anchorStatusPanel.classList.add('hidden');
        
        if (floatingAlarmPanel.classList.contains('closed')) {
            floatingAlarmToggle.classList.remove('active');
        }
    }

    let hasSentNotification = false;

    function triggerAlarm() {
        anchorStatusPanel.style.borderColor = '#ff4757';
        anchorStatusPanel.style.background = 'rgba(255, 71, 87, 0.1)';
        anchorStatusPanel.innerHTML = `
            <div style="color: #ff4757; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.3rem; animation: pulse 1s infinite;">⚠️ GARREANDO ⚠️</div>
            <div id="anchorDistanceDisplay" style="font-size: 0.85rem; color: #ff4757; font-weight: 600;">
                ¡Has salido del radio de seguridad!
            </div>
        `;
        if (anchorCircle) anchorCircle.setStyle({ color: '#ff4757', fillColor: '#ff4757' });

        // Play sound if not already playing
        if (alarmAudio.paused) {
            alarmAudio.play().catch(e => console.error("Audio play blocked by browser:", e));
        }

        // Send browser notification if permitted and not already sent for this drag event
        if (Notification.permission === 'granted' && !hasSentNotification) {
            hasSentNotification = true;
            new Notification('¡Atención! Alarma de Fondeo', {
                body: 'Tu embarcación ha salido del radio de seguridad establecido. ¡Comprueba tu posición!',
                icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233816.png' // Generic anchor icon
            });
        }
    }

    function startAnchorWatch(position) {
        hasSentNotification = false; // Reset notification flag on start
        anchorCenter = L.latLng(position.coords.latitude, position.coords.longitude);
        anchorRadius = parseInt(anchorRadiusInput.value, 10) || 50;

        // Draw initial circle
        anchorCircle = L.circle(anchorCenter, {
            color: '#2ecc71',
            fillColor: '#2ecc71',
            fillOpacity: 0.15,
            radius: anchorRadius
        }).addTo(map);

        map.setView(anchorCenter, 18); // Zoom in close to see the circle

        // Start tracking via manual polling to avoid browser aggressive caching
        watchId = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const currentPos = L.latLng(pos.coords.latitude, pos.coords.longitude);
                    const distance = map.distance(anchorCenter, currentPos);

                    const display = document.getElementById('anchorDistanceDisplay');
                    if (display) {
                        display.innerHTML = `Distancia actual: <strong>${distance.toFixed(1)}m</strong> / ${anchorRadius}m`;
                    }

                    if (distance > anchorRadius) {
                        triggerAlarm();
                    } else {
                        // Reset to green if we drift back in
                        if (anchorCircle) anchorCircle.setStyle({ color: '#2ecc71', fillColor: '#2ecc71' });
                        anchorStatusPanel.style.borderColor = '#2ecc71';
                        anchorStatusPanel.style.background = 'rgba(46, 204, 113, 0.1)';
                        anchorStatusPanel.innerHTML = `
                            <div style="color: #2ecc71; font-weight: 600; font-size: 0.95rem; margin-bottom: 0.3rem;">🛡️ Alarma Armada</div>
                            <div id="anchorDistanceDisplay" style="font-size: 0.85rem; color: var(--brand-text-muted);">
                                Distancia actual: <strong>${distance.toFixed(1)}m</strong> / ${anchorRadius}m
                            </div>
                        `;
                        alarmAudio.pause();
                        hasSentNotification = false;
                    }
                },
                (err) => {
                    console.warn(`Polling ERROR(${err.code}): ${err.message}`);
                    // Fallos esporádicos en polling se ignoran temporalmente en vez de matar la app
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 4500
                }
            );
        }, 5000); // Check every 5 seconds
    }

    toggleAnchorBtn.addEventListener('click', () => {
        // Clear any auto-close timeout when interacting with the button
        if (anchorAutoCloseTimeout) clearTimeout(anchorAutoCloseTimeout);

        if (isAnchorActive) {
            stopAnchorAlarm();
        } else {
            if (!navigator.geolocation) {
                alert("Tu navegador no soporta geolocalización.");
                return;
            }

            // Ask for Notification Permissions before starting
            if ('Notification' in window && Notification.permission !== 'granted') {
                Notification.requestPermission();
            }

            // Set UI to loading state
            toggleAnchorBtn.textContent = 'OBTENIENDO GPS...';
            toggleAnchorBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    isAnchorActive = true;
                    toggleAnchorBtn.disabled = false;
                    toggleAnchorBtn.textContent = 'DESACTIVAR ALARMA';
                    toggleAnchorBtn.classList.remove('btn-primary');
                    toggleAnchorBtn.classList.add('btn-danger'); // Add a danger class if you have one, or configure CSS
                    anchorStatusPanel.classList.remove('hidden');

                    startAnchorWatch(position);
                },
                (err) => {
                    toggleAnchorBtn.disabled = false;
                    toggleAnchorBtn.textContent = 'ACTIVAR ALARMA';
                    alert(`No se pudo obtener la ubicación: ${err.message}`);
                },
                { enableHighAccuracy: true }
            );
        }
    });

    // 13. Wind Particle Animation Layer (Leaflet-Velocity)
    const windLayerBtn = document.getElementById('windLayerBtn');
    let velocityLayer = null;
    let isWindLayerActive = false;

    windLayerBtn.addEventListener('click', async () => {
        if (isWindLayerActive) {
            // Turn off the wind layer
            if (velocityLayer) {
                map.removeLayer(velocityLayer);
            }
            windLayerBtn.classList.remove('active');
            isWindLayerActive = false;
        } else {
            // Turn on the wind layer
            windLayerBtn.classList.add('active');

            // Set off other map modes
            if (isTrafficActive) toggleTrafficBtn.click();
            if (isRadarActive) owmLayerBtn.click();
            if (isRulerActive) rulerBtn.click();

            try {
                // Fetch the downloaded GFS wind data (wind-global.json)
                const response = await fetch('wind-global.json');
                const data = await response.json();

                velocityLayer = L.velocityLayer({
                    displayValues: true,
                    displayOptions: {
                        velocityType: 'Global Wind',
                        position: 'bottomleft',
                        emptyString: 'Sin datos de viento',
                        angleConvention: 'bearingCW',
                        displayPosition: 'bottomleft',
                        displayEmptyString: 'Sin datos de viento',
                        speedUnit: 'k/h'
                    },
                    data: data,
                    maxVelocity: 25, // increase max velocity to spread colors better
                    velocityScale: 0.01, // double the particle speed
                    particleAge: 90, // how long particles live before dying
                    particleMultiplier: 1 / 200, // higher density of particles
                    lineWidth: 3, // thicker, more visible lines
                    colorScale: [
                        "rgba(255, 255, 255, 0.9)", // White (Low wind)
                        "rgba(0, 255, 255, 0.9)",   // Cyan
                        "rgba(0, 200, 255, 0.9)",   // Light Blue
                        "rgba(0, 150, 255, 0.9)",   // Blue
                        "rgba(100, 255, 100, 0.9)", // Light Green
                        "rgba(0, 255, 0, 0.9)",     // Green
                        "rgba(200, 255, 0, 0.9)",   // Yellow-Green
                        "rgba(255, 255, 0, 0.9)",   // Yellow
                        "rgba(255, 200, 0, 0.9)",   // Orange-Yellow
                        "rgba(255, 150, 0, 0.9)",   // Orange
                        "rgba(255, 100, 0, 0.9)",   // Dark Orange
                        "rgba(255, 50, 0, 0.9)",    // Red-Orange
                        "rgba(255, 0, 0, 0.9)",     // Red
                        "rgba(200, 0, 50, 0.9)",    // Dark Red
                        "rgba(150, 0, 100, 0.9)"    // Purple (Extreme wind)
                    ]
                });

                velocityLayer.addTo(map);
                isWindLayerActive = true;

            } catch (error) {
                console.error('Error loading wind data:', error);
                alert('No se pudo cargar la capa de viento. Verifique si el archivo wind-global.json existe y es accesible.');
                windLayerBtn.classList.remove('active');
                isWindLayerActive = false;
            }
        }
    });

    // 14. SOS / Hombre al Agua (MOB) Logic
    const floatingSosBtn = document.getElementById('floatingSosBtn');
    let sosMarker = null;
    let sosWatchId = null;
    let isSosActive = false;

    // Custom Icon for SOS Marker
    const sosIconHtml = `
        <div style="
            background-color: #ff4757; 
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            border: 4px solid white; 
            box-shadow: 0 0 15px rgba(255, 71, 87, 0.9);
            animation: pulse-red 1s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 10px;
        ">SOS</div>
    `;
    const sosIcon = L.divIcon({
        html: sosIconHtml,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    // Add pulse animation style to document if not exists
    if (!document.getElementById('sos-pulse-style')) {
        const style = document.createElement('style');
        style.id = 'sos-pulse-style';
        style.innerHTML = `
            @keyframes pulse-red {
                0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7); }
                70% { box-shadow: 0 0 0 15px rgba(255, 71, 87, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
            }
        `;
        document.head.appendChild(style);
    }

    function stopSosAlarm() {
        if (sosMarker) {
            map.removeLayer(sosMarker);
            sosMarker = null;
        }
        if (sosWatchId !== null) {
            sosWatchId = null;
        }
        isSosActive = false;

        // Reset button UI
        floatingSosBtn.style.animation = 'none';
        floatingSosBtn.style.background = '#ff4757';
        floatingSosBtn.title = '¡HOMBRE AL AGUA (MOB)!';

        // Remove tracking panel if it exists
        const oldPanel = document.getElementById('sos-tracking-panel');
        if (oldPanel) oldPanel.remove();
    }

    function activateSos(sosLatLng) {
        isSosActive = true;

        // 1. Place Permanent Marker (MOB Point)
        sosMarker = L.marker(sosLatLng, { icon: sosIcon, zIndexOffset: 1000 }).addTo(map);

        // 2. Focus Map tightly on the emergency
        map.setView(sosLatLng, 17);

        // 3. Update Boat Marker IMMEDIATELY with the same coordinates
        updateBoatMarker(sosLatLng);

        // 4. Update Button UI to show it's active
        floatingSosBtn.style.animation = 'pulse-red 1s infinite';
        floatingSosBtn.title = 'S.O.S ACTIVO (Clic para gestionar)';

        // 5. Create Tracking Panel
        const trackingPanel = document.createElement('div');
        trackingPanel.id = 'sos-tracking-panel';
        trackingPanel.style.cssText = `
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 71, 87, 0.95);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 2000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            text-align: center;
            border: 2px solid white;
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;
        trackingPanel.innerHTML = `
            <div style="font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.5rem;">⚠️</span> EMERGENCIA MOB ACTIVA
            </div>
            <div id="sos-distance-text" style="font-size: 1rem; font-weight: 600;">
                Distancia a víctima: Calculando...
            </div>
            <div style="font-size: 0.8rem; opacity: 0.9;">
                Coord: ${sosLatLng.lat.toFixed(5)}, ${sosLatLng.lng.toFixed(5)}
            </div>
        `;
        document.querySelector('.app-container').appendChild(trackingPanel);

        // 6. Ensure real-time boat tracking is active
        if (!isTrackingActive) {
            geoBtn.click();
        }
    }

    floatingSosBtn.addEventListener('click', () => {
        if (isSosActive) {
            // DOUBLE CONFIRMATION to cancel SOS
            const firstConfirm = confirm("⚠️ ¿ESTÁS SEGURO DE DETENER LA ALARMA S.O.S?\n\nSi detienes la alarma, se borrará la marca de HOMBRE AL AGUA del mapa.");
            if (firstConfirm) {
                const secondConfirm = confirm("🛑 CONFIRMACIÓN DE SEGURIDAD 🛑\n\n¿Cancelamos definitivamente el rescate y borramos el marcador S.O.S?");
                if (secondConfirm) {
                    stopSosAlarm();
                    alert("Alarma S.O.S desactivada.");
                }
            }
            return;
        }

        // ACTIVATE SOS
        // --- OPTIMIZATION: REUSE EXISTING GPS IF ACTIVE ---
        if (isTrackingActive && currentMarker) {
            const sosLatLng = currentMarker.getLatLng();
            activateSos(sosLatLng);
            return;
        }

        if (!navigator.geolocation) {
            alert("Error crítico: Tu navegador no soporta geolocalización. Imposible marcar S.O.S.");
            return;
        }

        // --- IMMEDIATE FEEDBACK ---
        const originalHTML = floatingSosBtn.innerHTML;
        floatingSosBtn.innerHTML = '<span style="font-size: 0.7rem; font-weight: 800;">GPS...</span>';
        floatingSosBtn.style.background = '#e84118';
        floatingSosBtn.title = 'Obteniendo GPS Crítico...';

        // High priority GPS request
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                floatingSosBtn.innerHTML = originalHTML;
                const sosLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
                activateSos(sosLatLng);
            },
            (err) => {
                floatingSosBtn.innerHTML = originalHTML;
                floatingSosBtn.style.background = '#ff4757';
                alert(`Error al obtener GPS Crítico: ${err.message}`);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    });

    // 15. Utilities Dropdown Logic
    const utilidadesToggleBtn = document.getElementById('utilidadesToggleBtn');
    const utilidadesDropdown = document.getElementById('utilidadesDropdown');

    if (utilidadesToggleBtn && utilidadesDropdown) {
        utilidadesToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            utilidadesDropdown.classList.toggle('closed');
        });

        document.addEventListener('click', (e) => {
            if (!utilidadesDropdown.contains(e.target) && e.target !== utilidadesToggleBtn) {
                utilidadesDropdown.classList.add('closed');
            }
        });

        // Cierra el menú cuando se hace clic en cualquier opción interna
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                utilidadesDropdown.classList.add('closed');
            });
        });
    }

    // 16. Guía de Uso Modal Logic
    const openGuideBtn = document.getElementById('openGuideBtn');
    const closeGuideBtn = document.getElementById('closeGuideBtn');
    const guideModal = document.getElementById('guideModal');

    if (openGuideBtn && closeGuideBtn && guideModal) {
        openGuideBtn.addEventListener('click', () => {
            guideModal.classList.remove('hidden');
        });

        closeGuideBtn.addEventListener('click', () => {
            guideModal.classList.add('hidden');
        });

        // Close when clicking outside of the modal content
        guideModal.addEventListener('click', (e) => {
            if (e.target === guideModal) {
                guideModal.classList.add('hidden');
            }
        });
    }

});
