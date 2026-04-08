document.addEventListener('DOMContentLoaded', async () => {
    // 0. red de distribuidores touron s.a.
    const dealers = [
        {
            name: "Touron S.A. (Sede Central)", lat: 40.4561, lng: -3.4562, location: "Torrejón de Ardoz, Madrid",
            address: "Calle Mario Vargas Llosa, 20, 28850 Torrejón de Ardoz, Madrid",
            phone: "+34 916 57 27 73", email: "touron@touronsa.es", web: "www.touronsa.es",
            description: "Sede central — distribución de motores fueraborda, embarcaciones y accesorios náuticos"
        },
        // Galicia & Asturias
        {
            name: "Náutica Perez", lat: 42.2328, lng: -8.7226, location: "Vigo, Pontevedra",
            address: "Avenida da Mariña, 108, Vigo, Pontevedra",
            phone: "+34 986 51 27 19",
            description: "Venta y reparación de embarcaciones y motores náuticos"
        },
        {
            name: "Astilleros Amilibia", lat: 43.3083, lng: -2.0003, location: "Orio, Gipuzkoa",
            phone: "+34 943 83 00 31",
            description: "Astillero — construcción y reparación de embarcaciones"
        },
        {
            name: "Nautica Cangas", lat: 42.2644, lng: -8.7844, location: "Cangas, Pontevedra",
            phone: "+34 986 30 42 85",
            description: "Venta de embarcaciones y motores, servicio técnico"
        },
        {
            name: "Marina Sada", lat: 43.3551, lng: -8.2461, location: "Sada, A Coruña",
            phone: "+34 981 62 07 40",
            description: "Puerto deportivo y servicios náuticos"
        },
        {
            name: "Astilleros de Bermeo", lat: 43.4189, lng: -2.7196, location: "Bermeo, Bizkaia",
            phone: "+34 946 88 09 15",
            description: "Astillero — reparación y mantenimiento naval"
        },
        {
            name: "Marina Yates", lat: 43.5413, lng: -5.6601, location: "Gijón, Asturias",
            phone: "+34 985 34 55 43",
            description: "Compraventa de embarcaciones, gestión náutica y amarres"
        },
        // Cataluña
        {
            name: "Hermanos Guasch", lat: 41.0183, lng: 0.9634, location: "L'Hospitalet de l'Infant, Tarragona",
            address: "Avinguda Gil Vernet, 35 BAJO, L'Hospitalet de l'Infant, Tarragona",
            phone: "+34 977 82 08 30",
            description: "Venta de embarcaciones, motores y accesorios náuticos"
        },
        {
            name: "Motonáutica Llonch", lat: 41.8211, lng: 3.0336, location: "Sant Feliu de Guíxols, Girona",
            phone: "+34 972 45 20 39",
            description: "Venta y servicio técnico de motores y embarcaciones"
        },
        {
            name: "Nautic Center Menorca (Sede BCN)", lat: 41.3851, lng: 2.1734, location: "Barcelona",
            phone: "+34 933 09 14 41",
            description: "Delegación Barcelona — venta de embarcaciones y motores"
        },
        {
            name: "Marina Estrella", lat: 41.7107, lng: 2.8256, location: "Blanes, Girona",
            phone: "+34 972 33 00 56", web: "www.marinaestrella.com",
            description: "Grupo náutico — venta de embarcaciones, chárter y amarres"
        },
        {
            name: "Náutica Casas", lat: 41.8105, lng: 3.0645, location: "Platja d'Aro, Girona",
            phone: "+34 972 81 79 50",
            description: "Venta y alquiler de embarcaciones, servicio técnico"
        },
        {
            name: "Jaume Vermell Nautica", lat: 41.7451, lng: 2.9150, location: "Tossa de Mar, Girona",
            phone: "+34 972 34 18 62",
            description: "Venta de embarcaciones, motores y accesorios"
        },
        // Baleares
        {
            name: "Náutica Reynés", lat: 39.8879, lng: 4.2546, location: "Mahón, Menorca",
            phone: "+34 971 36 90 15",
            description: "Venta de embarcaciones, motores fueraborda y accesorios"
        },
        {
            name: "Nautic Center Menorca", lat: 39.9984, lng: 3.8291, location: "Ciutadella de Menorca",
            phone: "+34 971 48 21 37",
            description: "Venta y reparación de embarcaciones y motores"
        },
        {
            name: "Pedro's Boat", lat: 39.8863, lng: 4.2678, location: "Maó, Menorca",
            phone: "+34 971 36 51 96",
            description: "Alquiler y venta de embarcaciones"
        },
        {
            name: "Campos Marinos", lat: 39.5696, lng: 2.6502, location: "Palma de Mallorca",
            phone: "+34 971 40 36 11",
            description: "Venta de embarcaciones, motores y servicio técnico"
        },
        {
            name: "Náutica Colom", lat: 39.4214, lng: 3.2687, location: "Portocolom, Mallorca",
            phone: "+34 971 82 50 95",
            description: "Venta de embarcaciones y accesorios náuticos"
        },
        {
            name: "Ibiza Náutica", lat: 38.9067, lng: 1.4206, location: "Ibiza",
            phone: "+34 971 31 42 67",
            description: "Venta y alquiler de embarcaciones, servicio técnico"
        },
        // Levante (Comunidad Valenciana & Murcia)
        {
            name: "Náutica Marina Sport", lat: 38.3840, lng: -0.4984, location: "Alicante",
            phone: "+34 965 16 38 42",
            description: "Venta de embarcaciones, motores y accesorios"
        },
        {
            name: "Náutica Mengual", lat: 38.6253, lng: 0.0524, location: "Calp, Alicante",
            phone: "+34 965 83 14 79",
            description: "Venta y reparación de embarcaciones y motores"
        },
        {
            name: "Motonáutica Ibiza", lat: 38.8351, lng: 0.1118, location: "Dénia, Alicante",
            phone: "+34 966 42 33 10",
            description: "Venta y servicio técnico de embarcaciones y motores"
        },
        {
            name: "Don Marino Boats", lat: 36.4251, lng: -5.1472, location: "Estepona, Málaga",
            phone: "+34 952 80 06 12",
            description: "Compraventa de embarcaciones nuevas y seminuevas"
        },
        {
            name: "San Pedro Náutica", lat: 37.8288, lng: -0.7892, location: "San Pedro del Pinatar, Murcia",
            phone: "+34 968 18 23 15",
            description: "Venta de embarcaciones y accesorios, servicio técnico"
        },
        {
            name: "Náutica Mar Menor", lat: 37.6416, lng: -0.7180, location: "Cabo de Palos, Murcia",
            phone: "+34 968 56 31 04",
            description: "Venta y alquiler de embarcaciones, escuela náutica"
        },
        // Andalucía
        {
            name: "Marinas de Andalucía", lat: 36.5050, lng: -4.8824, location: "Marbella, Málaga",
            phone: "+34 952 77 55 24",
            description: "Amarre, agua, electricidad, WiFi, combustible"
        },
        {
            name: "Náutica Corcho", lat: 37.2614, lng: -6.9447, location: "Huelva",
            phone: "+34 959 25 41 33",
            description: "Venta de embarcaciones y motores, servicio técnico"
        },
        {
            name: "Almería Náutica", lat: 36.8340, lng: -2.4637, location: "Almería",
            phone: "+34 950 27 14 68",
            description: "Venta de embarcaciones, motores y accesorios náuticos"
        },
        {
            name: "Cádiz Marítima", lat: 36.5271, lng: -6.2886, location: "Cádiz",
            phone: "+34 956 22 47 81",
            description: "Servicios marítimos, venta y reparación de embarcaciones"
        },
        {
            name: "Sherry Náutica", lat: 36.5828, lng: -6.2307, location: "El Puerto de Santa María, Cádiz",
            phone: "+34 956 87 16 53",
            description: "Venta de embarcaciones y motores, accesorios"
        },
        // Canarias
        {
            name: "Náutica El Chicharro", lat: 28.4682, lng: -16.2546, location: "Santa Cruz de Tenerife",
            phone: "+34 922 24 86 15",
            description: "Venta y reparación de embarcaciones y motores"
        },
        {
            name: "Las Palmas Marinas", lat: 28.1235, lng: -15.4363, location: "Las Palmas de Gran Canaria",
            phone: "+34 928 33 49 72",
            description: "Puerto deportivo, amarres y servicios náuticos"
        },
        // Portugal
        {
            name: "Touron Portugal (Sucursal)", lat: 38.6968, lng: -9.4206, location: "Cascais, Portugal",
            address: "R/C Sala B Rotunda das Palmeiras, 2645-091 Alcabideche, Portugal",
            phone: "+351 21 460 7690", email: "geral@touronsa.pt",
            description: "Sucursal Portugal — distribución de motores y embarcaciones"
        },
        {
            name: "Lisnave", lat: 38.6534, lng: -9.0494, location: "Setúbal, Portugal",
            address: "Mitrena, P.O.Box 135, 2901-901 Setúbal, Portugal",
            phone: "+351 265 799 207", email: "comercial@lisnave.pt", web: "www.lisnave.pt",
            description: "Astillero de reparación naval con 6 diques secos y 9 berths"
        },
        {
            name: "Angel Pilot", lat: 37.1352, lng: -8.5377, location: "Portimão, Portugal",
            address: "Complexo dos Estaleiros Navais, Lote E, 8400-278 Parchal, Lagoa, Portugal",
            phone: "+351 282 343 086", web: "www.angelpilot.com",
            description: "Venta de barcos, alquiler, chárter y servicios técnicos"
        }
    ];

    // 1. inicialización del mapa (vista inicial: mediterráneo español)
    const map = L.map('map', {
        zoomControl: false // se mueve al panel inferior derecho
    }).setView([39.5, 2.5], 7);

    // control de zoom abajo a la derecha
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // 2. capa base del mapa (cartodb positron, tema claro)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18,
        className: 'cartodb-base-layer'
    }).addTo(map);

    // 3. capa náutica openseamap (boyas, luces, marcas)
    L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 4. elementos de la interfaz
    const weatherPanel = document.getElementById('weatherPanel');
    const weatherContent = document.getElementById('weatherContent');
    const loader = document.getElementById('loader');
    const latlonDisplay = document.getElementById('latlonDisplay');
    const geoBtn = document.getElementById('geoBtn');

    // panel de distribuidores
    const searchPanel = document.getElementById('searchPanel');
    const openSearchBtn = document.getElementById('openSearchBtn');
    const closeSearchBtn = document.getElementById('closeSearchBtn');

    // modal de información
    const infoBtn = document.getElementById('infoBtn');
    const infoModal = document.getElementById('infoModal');
    const closeInfoBtn = document.getElementById('closeInfoBtn');

    const searchInput = document.getElementById('searchInput');
    const dealerList = document.getElementById('dealerList');


    // búsqueda global
    const globalSearchInput = document.getElementById('globalSearchInput');
    const globalSearchBtn = document.getElementById('globalSearchBtn');
    const globalSearchResults = document.getElementById('globalSearchResults');

    let currentMarker = null;
    let searchMarker = null;
    let dealerMarkers = [];
    let globalSearchTimeout = null;

    // estado del seguimiento gps
    let isTrackingActive = false;
    let trackingWatchId = null;
    let gpsAutoStartedBy = null; // 'anchor' | 'sos' | null

    function isSosLocked() {
        if (!isSosActive) return false;
        alert("⚠️ EMERGENCIA ACTIVA\n\nDesactiva la alarma S.O.S antes de usar otras funciones.");
        return true;
    }

    // muestra una notificación toast
    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3100);
    }

    // actualiza el marcador del barco
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

        // actualiza distancia sos si está activo
        if (isSosActive && sosMarker) {
            const sosLatLng = sosMarker.getLatLng();
            const dist = map.distance(sosLatLng, latlng);
            const distText = document.getElementById('sos-distance-text');
            if (distText) {
                distText.innerHTML = `Distancia a víctima: <strong>${dist.toFixed(1)} metros</strong>`;
            }
        }

        // actualiza alarma de fondeo si está activa
        if (isAnchorActive) onAnchorGpsUpdate(latlng);
    }

    // helpers de búsqueda global
    const globalSearchClearBtn = document.getElementById('globalSearchClearBtn');
    const globalSearchSpinner = document.getElementById('globalSearchSpinner');
    const globalSearchIcon = document.getElementById('globalSearchIcon');

    function setSearchLoading(on) {
        globalSearchSpinner.classList.toggle('hidden', !on);
        globalSearchIcon.classList.toggle('hidden', on);
    }

    function setSearchMarker(lat, lon) {
        const iconHtml = `<div style="background-color: var(--brand-primary); width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(107, 181, 255, 0.8);"></div>`;
        const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [20, 20], iconAnchor: [10, 10] });
        if (searchMarker) map.removeLayer(searchMarker);
        searchMarker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
    }

    function clearSearch() {
        globalSearchInput.value = '';
        globalSearchResults.classList.add('hidden');
        globalSearchClearBtn.classList.add('hidden');
        if (searchMarker) { map.removeLayer(searchMarker); searchMarker = null; }
    }

    // sugerencias de búsqueda via nominatim
    async function fetchSuggestions(query) {
        if (!query || query.length < 3) {
            globalSearchResults.classList.add('hidden');
            return;
        }

        setSearchLoading(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1&accept-language=es`;
            const response = await fetch(url, { headers: { 'Accept-Language': 'es' } });
            const data = await response.json();
            renderSuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            globalSearchResults.classList.add('hidden');
        } finally {
            setSearchLoading(false);
        }
    }

    function renderSuggestions(results) {
        globalSearchResults.innerHTML = '';

        if (!results || results.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'search-no-results';
            empty.textContent = 'Sin resultados. Prueba con otro nombre.';
            globalSearchResults.appendChild(empty);
            globalSearchResults.classList.remove('hidden');
            return;
        }

        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            const parts = result.display_name.split(',');
            const mainName = parts[0].trim();
            const secondaryText = parts.slice(1, 3).join(',').trim();

            item.innerHTML = `<strong>${mainName}</strong><span>${secondaryText}</span>`;

            item.addEventListener('click', () => {
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                map.flyTo([lat, lon], 13, { duration: 1.5 });
                globalSearchInput.value = result.display_name;
                globalSearchResults.classList.add('hidden');
                globalSearchClearBtn.classList.remove('hidden');
                setSearchMarker(lat, lon);
            });

            globalSearchResults.appendChild(item);
        });

        globalSearchResults.classList.remove('hidden');
    }

    // búsqueda manual o por enter
    async function performGlobalSearch() {
        const query = globalSearchInput.value.trim();
        if (!query) return;

        globalSearchResults.classList.add('hidden');
        setSearchLoading(true);

        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=es`;
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                map.flyTo([lat, lon], 13, { duration: 1.5 });
                globalSearchClearBtn.classList.remove('hidden');
                setSearchMarker(lat, lon);
            } else {
                showToast('No se encontró el lugar. Prueba con otro nombre.');
            }
        } catch (error) {
            console.error('Error in manual search:', error);
            showToast('Error al buscar. Comprueba tu conexión.');
        } finally {
            setSearchLoading(false);
        }
    }

    globalSearchClearBtn.addEventListener('click', clearSearch);
    globalSearchBtn.addEventListener('click', performGlobalSearch);

    globalSearchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        globalSearchClearBtn.classList.toggle('hidden', !query);
        if (globalSearchTimeout) clearTimeout(globalSearchTimeout);
        if (!query) { globalSearchResults.classList.add('hidden'); return; }
        globalSearchTimeout = setTimeout(() => fetchSuggestions(query), 600);
    });

    globalSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (globalSearchTimeout) clearTimeout(globalSearchTimeout);
            performGlobalSearch();
        }
        if (e.key === 'Escape') {
            globalSearchResults.classList.add('hidden');
        }
    });

    // cierra sugerencias al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!globalSearchInput.contains(e.target) && !globalSearchResults.contains(e.target)) {
            globalSearchResults.classList.add('hidden');
        }
    });

    // eventos del panel de distribuidores
    openSearchBtn.addEventListener('click', () => {
        searchPanel.classList.remove('closed');
        searchInput.focus();
        map.invalidateSize({ animate: true });
    });

    closeSearchBtn.addEventListener('click', () => {
        searchPanel.classList.add('closed');
        map.invalidateSize({ animate: true });
    });

    // modal de información del proyecto
    infoBtn.addEventListener('click', () => {
        infoModal.classList.remove('hidden');
    });

    closeInfoBtn.addEventListener('click', () => {
        infoModal.classList.add('hidden');
    });

    // cierra el modal al hacer clic fuera
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.classList.add('hidden');
        }
    });


    // inicializa marcadores y lista de distribuidores
    function initDealers() {
        // icono personalizado para distribuidores
        const dealerIconHtml = `<div style="background-color: transparent; width: 14px; height: 14px; border-radius: 50%; border: 3px solid var(--brand-primary); box-shadow: 0 0 10px rgba(107, 181, 255, 0.8);"></div>`;
        const dealerIcon = L.divIcon({
            html: dealerIconHtml,
            className: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        dealers.forEach((dealer) => {
            // añade el marcador al mapa
            const marker = L.marker([dealer.lat, dealer.lng], { icon: dealerIcon }).addTo(map);
            let popupHtml = `<b>${dealer.name}</b><br>${dealer.location}`;
            if (dealer.address) popupHtml += `<br><small>${dealer.address}</small>`;
            if (dealer.phone) popupHtml += `<br>📞 <a href="tel:${dealer.phone}">${dealer.phone}</a>`;
            if (dealer.email) popupHtml += `<br>✉ <a href="mailto:${dealer.email}">${dealer.email}</a>`;
            if (dealer.web) popupHtml += `<br>🌐 <a href="https://${dealer.web}" target="_blank">${dealer.web}</a>`;
            if (dealer.description) popupHtml += `<br><i>${dealer.description}</i>`;
            marker.bindPopup(popupHtml, { maxWidth: 300 });
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
            let cardHtml = `<div class="dealer-name">${dealer.name}</div>
                <div class="dealer-location">${dealer.location}</div>`;
            if (dealer.phone) cardHtml += `<div class="dealer-phone">📞 ${dealer.phone}</div>`;
            if (dealer.description) cardHtml += `<div class="dealer-desc">${dealer.description}</div>`;
            card.innerHTML = cardHtml;

            card.addEventListener('click', () => {
                map.flyTo([dealer.lat, dealer.lng], 13, { duration: 1.5 });
                // abre el popup del distribuidor
                const match = dealerMarkers.find(m => m.data.name === dealer.name);
                if (match) {
                    setTimeout(() => match.marker.openPopup(), 1500);
                }

                // cierra el panel al seleccionar
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
        if (isTrackingActive || isRulerActive) return; // bloquea clics si el gps o la regla están activos

        const { lat, lng } = e.latlng;

        // actualiza o crea el marcador de posición
        if (currentMarker) {
            currentMarker.setLatLng(e.latlng);
        } else {
            // icono personalizado con divicon
            const iconHtml = `<div style="background-color: var(--brand-primary); width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(107, 181, 255, 0.8);"></div>`;
            const customIcon = L.divIcon({
                html: iconHtml,
                className: '',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            currentMarker = L.marker(e.latlng, { icon: customIcon }).addTo(map);
        }

        // abre el panel meteorológico con el cargador
        weatherPanel.classList.remove('closed');
        latlonDisplay.textContent = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
        // solo muestra el loader si no hay datos previos (primera carga)
        if (!weatherContent.querySelector('.weather-grid')) {
            weatherContent.classList.add('hidden');
            loader.classList.remove('hidden');
        }

        try {
            await fetchMarineWeatherAnalysis(lat, lng);
        } catch (error) {
            console.error("Error fetching marine dat:", error);
            loader.classList.add('hidden');
            weatherContent.classList.remove('hidden');
            // limpia la grid para que el próximo intento muestre el loader desde cero
            weatherContent.innerHTML = `
                <div class="empty-state">
                    <p style="color: #ff6b6b;">No se pudo obtener datos marinos para esta ubicación. Asegúrate de hacer clic en el mar.</p>
                </div>
            `;
        }
    });

    // 6. lógica de geolocalización
    geoBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta la geolocalización.');
            return;
        }

        if (isTrackingActive) {
            if (isSosLocked()) return;
            isTrackingActive = false;
            if (trackingWatchId !== null) {
                navigator.geolocation.clearWatch(trackingWatchId);
                trackingWatchId = null;
            }
            geoBtn.classList.remove('active');
            document.getElementById('gpsLockMsg').classList.add('hidden');
            geoBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Usar mi ubicación actual
            `;
        } else {
            // inicia el seguimiento gps
            const originalHTML = geoBtn.innerHTML;
            geoBtn.innerHTML = 'Buscando...';
            
            isTrackingActive = true;
            geoBtn.classList.add('active');

            trackingWatchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const latlng = L.latLng(latitude, longitude);

                    // centra el mapa en la primera posición
                    if (geoBtn.innerHTML === 'Buscando...') {
                        const zoomLevel = isSosActive ? 17 : 15;
                        if (!isAnchorActive) map.flyTo(latlng, zoomLevel, { duration: 1.5 });
                        geoBtn.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            BLOQUEO GPS ACTIVO
                        `;
                        document.getElementById('gpsLockMsg').classList.remove('hidden');
                    }

                    updateBoatMarker(latlng);

                    // actualiza coordenadas en el panel
                    latlonDisplay.textContent = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`;
                    
                    try {
                        await fetchMarineWeatherAnalysis(latitude, longitude);
                    } catch (error) {
                        console.error("GPS Weather Fetch Error:", error);
                    }
                },
                (error) => {
                    console.error("WatchPosition Error:", error);
                    // error transitorio durante sos, se ignora
                    if (isSosActive) {
                        console.warn("fallo gps durante sos, reintentando...");
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

    // 7. datos meteorológicos marinos (open-meteo)
    async function fetchMarineWeatherAnalysis(lat, lng) {
        window.lastRequestedLat = lat;
        window.lastRequestedLng = lng;

        // solicita oleaje, viento y temperatura de superficie
        const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=swell_wave_height,swell_wave_direction,swell_wave_period,wind_wave_height&hourly=sea_surface_temperature`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();

        // sin current: punto en tierra o inválido
        if (!data.current) throw new Error("No current data found for this location");

        const swellHeight = data.current.swell_wave_height;
        const swellDirection = data.current.swell_wave_direction; // grados
        const swellPeriod = data.current.swell_wave_period;
        const windWaveHeight = data.current.wind_wave_height;

        // temperatura: array horario, tomamos el primer valor
        let wTemp = '-';
        if (data.hourly && data.hourly.sea_surface_temperature && data.hourly.sea_surface_temperature.length > 0) {
            wTemp = data.hourly.sea_surface_temperature[0];
        }

        // renderiza la cuadrícula meteorológica
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

        // si ya hay una grid renderizada, actualiza los valores en-place (sin parpadeo)
        const existingGrid = weatherContent.querySelector('.weather-grid');
        if (existingGrid) {
            const updates = {
                'swell-height':    `${data.swellHeight} <span class="card-unit">metros</span>`,
                'swell-direction': `${data.swellDirection}° ${dirArrow}`,
                'swell-period':    `${data.swellPeriod} <span class="card-unit">segundos</span>`,
                'wind-wave':       `${data.windWaveHeight} <span class="card-unit">metros</span>`,
                'water-temp':      `${data.waterTemp} <span class="card-unit">°C</span>`
            };
            Object.entries(updates).forEach(([key, html]) => {
                const el = existingGrid.querySelector(`[data-key="${key}"]`);
                if (el) {
                    el.classList.remove('card-value-update');
                    void el.offsetWidth; // fuerza reflow para reiniciar la animación
                    el.innerHTML = html;
                    el.classList.add('card-value-update');
                }
            });
            return;
        }

        // primera carga: construye la grid completa
        weatherContent.innerHTML = `
            <div class="weather-grid">
                <div class="weather-card">
                    <span class="card-label">Oleaje (Swell)</span>
                    <div class="card-value" data-key="swell-height">${data.swellHeight} <span class="card-unit">metros</span></div>
                </div>
                <div class="weather-card">
                    <span class="card-label">Dirección</span>
                    <div class="card-value" data-key="swell-direction">${data.swellDirection}° ${dirArrow}</div>
                </div>
                <div class="weather-card">
                    <span class="card-label">Tiempo Ola</span>
                    <div class="card-value" data-key="swell-period">${data.swellPeriod} <span class="card-unit">segundos</span></div>
                </div>
                <div class="weather-card">
                    <span class="card-label">Oleaje (Chop)</span>
                    <div class="card-value" data-key="wind-wave">${data.windWaveHeight} <span class="card-unit">metros</span></div>
                </div>
                <div class="weather-card" style="grid-column: span 2;">
                    <span class="card-label">Temperatura Superficie</span>
                    <div class="card-value" data-key="water-temp">${data.waterTemp} <span class="card-unit">°C</span></div>
                </div>
            </div>
        `;
    }

    // 8. sistema de radio (radio browser api)
    const radioSearchInput = document.getElementById('radioSearchInput');
    const radioResults = document.getElementById('radioResults');
    const radioPlayer = document.getElementById('radioPlayer');
    const activeRadio = document.getElementById('activeRadio');
    const radioNameDisplay = document.getElementById('radioNameDisplay');

    async function searchRadioStations(query) {
        if (!query.trim()) return;

        radioResults.innerHTML = '<p style="padding: 0.5rem; text-align: center; font-size: 0.9rem; color: var(--brand-text-muted);">Buscando emisoras...</p>';

        try {
            // api radio browser, sin clave requerida
            const url = `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(query)}&limit=10&order=clickcount&reverse=true`;

            const response = await fetch(url);
            const data = await response.json();

            radioResults.innerHTML = ''; // limpia el estado de carga

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

        // restaura el color al reproducir con éxito
        radioPlayer.onplaying = () => {
            radioNameDisplay.style.color = "var(--brand-primary)";
        };

        // limpia la búsqueda tras seleccionar emisora
        radioSearchInput.value = '';
        radioResults.innerHTML = '<p class="empty-state" style="padding: 0.5rem; font-size: 0.9rem;">Más de 90,000 estaciones disponibles</p>';
    }

    // debounce de búsqueda de radio
    let radioSearchTimeout = null;

    function handleRadioInput(e) {
        const query = e.target.value;

        // cancela el timeout anterior
        if (radioSearchTimeout) clearTimeout(radioSearchTimeout);

        if (query.trim().length === 0) {
            radioResults.innerHTML = '<p class="empty-state" style="padding: 0.5rem; font-size: 0.9rem;">Busca una estación para escuchar.</p>';
            return;
        }

        // muestra "escribiendo..." mientras el usuario teclea
        if (query.trim().length >= 2) {
            radioResults.innerHTML = '<p style="padding: 0.5rem; text-align: center; font-size: 0.9rem; color: var(--brand-text-muted);">Escribiendo...</p>';
        }

        // espera 600ms tras el último carácter
        radioSearchTimeout = setTimeout(() => {
            if (query.trim().length >= 2) {
                searchRadioStations(query);
            }
        }, 600);
    }

    radioSearchInput.addEventListener('input', handleRadioInput);
    radioSearchInput.addEventListener('keyup', (e) => {
        // fuerza búsqueda al presionar enter
        if (e.key === 'Enter') {
            if (radioSearchTimeout) clearTimeout(radioSearchTimeout);
            searchRadioStations(radioSearchInput.value);
        }
    });

    // controles personalizados de radio
    const customRadioPlayBtn = document.getElementById('customRadioPlayBtn');
    const customRadioMuteBtn = document.getElementById('customRadioMuteBtn');
    // alternar play/pausa
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

    // alternar silencio
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

    // control de volumen
    const radioVolumeSlider = document.getElementById('radioVolumeSlider');
    const radioVolumeValue = document.getElementById('radioVolumeValue');
    if (radioVolumeSlider) {
        radioVolumeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            radioPlayer.volume = val;

            // actualiza el texto de porcentaje
            if (radioVolumeValue) {
                radioVolumeValue.innerText = `${Math.round(val * 100)}%`;
            }

            // desactiva el silencio al subir volumen
            if (radioPlayer.muted && radioPlayer.volume > 0) {
                customRadioMuteBtn.click();
            }
        });
    }

    // sincroniza eventos de audio con la ui y el visualizador
    radioPlayer.addEventListener('play', () => {
        document.getElementById('iconPlay').classList.add('hidden');
        document.getElementById('iconPause').classList.remove('hidden');

    });

    radioPlayer.addEventListener('pause', () => {
        document.getElementById('iconPause').classList.add('hidden');
        document.getElementById('iconPlay').classList.remove('hidden');
    });

    radioPlayer.addEventListener('ended', () => {
        document.getElementById('iconPause').classList.add('hidden');
        document.getElementById('iconPlay').classList.remove('hidden');
    });

    // 9. integración vesselfinder (tráfico marítimo)
    const toggleTrafficBtn = document.getElementById('toggleTrafficBtn');
    const vesselFinderOverlay = document.getElementById('vesselFinderOverlay');
    const vesselCloseBar = document.getElementById('vesselCloseBar');
    const vesselCloseBtn = document.getElementById('vesselCloseBtn');
    const mapControlsBottomLeft = document.querySelector('.map-controls-bottom-left');
    const sosBtnContainer = document.getElementById('floatingSosContainer');
    let isTrafficActive = false;
    let vesselIframe = null;

    function enterTrafficMode() {
        mapControlsBottomLeft.classList.add('hidden');
        sosBtnContainer.classList.add('hidden');
        vesselCloseBar.classList.remove('hidden');
        weatherPanel.classList.add('hidden');
        searchPanel.classList.add('closed');
    }

    function exitTrafficMode() {
        mapControlsBottomLeft.classList.remove('hidden');
        sosBtnContainer.classList.remove('hidden');
        vesselCloseBar.classList.add('hidden');
        weatherPanel.classList.remove('hidden');
    }

    toggleTrafficBtn.addEventListener('click', () => {
        if (isSosLocked()) return;
        isTrafficActive = !isTrafficActive;

        if (isTrafficActive) {
            toggleTrafficBtn.classList.add('active');

            // desactiva otros modos incompatibles
            if (isWindLayerActive) { showToast('Capa de viento desactivada'); windLayerBtn.click(); }
            if (isRadarActive) { showToast('Radar meteorológico desactivado'); owmLayerBtn.click(); }
            if (isRulerActive) { showToast('Regla náutica desactivada'); rulerBtn.click(); }

            // obtiene la vista actual del mapa
            const center = map.getCenter();
            const zoom = map.getZoom();

            if (!vesselIframe) {
                vesselIframe = document.createElement('iframe');
                vesselIframe.setAttribute('name', 'vesselfinder');
                vesselIframe.setAttribute('id', 'vesselfinder');
                vesselIframe.setAttribute('width', '100%');
                vesselIframe.setAttribute('height', '100%');
                vesselIframe.setAttribute('frameborder', '0');
                vesselIframe.src = `https://www.vesselfinder.com/aismap?zoom=${zoom}&lat=${center.lat}&lon=${center.lng}&names=false`;
                vesselFinderOverlay.appendChild(vesselIframe);
            } else {
                vesselIframe.src = `https://www.vesselfinder.com/aismap?zoom=${zoom}&lat=${center.lat}&lon=${center.lng}&names=false`;
            }

            vesselFinderOverlay.classList.remove('hidden');
            enterTrafficMode();

        } else {
            toggleTrafficBtn.classList.remove('active');
            vesselFinderOverlay.classList.add('hidden');
            exitTrafficMode();
        }
    });

    vesselCloseBtn.addEventListener('click', () => {
        toggleTrafficBtn.click();
    });

    // 9.5. radar de lluvia (rainviewer)
    const owmLayerBtn = document.getElementById('owmLayerBtn');
    let radarLayer = null;
    let isRadarActive = false;
    let radarFrames = [];
    let radarAnimIndex = 0;
    let radarAnimInterval = null;
    let radarAnimPlaying = true;
    const RADAR_MAX_ZOOM = 7;

    // obtiene todos los frames disponibles (pasado + nowcast)
    async function getRainViewerFrames() {
        try {
            const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
            const data = await response.json();
            if (!data || !data.radar) return null;
            const host = data.host;
            const frames = [];
            (data.radar.past || []).forEach(f => frames.push({ host, path: f.path, time: f.time, type: 'past' }));
            (data.radar.nowcast || []).forEach(f => frames.push({ host, path: f.path, time: f.time, type: 'nowcast' }));
            return frames.length > 0 ? frames : null;
        } catch (e) {
            console.error('Error fetching RainViewer data:', e);
            return null;
        }
    }

    function radarTimestamp(frame) {
        const d = new Date(frame.time * 1000);
        return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    let radarLayerPrev = null;

    function radarShowFrame(index) {
        // si aún hay una capa "anterior" pendiente de eliminar, la quitamos ya
        if (radarLayerPrev) { map.removeLayer(radarLayerPrev); radarLayerPrev = null; }

        radarLayerPrev = radarLayer; // la actual pasa a ser la anterior

        const frame = radarFrames[index];
        const tileUrl = `${frame.host}${frame.path}/256/{z}/{x}/{y}/6/1_1.png`;
        radarLayer = L.tileLayer(tileUrl, {
            maxZoom: RADAR_MAX_ZOOM, opacity: 0.7, zIndex: 400,
            attribution: '&copy; <a href="https://www.rainviewer.com/api.html">RainViewer</a>',
            errorTileUrl: ''
        });
        radarLayer.addTo(map);

        // elimina la anterior tras 400ms (tiempo suficiente para que carguen los tiles)
        setTimeout(() => {
            if (radarLayerPrev) { map.removeLayer(radarLayerPrev); radarLayerPrev = null; }
        }, 400);

        radarUpdateHud(index);
    }

    function radarUpdateHud(index) {
        const frame = radarFrames[index];
        const isNowcast = frame.type === 'nowcast';
        const isPast = index < radarFrames.findIndex(f => f.type === 'nowcast');
        const isPresent = !isNowcast && index === radarFrames.filter(f => f.type === 'past').length - 1;

        const label = isNowcast ? 'PRONÓSTICO' : isPresent ? 'AHORA' : 'PASADO';
        const labelClass = isNowcast ? 'nowcast' : isPresent ? 'present' : 'past';

        document.getElementById('radarHudTime').textContent = radarTimestamp(frame);
        const labelEl = document.getElementById('radarHudLabel');
        labelEl.textContent = label;
        labelEl.className = `radar-hud-label ${labelClass}`;

        const progress = (index / (radarFrames.length - 1)) * 100;
        document.getElementById('radarHudProgress').style.width = `${progress}%`;

        const nowcastStart = radarFrames.findIndex(f => f.type === 'nowcast');
        if (nowcastStart > 0) {
            document.getElementById('radarHudDivider').style.left = `${(nowcastStart / radarFrames.length) * 100}%`;
        }
    }

    function radarStartAnim() {
        radarAnimInterval = setInterval(() => {
            if (!radarAnimPlaying) return;
            radarAnimIndex = (radarAnimIndex + 1) % radarFrames.length;
            radarShowFrame(radarAnimIndex);
        }, 1000);
    }

    function radarStopAnim() {
        clearInterval(radarAnimInterval);
        radarAnimInterval = null;
        if (radarLayerPrev) { map.removeLayer(radarLayerPrev); radarLayerPrev = null; }
        if (radarLayer) { map.removeLayer(radarLayer); radarLayer = null; }
    }

    if (owmLayerBtn) {
        owmLayerBtn.addEventListener('click', async () => {
            if (isSosLocked()) return;
            if (isRadarActive) {
                radarStopAnim();
                owmLayerBtn.classList.remove('active');
                isRadarActive = false;
                radarFrames = [];
                map.setMaxZoom(18);
                document.getElementById('radarHud').classList.add('hidden');
            } else {
                if (isTrafficActive) { showToast('Tráfico marítimo desactivado'); toggleTrafficBtn.click(); }
                if (isWindLayerActive) { showToast('Capa de viento desactivada'); windLayerBtn.click(); }
                if (isRulerActive) { showToast('Regla náutica desactivada'); rulerBtn.click(); }

                owmLayerBtn.classList.add('active');
                isRadarActive = true;

                const frames = await getRainViewerFrames();
                if (!frames) {
                    showToast('No se pudieron obtener datos del radar.');
                    owmLayerBtn.classList.remove('active');
                    isRadarActive = false;
                    return;
                }

                radarFrames = frames;
                radarAnimIndex = radarFrames.filter(f => f.type === 'past').length - 1;
                radarAnimPlaying = true;

                radarShowFrame(radarAnimIndex);
                radarStartAnim();

                document.getElementById('radarPlayPauseBtn').textContent = '⏸';
                document.getElementById('radarHud').classList.remove('hidden');

                map.setMaxZoom(RADAR_MAX_ZOOM);
                if (map.getZoom() > RADAR_MAX_ZOOM) {
                    map.setZoom(RADAR_MAX_ZOOM, { animate: true });
                    showToast('Radar activo — ajustando zoom automáticamente');
                } else {
                    showToast('Radar de lluvia activo');
                }
            }
        });
    }

    // controles del HUD
    document.getElementById('radarPrevBtn').addEventListener('click', () => {
        radarAnimPlaying = false;
        document.getElementById('radarPlayPauseBtn').textContent = '▶';
        radarAnimIndex = (radarAnimIndex - 1 + radarFrames.length) % radarFrames.length;
        radarShowFrame(radarAnimIndex);
    });

    document.getElementById('radarNextBtn').addEventListener('click', () => {
        radarAnimPlaying = false;
        document.getElementById('radarPlayPauseBtn').textContent = '▶';
        radarAnimIndex = (radarAnimIndex + 1) % radarFrames.length;
        radarShowFrame(radarAnimIndex);
    });

    document.getElementById('radarPlayPauseBtn').addEventListener('click', () => {
        radarAnimPlaying = !radarAnimPlaying;
        document.getElementById('radarPlayPauseBtn').textContent = radarAnimPlaying ? '⏸' : '▶';
    });

    // restaura el zoom máximo al desactivar el radar
    map.on('zoomend', () => {
        if (!isRadarActive) map.setMaxZoom(18);
    });

    // 10. regla náutica

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
        if (isSosLocked()) return;
        isRulerActive = !isRulerActive;
        if (isRulerActive) {
            rulerBtn.classList.add('active');
            document.getElementById('map').style.cursor = 'crosshair';

            // Si el tráfico marítimo u otros modos están activos, los cerramos
            if (isTrafficActive) { showToast('Tráfico marítimo desactivado'); toggleTrafficBtn.click(); }
            if (isWindLayerActive) { showToast('Capa de viento desactivada'); windLayerBtn.click(); }
            if (isRadarActive) { showToast('Radar meteorológico desactivado'); owmLayerBtn.click(); }

        } else {
            rulerBtn.classList.remove('active');
            document.getElementById('map').style.cursor = '';
            clearRuler();
        }
    });

    map.on('click', (e) => {
        if (!isRulerActive) return;

        if (rulerPoints.length === 2) {
            // reinicia si ya hay 2 puntos
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
            // primer clic: inicializa línea de previsualización
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
            // segundo clic: finaliza la medición
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

        // actualiza línea de previsualización
        rulerHoverLine.setLatLngs([rulerPoints[0], e.latlng]);

        // actualiza el popup con distancia y rumbo
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

    // 11. waypoints personalizados
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

    // renderiza los waypoints guardados en localstorage
    customWaypoints.forEach(renderWaypointMarker);

    // menú de clic derecho para crear waypoints
    map.on('contextmenu', (e) => {
        if (isTrafficActive || isRulerActive) return;

        // crea el formulario del waypoint
        const formContainer = document.createElement('div');
        formContainer.className = 'waypoint-form';
        formContainer.innerHTML = `
            <div style="font-weight: 600; font-size: 1rem; color: var(--brand-primary); text-align: center;">Nuevo Favorito</div>
            <input type="text" id="wp-name-input" placeholder="Nombre (ej. Fondeadero Cala)" autocomplete="off">
            <button id="wp-save-btn">Guardar</button>
        `;

        // vincula el evento tras insertar en el dom para evitar problemas de timing
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

        // foco en el input al abrir el popup
        setTimeout(() => {
            if (nameInput) nameInput.focus();
        }, 100);
    });

    // 12. alarma de fondeo
    const floatingAlarmToggle = document.getElementById('floatingAlarmToggle');
    const floatingAlarmPanel = document.getElementById('floatingAlarmPanel');

    let anchorAutoCloseTimeout = null;
    let anchorCountdownInterval = null;

    floatingAlarmToggle.addEventListener('click', () => {
        if (isSosLocked()) return;
        const isClosed = floatingAlarmPanel.classList.toggle('closed');

        if (!isClosed) {
            floatingAlarmToggle.classList.add('active'); // ilumina el botón
        } else {
            // solo desactiva si la alarma no está armada
            if (!isAnchorActive) {
                floatingAlarmToggle.classList.remove('active');
            }
        }

        if (!isClosed && !isAnchorActive) {
            // panel abierto sin alarma: inicia cierre automático con cuenta atrás
            if (anchorAutoCloseTimeout) clearTimeout(anchorAutoCloseTimeout);
            if (anchorCountdownInterval) clearInterval(anchorCountdownInterval);

            const countdownEl = document.getElementById('anchorCountdown');
            let remaining = 15;
            countdownEl.textContent = `${remaining}s`;
            countdownEl.classList.remove('urgent');

            anchorCountdownInterval = setInterval(() => {
                remaining--;
                countdownEl.textContent = `${remaining}s`;
                if (remaining <= 5) countdownEl.classList.add('urgent');
                if (remaining <= 0) {
                    clearInterval(anchorCountdownInterval);
                    anchorCountdownInterval = null;
                    countdownEl.textContent = '';
                    countdownEl.classList.remove('urgent');
                }
            }, 1000);

            anchorAutoCloseTimeout = setTimeout(() => {
                if (!floatingAlarmPanel.classList.contains('closed') && !isAnchorActive) {
                    floatingAlarmPanel.classList.add('closed');
                    floatingAlarmToggle.classList.remove('active');
                }
            }, 15000);
        } else {
            // panel cerrado o alarma activa: cancela el temporizador
            if (anchorAutoCloseTimeout) clearTimeout(anchorAutoCloseTimeout);
            if (anchorCountdownInterval) { clearInterval(anchorCountdownInterval); anchorCountdownInterval = null; }
            const countdownEl = document.getElementById('anchorCountdown');
            if (countdownEl) { countdownEl.textContent = ''; countdownEl.classList.remove('urgent'); }
        }
    });

    const toggleAnchorBtn = document.getElementById('toggleAnchorBtn');
    const anchorRadiusInput = document.getElementById('anchorRadius');
    const anchorStatusPanel = document.getElementById('anchorStatusPanel');
    let isAnchorActive = false;
    let anchorCenter = null;
    let anchorRadius = 50;
    let anchorCircle = null;
    let alarmAudio = new Audio('https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg');
    alarmAudio.loop = true;

    function stopAnchorAlarm() {
        isAnchorActive = false;
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

        if (gpsAutoStartedBy === 'anchor') {
            gpsAutoStartedBy = null;
            geoBtn.click();
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

        // reproduce el sonido si no está activo
        if (alarmAudio.paused) {
            alarmAudio.play().catch(e => console.error("Audio play blocked by browser:", e));
        }

        // notificación del navegador si hay permiso y no se ha enviado ya
        if (Notification.permission === 'granted' && !hasSentNotification) {
            hasSentNotification = true;
            new Notification('¡Atención! Alarma de Fondeo', {
                body: 'Tu embarcación ha salido del radio de seguridad establecido. ¡Comprueba tu posición!',
                icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233816.png' // icono de ancla
            });
        }
    }

    function startAnchorWatch(position) {
        hasSentNotification = false;
        anchorCenter = L.latLng(position.coords.latitude, position.coords.longitude);
        anchorRadius = parseInt(anchorRadiusInput.value, 10) || 50;

        anchorCircle = L.circle(anchorCenter, {
            color: '#2ecc71',
            fillColor: '#2ecc71',
            fillOpacity: 0.15,
            radius: anchorRadius
        }).addTo(map);

        map.setView(anchorCenter, 18);
    }

    // llamada desde watchPosition (updateBoatMarker) en cada actualización GPS
    function onAnchorGpsUpdate(latlng) {
        if (!isAnchorActive || !anchorCenter) return;
        const distance = map.distance(anchorCenter, latlng);

        const display = document.getElementById('anchorDistanceDisplay');
        if (display) {
            display.innerHTML = `Distancia actual: <strong>${distance.toFixed(1)}m</strong> / ${anchorRadius}m`;
        }

        if (distance > anchorRadius) {
            triggerAlarm();
        } else {
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
    }

    toggleAnchorBtn.addEventListener('click', () => {
        // Clear any auto-close timeout and countdown when interacting with the button
        if (anchorCountdownInterval) { clearInterval(anchorCountdownInterval); anchorCountdownInterval = null; }
        const countdownEl = document.getElementById('anchorCountdown');
        if (countdownEl) { countdownEl.textContent = ''; countdownEl.classList.remove('urgent'); }
        if (anchorAutoCloseTimeout) clearTimeout(anchorAutoCloseTimeout);

        if (isAnchorActive) {
            stopAnchorAlarm();
            floatingAlarmPanel.classList.add('closed');
            floatingAlarmToggle.classList.remove('active');
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
                    if (!isTrackingActive) {
                        gpsAutoStartedBy = 'anchor';
                        geoBtn.click();
                    }
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
        if (isSosLocked()) return;
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
            if (isTrafficActive) { showToast('Tráfico marítimo desactivado'); toggleTrafficBtn.click(); }
            if (isRadarActive) { showToast('Radar meteorológico desactivado'); owmLayerBtn.click(); }
            if (isRulerActive) { showToast('Regla náutica desactivada'); rulerBtn.click(); }

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
            isSosActive = false;

        if (gpsAutoStartedBy === 'sos') {
            gpsAutoStartedBy = null;
            geoBtn.click();
        }

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
            gpsAutoStartedBy = 'sos';
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

        // ACTIVATE SOS — desactiva alarma de fondeo si estaba activa
        if (isAnchorActive) {
            stopAnchorAlarm();
            floatingAlarmPanel.classList.add('closed');
            floatingAlarmToggle.classList.remove('active');
        }

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

    // banner de permisos (primera visita)
    const permissionsBanner     = document.getElementById('permissionsBanner');
    const permissionsGrantBtn   = document.getElementById('permissionsGrantBtn');
    const permissionsDismissBtn = document.getElementById('permissionsDismissBtn');

    async function requestPermissions() {
        permissionsBanner.classList.add('hidden');
        localStorage.setItem('permissionsBannerSeen', '1');

        // geolocalización primero: debe ejecutarse dentro del gesto del usuario
        // antes de cualquier await, o el navegador la bloquea silenciosamente
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => {}, () => {});
        }

        // notificaciones después
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }

    permissionsGrantBtn.addEventListener('click', requestPermissions);
    permissionsDismissBtn.addEventListener('click', () => {
        permissionsBanner.classList.add('hidden');
        localStorage.setItem('permissionsBannerSeen', '1');
    });

    // mostrar solo si no se ha visto antes y faltan permisos
    if (!localStorage.getItem('permissionsBannerSeen')) {
        const geoState   = await navigator.permissions.query({ name: 'geolocation' }).catch(() => ({ state: 'prompt' }));
        const notifState = 'Notification' in window ? Notification.permission : 'granted';

        if (geoState.state === 'prompt' || notifState === 'default') {
            setTimeout(() => permissionsBanner.classList.remove('hidden'), 800);
        } else {
            localStorage.setItem('permissionsBannerSeen', '1');
        }
    }

});
