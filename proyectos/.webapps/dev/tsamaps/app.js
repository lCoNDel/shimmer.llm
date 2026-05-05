document.addEventListener('DOMContentLoaded', async () => {
    // 0. red de distribuidores touron s.a.
    const dealers = [
        {
            name: "Touron S.A. (Sede Central)", lat: 40.4746, lng: -3.4332, location: "Torrejón de Ardoz, Madrid",
            address: "Calle Mario Vargas Llosa, 20, 28850 Torrejón de Ardoz, Madrid",
            phone: "+34 916 57 27 73", email: "touron@touronsa.es", web: "www.touronsa.es",
            description: "Sede central — distribución de motores fueraborda, embarcaciones y accesorios náuticos",
            headquarters: true
        },
        {
            name: "Touron Portugal (Sucursal)", lat: 38.6968, lng: -9.4206, location: "Cascais, Portugal",
            address: "R/C Sala B Rotunda das Palmeiras, 2645-091 Alcabideche, Portugal",
            phone: "+351 21 460 7690", email: "geral@touronsa.pt",
            description: "Sucursal Portugal — distribución de motores y embarcaciones",
            headquarters: true
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
        zoomControl: false,
        attributionControl: false,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        minZoom: 4
    }).setView([39.5, 2.5], 7);


    // 2. capa base del mapa (cartodb positron, tema claro)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18,
        noWrap: true,
        className: 'cartodb-base-layer'
    }).addTo(map);

    // 3. capa náutica openseamap (boyas, luces, marcas)
    L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
        maxZoom: 18,
        noWrap: true
    }).addTo(map);

    // 4. elementos de la interfaz
    const weatherPanel = document.getElementById('weatherPanel');
    const weatherContent = document.getElementById('weatherContent');
    const loader = document.getElementById('loader');
    const isTabletPortrait = window.innerWidth > 768 && window.innerWidth <= 1024 && window.matchMedia('(orientation: portrait)').matches;
    if (window.innerWidth > 768 && !isTabletPortrait) weatherPanel.classList.remove('closed');

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
    let gpsMarineRefreshId = null; // intervalo de refresco de datos marinos durante GPS
    let lastGpsLat = null;
    let lastGpsLng = null;
    let lastRequestedLat = null;
    let lastRequestedLng = null;
    const GPS_MARINE_REFRESH_MS = 5 * 60 * 1000; // refresca condiciones cada 5 min


    // cierra un panel genérico añadiéndole 'closed'; opcionalmente desactiva su botón
    function closePanel(panelEl, btnEl = null) {
        panelEl.classList.add('closed');
        if (btnEl) {
            btnEl.classList.remove('active');
            btnEl.blur();
        }
    }

    // helper de debounce: retrasa fn ms milisegundos, cancelando llamadas anteriores
    function debounce(fn, ms) {
        let timer = null;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), ms);
        };
    }

    // muestra una notificación toast
    function showToast(message, extraClass = '') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast' + (extraClass ? ' ' + extraClass : '');
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3100);
    }

    function showToastAt(message, topPx, duration = 3100, extraStyle = '') {
        const container = document.getElementById('toast-container');
        const prev = { bottom: container.style.bottom, top: container.style.top };
        container.style.bottom = 'auto';
        container.style.top = `${topPx}px`;
        const toast = document.createElement('div');
        toast.className = 'toast';
        if (extraStyle) toast.style.cssText += extraStyle;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.remove();
            container.style.bottom = prev.bottom;
            container.style.top = prev.top;
        }, duration);
    }


    // Feedback al intentar consultar condiciones con herramienta activa (no se repite hasta 3s después)
    let _toolBlockFeedbackTimer = null;
    function showToolBlockedFeedback() {
        if (_toolBlockFeedbackTimer) return;
        showToast('Desactiva la herramienta activa para consultar condiciones marítimas');
        _toolBlockFeedbackTimer = setTimeout(() => { _toolBlockFeedbackTimer = null; }, 3000);
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
                const distNM = dist / 1852;
                const distStr = distNM < 0.1
                    ? `${dist.toFixed(0)} m`
                    : `${distNM.toFixed(2)} NM`;
                distText.innerHTML = `Distancia a víctima: <strong>${distStr}</strong>`;
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
                closeMobileSearch();
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
                closeMobileSearch();
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

    // botón lupa mobile — muestra/oculta el buscador sobre el mapa
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const globalSearchContainer = document.querySelector('.global-search-container');

    function closeMobileSearch() {
        document.body.classList.remove('mobile-search-active');
        globalSearchResults.classList.add('hidden');
        document.getElementById('radioPanel')?.classList.add('closed');
        if (mobileSearchBtn) mobileSearchBtn.classList.remove('active');
    }

    if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', (e) => {
            if (isSosActive) return;
            e.stopPropagation();
            const isActive = document.body.classList.toggle('mobile-search-active');
            if (isActive) {
                mobileSearchBtn.classList.add('active');
                globalSearchInput.focus();
                if (isTrafficActive)   { toggleTrafficBtn.click(); }
                if (isWindLayerActive) { windLayerBtn.click(); }
                if (isRadarActive)     { owmLayerBtn.click(); }
                if (isRulerActive)     { rulerBtn.click(); }
                document.getElementById('radioPanel')?.classList.add('closed');
            } else {
                mobileSearchBtn.classList.remove('active');
                globalSearchResults.classList.add('hidden');
            }
        });

        // cerrar al tocar fuera del buscador (solo clicks reales del usuario)
        document.addEventListener('click', (e) => {
            if (!e.isTrusted) return;
            if (!document.body.classList.contains('mobile-search-active')) return;
            if (globalSearchContainer && globalSearchContainer.contains(e.target)) return;
            closeMobileSearch();
        });
    }

    // Botón radio flotante
    const radioBtn = document.getElementById('radioBtn');
    const radioPanel = document.getElementById('radioPanel');
    const closeRadioBtn = document.getElementById('closeRadioBtn');

    radioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isSosActive) return;
        const isOpen = !radioPanel.classList.contains('closed');
        if (isOpen) {
            closeRadioPanel();
        } else {
            radioPanel.classList.remove('closed');
            closeChatPanel();
        }
    });

    closeRadioBtn.addEventListener('click', closeRadioPanel);

    addSwipeToClose(radioPanel);

    const debouncedFetchSuggestions = debounce((query) => fetchSuggestions(query), 600);

    globalSearchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        globalSearchClearBtn.classList.toggle('hidden', !query);
        if (!query) { globalSearchResults.classList.add('hidden'); return; }
        debouncedFetchSuggestions(query);
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
    let weatherWasOpen = false;

    openSearchBtn.addEventListener('click', () => {
        if (isSosActive) return;
        weatherWasOpen = !weatherPanel.classList.contains('closed');
        searchPanel.classList.remove('closed');
        if (window.innerWidth > 768) searchInput.focus();
        map.invalidateSize({ animate: true });
        closeChatPanel();
        closeWeatherPanel();
    });

    closeSearchBtn.addEventListener('click', () => {
        closeSearchPanel();
        map.invalidateSize({ animate: true });
        if (weatherWasOpen) weatherPanel.classList.remove('closed');
    });

    function closeWeatherPanel() {
        closePanel(weatherPanel);
        syncGpsShortcutBtn();
    }

    function syncGpsShortcutBtn() {
        const btn = document.getElementById('gpsShortcutBtn');
        if (!btn) return;
        btn.classList.toggle('active', isTrackingActive);
    }

    function closeRadioPanel() {
        closePanel(radioPanel, radioBtn);
    }

    function closeSearchPanel() {
        closePanel(searchPanel);
    }

    function closeSunMoonPanel() {
        closePanel(sunMoonPanel, sunMoonBtn);
    }

    document.getElementById('closeWeatherBtn').addEventListener('click', closeWeatherPanel);

    // modal de información del proyecto
    infoBtn.addEventListener('click', () => {
        if (isSosActive) return;
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


    // elimina todos los markers de distribuidores del mapa y vacía el array
    function clearDealerMarkers() {
        dealerMarkers.forEach(m => map.removeLayer(m.marker));
        dealerMarkers = [];
    }

    // inicializa marcadores y lista de distribuidores
    function initDealers() {
        // icono personalizado para distribuidores (bandera con "T" de Touron)
        const dealerIconHtml = `
            <div style="position: relative; width: 22px; height: 32px;">
                <div style="
                    position: absolute; top: 0; left: 3px;
                    width: 18px; height: 14px;
                    background: linear-gradient(135deg, #1a6fc4, #0d4a8a);
                    border-radius: 2px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.35);
                    display: flex; align-items: center; justify-content: center;
                ">
                    <span style="
                        color: white;
                        font-size: 11px;
                        font-weight: 800;
                        font-family: sans-serif;
                        line-height: 1;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                    ">T</span>
                </div>
                <div style="
                    position: absolute; top: 0; left: 3px;
                    width: 2px; height: 32px;
                    background: #333;
                    border-radius: 1px;
                "></div>
            </div>`;
        const dealerIcon = L.divIcon({
            html: dealerIconHtml,
            className: '',
            iconSize: [22, 32],
            iconAnchor: [4, 32]
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
            card.className = dealer.headquarters ? 'dealer-card headquarters' : 'dealer-card';
            let cardHtml = `<div class="dealer-name">${dealer.name}${dealer.headquarters ? ' <span class="hq-badge">Sede</span>' : ''}</div>
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

                // cierra el panel al seleccionar y restaura condiciones si estaba abierto
                closeSearchPanel();
                if (weatherWasOpen) weatherPanel.classList.remove('closed');
                map.invalidateSize({ animate: true });
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

    // ── Swipe-to-close para drawers móvil ────────────────────────────────────
    function addSwipeToClose(panel) {
        const DISTANCE_THRESHOLD = 80;   // px para cerrar con arrastre lento
        const VELOCITY_THRESHOLD = 0.3;  // px/ms para cerrar con flick rápido
        const SWIPE_ZONE_HEIGHT  = 80;   // px desde la parte superior del panel donde se activa el gesto

        let startY = 0, startTime = 0, currentDeltaY = 0, isDragging = false;

        panel.addEventListener('touchstart', (e) => {
            if (window.innerWidth > 768) return;
            if (panel.classList.contains('closed')) return;
            const touchYRelative = e.touches[0].clientY - panel.getBoundingClientRect().top;
            if (touchYRelative > SWIPE_ZONE_HEIGHT) return; // fuera de la zona superior
            startY = e.touches[0].clientY;
            startTime = Date.now();
            currentDeltaY = 0;
            isDragging = true;
            panel.classList.add('is-dragging');
        }, { passive: true });

        panel.addEventListener('touchmove', (e) => {
            if (!isDragging || window.innerWidth > 768) return;
            currentDeltaY = e.touches[0].clientY - startY;
            if (currentDeltaY < 0) { panel.style.transform = ''; return; }
            panel.style.transform = `translateY(${currentDeltaY}px)`;
        }, { passive: true });

        panel.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            const velocity = currentDeltaY / Math.max(Date.now() - startTime, 1);
            panel.classList.remove('is-dragging');
            panel.style.transform = '';
            if (currentDeltaY >= DISTANCE_THRESHOLD || velocity >= VELOCITY_THRESHOLD) {
                if (panel === weatherPanel) closeWeatherPanel();
                else if (panel === sunMoonPanel) closeSunMoonPanel();
                else if (panel === chatPanel) closeChatPanel();
                else if (panel === radioPanel) closeRadioPanel();
                else panel.classList.add('closed');
            }
            currentDeltaY = 0;
        }, { passive: true });

        panel.addEventListener('touchcancel', () => {
            isDragging = false;
            panel.classList.remove('is-dragging');
            panel.style.transform = '';
            currentDeltaY = 0;
        }, { passive: true });
    }

    addSwipeToClose(weatherPanel);
    addSwipeToClose(searchPanel);

    initDealers();

    // 5. clics en el mapa — despacha según modo activo
    map.on('click', async (e) => {
        // regla náutica
        if (isRulerActive) {
            if (rulerPoints.length === 2) clearRuler();

            rulerPoints.push(e.latlng);
            const marker = L.circleMarker(e.latlng, {
                radius: 5, fillColor: "#ff7800", color: "#000",
                weight: 1, opacity: 1, fillOpacity: 1
            }).addTo(map);
            rulerMarkers.push(marker);

            if (rulerPoints.length === 1) {
                rulerHoverLine = L.polyline([rulerPoints[0], rulerPoints[0]], {
                    color: '#ff7800', dashArray: '5, 5', weight: 2
                }).addTo(map);
                rulerTooltip = L.popup({
                    closeButton: false, autoClose: false, closeOnClick: false, className: 'ruler-popup'
                }).setLatLng(e.latlng).setContent('<div style="font-family: \'Outfit\', sans-serif;">Haz clic en el destino</div>').openOn(map);
            } else if (rulerPoints.length === 2) {
                if (rulerHoverLine) map.removeLayer(rulerHoverLine);
                rulerPolyline = L.polyline(rulerPoints, { color: '#ff7800', weight: 3 }).addTo(map);
                const distanceMeters = map.distance(rulerPoints[0], rulerPoints[1]);
                const distanceNM = (distanceMeters / 1852).toFixed(2);
                const bearing = getBearing(rulerPoints[0].lat, rulerPoints[0].lng, rulerPoints[1].lat, rulerPoints[1].lng);
                rulerTooltip.setLatLng(rulerPoints[1]).setContent(buildRulerContent(distanceNM, bearing, rulerDeclination));
            }
            return;
        }

        // otros modos bloqueantes
        if (isTrackingActive || isRadarActive || isTrafficActive || isWindLayerActive) {
            if (!isTrackingActive) showToolBlockedFeedback();
            return;
        }

        const { lat, lng } = e.latlng;

        // actualiza sol/luna si el panel está abierto
        if (!sunMoonPanel.classList.contains('closed')) {
            try { computeSunMoon(lat, lng); } catch (e) {}
        }

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

        // en móvil, no abrir condiciones si Sol/Luna está abierto
        if (window.innerWidth <= 768 && !sunMoonPanel.classList.contains('closed')) return;
        if (isSosActive) return;

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
    const gpsShortcutBtn = document.getElementById('gpsShortcutBtn');

    if (gpsShortcutBtn) {
        gpsShortcutBtn.addEventListener('click', () => {
            if (!weatherPanel.classList.contains('closed')) {
                closeWeatherPanel();
            } else {
                if (isSosActive) return;
                weatherPanel.classList.remove('closed');
                syncGpsShortcutBtn();
            }
        });
    }

    geoBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta la geolocalización.');
            return;
        }

        if (isTrackingActive) {
            if (isSosActive) return;
            isTrackingActive = false;
            if (trackingWatchId !== null) {
                navigator.geolocation.clearWatch(trackingWatchId);
                trackingWatchId = null;
            }
            if (gpsMarineRefreshId !== null) {
                clearInterval(gpsMarineRefreshId);
                gpsMarineRefreshId = null;
            }
            geoBtn.classList.remove('active');
            syncGpsShortcutBtn();
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
            syncGpsShortcutBtn();
            if (!gpsMarineRefreshId) {
                gpsMarineRefreshId = setInterval(async () => {
                    if (lastGpsLat !== null && lastGpsLng !== null) {
                        try { await fetchMarineWeatherAnalysis(lastGpsLat, lastGpsLng); } catch (_) {}
                    }
                }, GPS_MARINE_REFRESH_MS);
            }

            trackingWatchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    lastGpsLat = latitude;
                    lastGpsLng = longitude;
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
                    syncGpsShortcutBtn();
                    geoBtn.innerHTML = originalHTML;
                    if (trackingWatchId !== null) {
                        navigator.geolocation.clearWatch(trackingWatchId);
                        trackingWatchId = null;
                    }
                    if (gpsMarineRefreshId !== null) {
                        clearInterval(gpsMarineRefreshId);
                        gpsMarineRefreshId = null;
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
        lastRequestedLat = lat;
        lastRequestedLng = lng;

        // solicita oleaje, viento, temperatura de superficie y nivel del mar
        const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=swell_wave_height,swell_wave_direction,swell_wave_period,wind_wave_height&hourly=sea_surface_temperature,sea_level_height_msl`;

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

        // nivel del mar: usamos la hora actual para mayor precisión
        let seaLevel = '-';
        const currentHour = new Date().getHours();
        if (data.hourly && data.hourly.sea_level_height_msl && data.hourly.sea_level_height_msl.length > currentHour) {
            const raw = data.hourly.sea_level_height_msl[currentHour];
            seaLevel = raw !== null ? raw.toFixed(2) : '-';
        }

        // renderiza la cuadrícula meteorológica
        renderWeatherGrid({
            swellHeight: swellHeight !== null ? swellHeight : '-',
            swellDirection: swellDirection !== null ? swellDirection : '-',
            swellPeriod: swellPeriod !== null ? swellPeriod : '-',
            windWaveHeight: windWaveHeight !== null ? windWaveHeight : '-',
            waterTemp: wTemp !== null ? wTemp : '-',
            seaLevel
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
                'water-temp':      `${data.waterTemp} <span class="card-unit">°C</span>`,
                'sea-level':       `${data.seaLevel} <span class="card-unit">m</span>`
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
                <div class="weather-card">
                    <span class="card-label">Temp. Mar</span>
                    <div class="card-value" data-key="water-temp">${data.waterTemp} <span class="card-unit">°C</span></div>
                </div>
                <div class="weather-card">
                    <span class="card-label">Nivel Mar</span>
                    <div class="card-value" data-key="sea-level">${data.seaLevel} <span class="card-unit">m</span></div>
                    <span class="card-disclaimer">Orientativo</span>
                </div>
            </div>
        `;
    }

    // 8. panel sol / luna (suncalc — cálculo local, sin api)
    const sunMoonPanel   = document.getElementById('sunMoonPanel');
    const sunMoonBtn     = document.getElementById('sunMoonBtn');
    const closeSunMoonBtn = document.getElementById('closeSunMoonBtn');

    function formatTime(date) {
        if (!date || isNaN(date.getTime())) return '—';
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    function moonPhaseName(fraction) {
        if (fraction < 0.03 || fraction > 0.97) return 'Luna nueva';
        if (fraction < 0.22) return 'Creciente';
        if (fraction < 0.28) return 'Cuarto creciente';
        if (fraction < 0.47) return 'Gibosa creciente';
        if (fraction < 0.53) return 'Luna llena';
        if (fraction < 0.72) return 'Gibosa menguante';
        if (fraction < 0.78) return 'Cuarto menguante';
        return 'Menguante';
    }

    function computeSunMoon(lat, lng) {
        const now = new Date();
        const times     = SunCalc.getTimes(now, lat, lng);
        const moonTimes = SunCalc.getMoonTimes(now, lat, lng);
        const moonIllum = SunCalc.getMoonIllumination(now);

        document.getElementById('sunMoonCoords').textContent =
            `${Math.abs(lat).toFixed(3)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(3)}° ${lng >= 0 ? 'E' : 'W'}`;

        document.getElementById('smSunrise').textContent   = formatTime(times.sunrise);
        document.getElementById('smSunset').textContent    = formatTime(times.sunset);
        document.getElementById('smSolarNoon').textContent = formatTime(times.solarNoon);
        document.getElementById('smMoonPhase').textContent = moonPhaseName(moonIllum.phase);
        document.getElementById('smMoonrise').textContent  = moonTimes.rise ? formatTime(moonTimes.rise) : 'No sale hoy';
        document.getElementById('smMoonset').textContent   = moonTimes.set  ? formatTime(moonTimes.set)  : 'No se pone';
    }

    sunMoonBtn.addEventListener('click', () => {
        if (isSosActive) return;
        const isOpen = !sunMoonPanel.classList.contains('closed');
        if (isOpen) {
            closeSunMoonPanel();
            return;
        }
        sunMoonPanel.classList.remove('closed');
        sunMoonBtn.classList.add('active');
        closeChatPanel();
        // coordenadas en orden de prioridad
        const lat = lastGpsLat ?? lastRequestedLat ?? map.getCenter().lat;
        const lng = lastGpsLng ?? lastRequestedLng ?? map.getCenter().lng;
        try {
            computeSunMoon(lat, lng);
        } catch (e) {
            console.error('SunCalc error:', e);
        }
    });

    closeSunMoonBtn.addEventListener('click', closeSunMoonPanel);
    addSwipeToClose(sunMoonPanel);

    // 9. sistema de radio (radio browser api)
    const radioSearchInput = document.getElementById('radioSearchInput');
    const radioResults = document.getElementById('radioResults');
    const radioPlayer = document.getElementById('radioPlayer');
    radioPlayer.volume = 0.5;
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
    const debouncedSearchRadio = debounce((query) => {
        if (query.trim().length >= 2) searchRadioStations(query);
    }, 600);

    function handleRadioInput(e) {
        const query = e.target.value;

        if (query.trim().length === 0) {
            radioResults.innerHTML = '<p class="empty-state" style="padding: 0.5rem; font-size: 0.9rem;">Busca una estación para escuchar.</p>';
            return;
        }

        // muestra "escribiendo..." mientras el usuario teclea
        if (query.trim().length >= 2) {
            radioResults.innerHTML = '<p style="padding: 0.5rem; text-align: center; font-size: 0.9rem; color: var(--brand-text-muted);">Escribiendo...</p>';
        }

        debouncedSearchRadio(query);
    }

    radioSearchInput.addEventListener('input', handleRadioInput);
    radioSearchInput.addEventListener('keyup', (e) => {
        // fuerza búsqueda al presionar enter
        if (e.key === 'Enter') searchRadioStations(radioSearchInput.value);
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
    const radioLiveIndicator = document.getElementById('radioLiveIndicator');

    radioPlayer.addEventListener('play', () => {
        document.getElementById('iconPlay').classList.add('hidden');
        document.getElementById('iconPause').classList.remove('hidden');
        radioBtn.classList.add('playing');
        radioLiveIndicator.classList.remove('hidden');
    });

    radioPlayer.addEventListener('pause', () => {
        document.getElementById('iconPause').classList.add('hidden');
        document.getElementById('iconPlay').classList.remove('hidden');
        radioBtn.classList.remove('playing');
        radioLiveIndicator.classList.add('hidden');
    });

    radioPlayer.addEventListener('ended', () => {
        document.getElementById('iconPause').classList.add('hidden');
        document.getElementById('iconPlay').classList.remove('hidden');
        radioLiveIndicator.classList.add('hidden');
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
        document.getElementById('radioBtn').classList.add('hidden');
        document.getElementById('gpsShortcutBtn').classList.add('hidden');
        document.getElementById('chatBtn').classList.add('hidden');
        vesselCloseBar.classList.remove('hidden');
        weatherPanel.classList.add('hidden');
        closeSearchPanel();
    }

    function exitTrafficMode() {
        mapControlsBottomLeft.classList.remove('hidden');
        sosBtnContainer.classList.remove('hidden');
        document.getElementById('radioBtn').classList.remove('hidden');
        document.getElementById('gpsShortcutBtn').classList.remove('hidden');
        document.getElementById('chatBtn').classList.remove('hidden');
        vesselCloseBar.classList.add('hidden');
        weatherPanel.classList.remove('hidden');
    }

    toggleTrafficBtn.addEventListener('click', () => {
        if (isSosActive) return;
        isTrafficActive = !isTrafficActive;

        if (isTrafficActive) {
            toggleTrafficBtn.classList.add('active');

            if (document.body.classList.contains('mobile-search-active')) closeMobileSearch();
            closeRadioPanel();

            // desactiva otros modos incompatibles
            if (isWindLayerActive) { windLayerBtn.click(); }
            if (isRadarActive) { owmLayerBtn.click(); }
            if (isRulerActive) { rulerBtn.click(); }

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
            toggleTrafficBtn.blur();
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
    let radarRefreshInterval = null;
    let radarAnimPlaying = true;
    const RADAR_MAX_ZOOM = 6;
    const RADAR_REFRESH_MS = 5 * 60 * 1000;

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
    let radarLayerPrevTimeout = null;

    function radarShowFrame(index) {
        // si aún hay una capa "anterior" pendiente de eliminar, la quitamos ya
        if (radarLayerPrev) { map.removeLayer(radarLayerPrev); radarLayerPrev = null; }

        radarLayerPrev = radarLayer; // la actual pasa a ser la anterior

        const frame = radarFrames[index];
        const tileUrl = `${frame.host}${frame.path}/256/{z}/{x}/{y}/6/1_1.png`;
        const newLayer = L.tileLayer(tileUrl, {
            maxNativeZoom: RADAR_MAX_ZOOM, maxZoom: 18, opacity: 0, zIndex: 400,
            attribution: '&copy; <a href="https://www.rainviewer.com/api.html">RainViewer</a>',
            errorTileUrl: ''
        });

        newLayer.once('load', () => {
            newLayer.setOpacity(0.7);
            clearTimeout(radarLayerPrevTimeout);
            radarLayerPrevTimeout = setTimeout(() => {
                if (radarLayerPrev) { map.removeLayer(radarLayerPrev); radarLayerPrev = null; }
            }, 200);
        });

        newLayer.addTo(map);
        radarLayer = newLayer;

        radarUpdateHud(index);
    }

    function radarUpdateHud(index) {
        const frame = radarFrames[index];
        const isNowcast = frame.type === 'nowcast';
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

    async function radarRefreshFrames() {
        if (!isRadarActive) return;
        const frames = await getRainViewerFrames();
        if (!frames || !isRadarActive) return;
        radarFrames = frames;
        radarAnimIndex = Math.min(radarAnimIndex, radarFrames.length - 1);
    }

    function radarStartAnim() {
        clearInterval(radarAnimInterval);
        clearInterval(radarRefreshInterval);
        radarAnimInterval = setInterval(() => {
            if (!radarAnimPlaying) return;
            radarAnimIndex = (radarAnimIndex + 1) % radarFrames.length;
            radarShowFrame(radarAnimIndex);
        }, 1500);
        radarRefreshInterval = setInterval(radarRefreshFrames, RADAR_REFRESH_MS);
    }

    function radarStopAnim() {
        clearInterval(radarAnimInterval);
        radarAnimInterval = null;
        clearInterval(radarRefreshInterval);
        radarRefreshInterval = null;
        if (radarLayerPrev) { map.removeLayer(radarLayerPrev); radarLayerPrev = null; }
        if (radarLayer) { map.removeLayer(radarLayer); radarLayer = null; }
    }

    if (owmLayerBtn) {
        owmLayerBtn.addEventListener('click', async () => {
            if (isSosActive) return;
            if (isRadarActive) {
                radarStopAnim();
                owmLayerBtn.classList.remove('active');
                owmLayerBtn.blur();
                isRadarActive = false;
                radarFrames = [];
                document.getElementById('radarHud').classList.add('hidden');
            } else {
                if (document.body.classList.contains('mobile-search-active')) closeMobileSearch();
                closeRadioPanel();
                if (isTrafficActive) { toggleTrafficBtn.click(); }
                if (isWindLayerActive) { windLayerBtn.click(); }
                if (isRulerActive) { rulerBtn.click(); }

                owmLayerBtn.classList.add('active');

                isRadarActive = true;

                const frames = await getRainViewerFrames();
                if (!frames) {
                    showToast('No se pudieron obtener datos del radar.');
                    owmLayerBtn.classList.remove('active');
                    isRadarActive = false;
                    return;
                }

                if (!isRadarActive) return;

                radarFrames = frames;
                radarAnimIndex = radarFrames.filter(f => f.type === 'past').length - 1;
                radarAnimPlaying = true;


                radarShowFrame(radarAnimIndex);
                radarStartAnim();

                document.getElementById('radarPlayPauseBtn').textContent = '⏸';
                document.getElementById('radarHud').classList.remove('hidden');

                if (needsZoomOut) {
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


    // 10. regla náutica

    const rulerBtn = document.getElementById('rulerBtn');
    let isRulerActive = false;
    let rulerPoints = [];
    let rulerPolyline = null;
    let rulerMarkers = [];
    let rulerTooltip = null;
    let rulerHoverLine = null;
    let rulerDeclination = null; // declinación magnética cacheada al activar la regla

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

    async function fetchDeclination(lat, lng) {
        try {
            const today = new Date();
            const url = `https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination?lat1=${lat}&lon1=${lng}&resultFormat=json&startYear=${today.getFullYear()}&startMonth=${today.getMonth()+1}&startDay=${today.getDate()}`;
            const resp = await fetch(url);
            const data = await resp.json();
            return data?.result?.[0]?.declination ?? null;
        } catch {
            return null;
        }
    }

    function buildRulerContent(distanceNM, bearingTrue, declination) {
        const bearingMag = declination !== null
            ? ((bearingTrue - declination + 360) % 360).toFixed(0)
            : null;
        const decLabel = declination !== null
            ? `Dec: ${declination >= 0 ? '+' : ''}${declination.toFixed(1)}°${declination >= 0 ? 'E' : 'W'}`
            : '';
        const rumboLine = bearingMag !== null
            ? `Rumbo: ${parseFloat(bearingTrue).toFixed(0)}°V (${bearingMag}°M)`
            : `Rumbo: ${parseFloat(bearingTrue).toFixed(0)}°`;

        return `
            <div style="text-align: center; font-family: 'Outfit', sans-serif;">
                <div style="font-weight: 600; font-size: 1.1rem; color: #ff7800;">${distanceNM} NM</div>
                <div style="font-size: 0.85rem; color: #555;">${rumboLine}</div>
                ${decLabel ? `<div style="font-size: 0.75rem; color: #999; margin-top:2px;">${decLabel}</div>` : ''}
            </div>
        `;
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
        rulerDeclination = null;
    }

    rulerBtn.addEventListener('click', () => {
        if (isSosActive) return;
        isRulerActive = !isRulerActive;
        if (isRulerActive) {
            rulerBtn.classList.add('active');
            showToast('Regla Náutica activada');
            document.getElementById('map').style.cursor = 'crosshair';
            if (document.body.classList.contains('mobile-search-active')) closeMobileSearch();
            closeRadioPanel();

            if (isTrafficActive) { toggleTrafficBtn.click(); }
            if (isWindLayerActive) { windLayerBtn.click(); }
            if (isRadarActive) { owmLayerBtn.click(); }

            // obtener declinación magnética del centro del mapa al activar
            const center = map.getCenter();
            fetchDeclination(center.lat, center.lng).then(dec => { rulerDeclination = dec; });

        } else {
            rulerBtn.classList.remove('active');
            rulerBtn.blur();
            document.getElementById('map').style.cursor = '';
            clearRuler();
        }
    });

    map.on('mousemove', (e) => {
        if (!isRulerActive || rulerPoints.length !== 1) return;

        rulerHoverLine.setLatLngs([rulerPoints[0], e.latlng]);

        const distanceMeters = map.distance(rulerPoints[0], e.latlng);
        const distanceNM = (distanceMeters / 1852).toFixed(2);
        const bearing = getBearing(rulerPoints[0].lat, rulerPoints[0].lng, e.latlng.lat, e.latlng.lng);

        rulerTooltip.setLatLng(e.latlng).setContent(buildRulerContent(distanceNM, bearing, rulerDeclination));
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
        if (isSosActive) return;
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
        // limpia el temporizador de cierre automático y la cuenta atrás al interactuar con el botón
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

            // establece la UI en estado de carga
            toggleAnchorBtn.textContent = 'OBTENIENDO GPS...';
            toggleAnchorBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    isAnchorActive = true;
                    toggleAnchorBtn.disabled = false;
                    toggleAnchorBtn.textContent = 'DESACTIVAR ALARMA';
                    toggleAnchorBtn.classList.remove('btn-primary');
                    toggleAnchorBtn.classList.add('btn-danger');
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

    // 13. capa de animación de partículas de viento (Leaflet-Velocity)
    const windLayerBtn = document.getElementById('windLayerBtn');
    let velocityLayer = null;
    let isWindLayerActive = false;
    let isWindLayerLoading = false;

    // límites de la rejilla (deben coincidir con server.py)
    const WIND_BOUNDS = L.latLngBounds([[34.0, -12.0], [44.0, 5.0]]);

    function applyWindClip() {
        const canvas = document.querySelector('.velocity-overlay');
        if (!canvas) return;
        const topLeft = map.latLngToContainerPoint(WIND_BOUNDS.getNorthWest());
        const bottomRight = map.latLngToContainerPoint(WIND_BOUNDS.getSouthEast());
        canvas.style.clipPath = `polygon(${topLeft.x}px ${topLeft.y}px, ${bottomRight.x}px ${topLeft.y}px, ${bottomRight.x}px ${bottomRight.y}px, ${topLeft.x}px ${bottomRight.y}px)`;
    }

    const WIND_COLOR_SCALE = [
        { color: "rgba(255,255,255,0.9)", kt: "0–3",   label: "Calma" },
        { color: "rgba(0,255,255,0.9)",   kt: "3–6",   label: "Ventolina" },
        { color: "rgba(0,200,255,0.9)",   kt: "6–10",  label: "Flojito" },
        { color: "rgba(0,150,255,0.9)",   kt: "10–13", label: "Flojo" },
        { color: "rgba(100,255,100,0.9)", kt: "13–16", label: "Bonancible" },
        { color: "rgba(0,255,0,0.9)",     kt: "16–19", label: "Fresquito" },
        { color: "rgba(200,255,0,0.9)",   kt: "19–23", label: "Fresco" },
        { color: "rgba(255,255,0,0.9)",   kt: "23–26", label: "Frescachón" },
        { color: "rgba(255,200,0,0.9)",   kt: "26–29", label: "Frescachón" },
        { color: "rgba(255,150,0,0.9)",   kt: "29–32", label: "Temporal" },
        { color: "rgba(255,100,0,0.9)",   kt: "32–36", label: "Temporal" },
        { color: "rgba(255,50,0,0.9)",    kt: "36–39", label: "T. fuerte" },
        { color: "rgba(255,0,0,0.9)",     kt: "39–42", label: "T. duro" },
        { color: "rgba(200,0,50,0.9)",    kt: "42–45", label: "T. muy duro" },
        { color: "rgba(150,0,100,0.9)",   kt: "45+",   label: "Borrasca" },
    ];

    function showWindLegend(timestamp) {
        if (document.getElementById('wind-legend')) return;
        const legend = document.createElement('div');
        legend.id = 'wind-legend';
        legend.innerHTML = `
            <div style="font-weight:700; font-size:0.75rem; margin-bottom:5px; color:var(--brand-navy);">Viento (kt)</div>
            ${WIND_COLOR_SCALE.map(e => `
                <div style="display:flex;align-items:center;gap:5px;margin-bottom:2px;">
                    <div style="width:14px;height:14px;border-radius:3px;background:${e.color};flex-shrink:0;border:1px solid rgba(0,0,0,0.1);"></div>
                    <span style="font-size:0.7rem;color:#444;">${e.kt} — ${e.label}</span>
                </div>
            `).join('')}
            ${timestamp ? `<div style="margin-top:6px;padding-top:5px;border-top:1px solid rgba(0,0,0,0.1);font-size:0.65rem;color:#888;">Actualizado: ${timestamp}</div>` : ''}
        `;
        document.querySelector('.app-container').appendChild(legend);
    }

    function hideWindLegend() {
        document.getElementById('wind-legend')?.remove();
    }

    windLayerBtn.addEventListener('click', async () => {
        if (isSosActive) return;
        if (isWindLayerActive || isWindLayerLoading) {
            if (velocityLayer) {
                map.removeLayer(velocityLayer);
            }
            map.off('move zoom viewreset', applyWindClip);
            windLayerBtn.classList.remove('active');
            windLayerBtn.blur();
            isWindLayerActive = false;
            isWindLayerLoading = false;
            hideWindLegend();
        } else {
            isWindLayerLoading = true;
            windLayerBtn.classList.add('active');
            if (document.body.classList.contains('mobile-search-active')) closeMobileSearch();
            closeRadioPanel();

            if (isTrafficActive) { toggleTrafficBtn.click(); }
            if (isRadarActive) { owmLayerBtn.click(); }
            if (isRulerActive) { rulerBtn.click(); }

            try {
                const [windRes, tsRes] = await Promise.all([
                    fetch('wind-global.json'),
                    fetch('wind-timestamp').then(r => r.json()).catch(() => ({ updated: null }))
                ]);
                const data = await windRes.json();

                if (!isWindLayerLoading) return;

                velocityLayer = L.velocityLayer({
                    displayValues: true,
                    displayOptions: {
                        velocityType: 'Global Wind',
                        position: 'bottomleft',
                        emptyString: 'Sin datos de viento',
                        angleConvention: 'bearingCW',
                        displayPosition: 'bottomleft',
                        displayEmptyString: 'Sin datos de viento',
                        speedUnit: 'kt'
                    },
                    data: data,
                    maxVelocity: 25,
                    velocityScale: 0.01,
                    particleAge: 90,
                    particleMultiplier: 1 / 200,
                    lineWidth: 3,
                    colorScale: WIND_COLOR_SCALE.map(e => e.color)
                });

                velocityLayer.addTo(map);
                setTimeout(applyWindClip, 100);
                map.on('move zoom viewreset', applyWindClip);

                isWindLayerActive = true;
                isWindLayerLoading = false;
                showWindLegend(tsRes.updated);
                showToast('Capa de viento activada');

            } catch (error) {
                console.error('Error loading wind data:', error);
                showToast('Error al cargar la capa de viento');
                windLayerBtn.classList.remove('active');
                isWindLayerActive = false;
                isWindLayerLoading = false;
            }
        }
    });

    // 14. SOS / Hombre al Agua (MOB) — lógica
    const floatingSosBtn = document.getElementById('floatingSosBtn');
    let sosMarker = null;
    let isSosActive = false;

    // icono personalizado para el marcador SOS
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

    // añade estilo de animación de pulso al documento si no existe
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

        // reinicia la UI del botón
        floatingSosBtn.style.animation = 'none';
        floatingSosBtn.style.background = '#ff4757';
        floatingSosBtn.title = '¡HOMBRE AL AGUA (MOB)!';

        // elimina el panel de seguimiento si existe
        const oldPanel = document.getElementById('sos-tracking-panel');
        if (oldPanel) oldPanel.remove();
    }

    function isInPortugueseWaters(lat, lng) {
        // Bounding box aproximado de aguas territoriales portuguesas (incluye Azores y Madeira)
        // Costa continental: lat 36.9–42.2, lng -9.5–-6.1
        // Madeira: lat 32.4–33.1, lng -17.3–-16.2
        // Azores: lat 36.9–39.8, lng -31.3–-24.8
        if (lat >= 36.9 && lat <= 42.2 && lng >= -9.5 && lng <= -6.1) return true;
        if (lat >= 32.4 && lat <= 33.1 && lng >= -17.3 && lng <= -16.2) return true;
        if (lat >= 36.9 && lat <= 39.8 && lng >= -31.3 && lng <= -24.8) return true;
        return false;
    }

    function activateSos(sosLatLng) {
        isSosActive = true;

        // 1. cerrar y desactivar todo lo que pueda distraer en una emergencia
        // Usar llamadas directas (no .click()) para evitar el guard isSosLocked() que ya está activo
        if (isTrafficActive) {
            isTrafficActive = false;
            toggleTrafficBtn.classList.remove('active');
            vesselFinderOverlay.classList.add('hidden');
            exitTrafficMode();
        }
        if (isWindLayerActive || isWindLayerLoading) {
            if (velocityLayer) { map.removeLayer(velocityLayer); velocityLayer = null; }
            windLayerBtn.classList.remove('active');
            isWindLayerActive = false;
            isWindLayerLoading = false;
        }
        if (isRadarActive)     { owmLayerBtn.click(); }
        if (isRulerActive)     { rulerBtn.click(); }
        if (!radioPlayer.paused) { radioPlayer.pause(); }
        closeWeatherPanel();
        closeRadioPanel();
        closeSearchPanel();
        closeSunMoonPanel();
        closeChatPanel();

        // 2. coloca marcador permanente (punto MOB) y centra mapa
        sosMarker = L.marker(sosLatLng, { icon: sosIcon, zIndexOffset: 1000 }).addTo(map);
        map.setView(sosLatLng, 17);

        // 3. actualiza el marcador del barco INMEDIATAMENTE con las mismas coordenadas
        updateBoatMarker(sosLatLng);

        // 4. actualiza la UI del botón para indicar que está activo
        floatingSosBtn.style.animation = 'pulse-red 1s infinite';
        floatingSosBtn.title = 'S.O.S ACTIVO (Clic para gestionar)';

        // 5. determinar números de emergencia según aguas
        const inPortugal = isInPortugueseWaters(sosLatLng.lat, sosLatLng.lng);
        const salvamentoNum   = inPortugal ? '1520'          : '900 202 202';
        const salvamentoLabel = inPortugal ? 'Portugal' : 'España';

        // 6. crea el panel de seguimiento
        const trackingPanel = document.createElement('div');
        trackingPanel.id = 'sos-tracking-panel';
        trackingPanel.className = 'sos-tracking-panel';
        trackingPanel.style.cssText = `
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 71, 87, 0.95);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: var(--z-modal);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            text-align: center;
            border: 2px solid white;
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;
        trackingPanel.innerHTML = `
            <div style="font-weight: 800; font-size: 1.3rem; display: flex; align-items: center; gap: 8px; justify-content: center;">
                <span style="font-size: 1.5rem;">⚠️</span> MOB ACTIVO
            </div>
            <div id="sos-distance-text" style="font-size: 1.15rem; font-weight: 700;">
                Distancia a víctima: Calculando...
            </div>
            <div style="font-size: 1rem; font-weight: 600; letter-spacing: 0.03em;">
                ${sosLatLng.lat.toFixed(5)}, ${sosLatLng.lng.toFixed(5)}
            </div>
            <div style="margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.4); padding-top: 8px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <a href="tel:${salvamentoNum.replace(/\s/g, '')}" style="background: white; color: #e84118; font-weight: 800; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-size: 1.3rem;">
                        📞 ${salvamentoNum} <span style="font-weight: 400; font-size: 0.9rem;">${salvamentoLabel}</span>
                    </a>
                    <a href="tel:112" style="background: white; color: #e84118; font-weight: 800; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-size: 1.3rem;">
                        📞 112
                    </a>
                </div>
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <a href="https://wa.me/?text=${encodeURIComponent('🚨 HOMBRE AL AGUA (MOB)\nCoordenadas: ' + sosLatLng.lat.toFixed(5) + ', ' + sosLatLng.lng.toFixed(5) + '\nhttps://maps.google.com/?q=' + sosLatLng.lat.toFixed(5) + ',' + sosLatLng.lng.toFixed(5))}" target="_blank" rel="noopener"
                        style="background: #25D366; color: white; font-weight: 700; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-size: 1.1rem; display: flex; align-items: center; gap: 6px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                    </a>
                    <a href="https://t.me/share/url?url=${encodeURIComponent('https://maps.google.com/?q=' + sosLatLng.lat.toFixed(5) + ',' + sosLatLng.lng.toFixed(5))}&text=${encodeURIComponent('🚨 HOMBRE AL AGUA (MOB)\nCoordenadas: ' + sosLatLng.lat.toFixed(5) + ', ' + sosLatLng.lng.toFixed(5))}" target="_blank" rel="noopener"
                        style="background: #229ED9; color: white; font-weight: 700; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-size: 1.1rem; display: flex; align-items: center; gap: 6px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                        Telegram
                    </a>
                </div>
            </div>
        `;
        document.querySelector('.app-container').appendChild(trackingPanel);

        // copiar coordenadas al portapapeles automáticamente al activar MOB
        const coordText = `${sosLatLng.lat.toFixed(5)}, ${sosLatLng.lng.toFixed(5)}`;
        navigator.clipboard?.writeText(coordText).then(() => {
            const panel = document.getElementById('sos-tracking-panel');
            const rect = panel?.getBoundingClientRect();
            const topPx = rect ? rect.bottom + 10 : 240;
            showToastAt('Coordenadas copiadas al portapapeles', topPx, 6200, 'font-size: 1.1rem; padding: 12px 20px;');
        }).catch(() => {});

        // 6. asegura que el seguimiento GPS en tiempo real esté activo
        if (!isTrackingActive) {
            gpsAutoStartedBy = 'sos';
            geoBtn.click();
        }
    }

    // modal de confirmación MOB (confirm() nativo bloqueado en iOS Safari)
    const mobConfirmOverlay = document.getElementById('mobConfirmOverlay');
    const mobConfirmText    = document.getElementById('mobConfirmText');
    const mobConfirmOk      = document.getElementById('mobConfirmOk');
    const mobConfirmCancel  = document.getElementById('mobConfirmCancel');

    function showMobConfirm(message, onConfirm) {
        mobConfirmText.textContent = message;
        mobConfirmOverlay.style.display = 'flex';
        const cleanup = () => { mobConfirmOverlay.style.display = 'none'; mobConfirmOk.onclick = null; mobConfirmCancel.onclick = null; };
        mobConfirmOk.onclick     = () => { cleanup(); onConfirm(); };
        mobConfirmCancel.onclick = () => { cleanup(); };
    }

    floatingSosBtn.addEventListener('click', () => {
        if (isSosActive) {
            showMobConfirm(
                '¿DETENER LA ALARMA MOB?\n\nSe borrará la marca de HOMBRE AL AGUA del mapa.',
                () => showMobConfirm(
                    'CONFIRMACIÓN FINAL',
                    () => { stopSosAlarm(); }
                )
            );
            return;
        }

        // ACTIVATE SOS — desactiva alarma de fondeo si estaba activa
        if (isAnchorActive) {
            stopAnchorAlarm();
            floatingAlarmPanel.classList.add('closed');
            floatingAlarmToggle.classList.remove('active');
        }

        // --- REUTILIZA GPS EXISTENTE (tracking activo) ---
        if (isTrackingActive && currentMarker) {
            activateSos(currentMarker.getLatLng());
            return;
        }

        if (!navigator.geolocation) {
            alert("Error crítico: Tu navegador no soporta geolocalización. Imposible marcar S.O.S.");
            return;
        }

        // --- FEEDBACK INMEDIATO ---
        const originalHTML = floatingSosBtn.innerHTML;
        floatingSosBtn.innerHTML = '<span style="font-size: 0.7rem; font-weight: 800;">GPS...</span>';
        floatingSosBtn.style.background = '#e84118';
        floatingSosBtn.title = 'Obteniendo GPS Crítico...';

        function tryMobGps() {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    floatingSosBtn.innerHTML = originalHTML;
                    activateSos(L.latLng(pos.coords.latitude, pos.coords.longitude));
                },
                (err) => {
                    if (err.code === 3) {
                        tryMobGps(); // timeout — reintenta
                    } else {
                        floatingSosBtn.innerHTML = originalHTML;
                        floatingSosBtn.style.background = '#ff4757';
                        showToast(`Error GPS: ${err.message}`);
                    }
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        }
        tryMobGps();
    });

    // 15. lógica del modal de guía de uso
    const openGuideBtn = document.getElementById('openGuideBtn');
    const closeGuideBtn = document.getElementById('closeGuideBtn');
    const guideModal = document.getElementById('guideModal');

    document.getElementById('brandLogoLink')?.addEventListener('click', (e) => {
        if (isSosActive) e.preventDefault();
    });

    if (openGuideBtn && closeGuideBtn && guideModal) {
        openGuideBtn.addEventListener('click', () => {
            if (isSosActive) return;
            guideModal.classList.remove('hidden');
        });

        closeGuideBtn.addEventListener('click', () => {
            guideModal.classList.add('hidden');
        });

        // cierra al hacer clic fuera del contenido del modal
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
    const guideTip              = document.getElementById('guideTip');
    const guideTipClose         = document.getElementById('guideTipClose');

    function showGuideTip() {
        if (localStorage.getItem('guideTipSeen')) return;
        localStorage.setItem('guideTipSeen', '1');

        const hole  = document.getElementById('guideTipHole');
        const label = document.getElementById('guideTipLabel');
        const rect  = openGuideBtn.getBoundingClientRect();
        const pad   = 18;
        const size  = Math.max(rect.width, rect.height) + pad * 2;

        // centrar el recorte sobre el botón
        hole.style.width  = size + 'px';
        hole.style.height = size + 'px';
        hole.style.top    = (rect.top  + rect.height / 2 - size / 2) + 'px';
        hole.style.left   = (rect.left + rect.width  / 2 - size / 2) + 'px';

        // colocar la etiqueta debajo del recorte, centrada horizontalmente, sin salirse de pantalla
        const labelW    = 260;
        const margin    = 12;
        const labelLeft = Math.min(
            Math.max(rect.left + rect.width / 2 - labelW / 2, margin),
            window.innerWidth - labelW - margin
        );
        label.style.top   = (rect.bottom + pad + 20) + 'px';
        label.style.left  = labelLeft + 'px';
        label.style.width = labelW + 'px';

        guideTip.classList.remove('hidden');

        const dismiss = () => guideTip.classList.add('hidden');
        guideTipClose.addEventListener('click', dismiss, { once: true });
        openGuideBtn.addEventListener('click', dismiss, { once: true });
        guideTip.addEventListener('click', (e) => { if (e.target === guideTip) dismiss(); }, { once: true });
    }

    async function requestPermissions() {
        permissionsBanner.classList.add('hidden');
        localStorage.setItem('permissionsBannerSeen', '1');

        // geolocalización primero: debe ejecutarse dentro del gesto del usuario
        // antes de cualquier await, o el navegador la bloquea silenciosamente
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => {}, () => {});
        }

        showGuideTip();
    }

    permissionsGrantBtn.addEventListener('click', requestPermissions);
    permissionsDismissBtn.addEventListener('click', () => {
        permissionsBanner.classList.add('hidden');
        localStorage.setItem('permissionsBannerSeen', '1');
        showGuideTip();
    });

    // mostrar solo si no se ha visto antes y faltan permisos
    if (!localStorage.getItem('permissionsBannerSeen')) {
        const geoState = await navigator.permissions.query({ name: 'geolocation' }).catch(() => ({ state: 'prompt' }));

        if (geoState.state === 'prompt') {
            setTimeout(() => permissionsBanner.classList.remove('hidden'), 800);
        } else {
            // GPS ya concedido: saltamos el banner pero mostramos el tip igualmente
            localStorage.setItem('permissionsBannerSeen', '1');
            setTimeout(showGuideTip, 800);
        }
    }

    // ── Asistente IA (chat panel) ────────────────────────────
    const PROXY_URL      = ''; // URL relativa — funciona en local y vía ngrok sin cambios
    const CHAT_TIMEOUT   = 10 * 60 * 1000;         // 10 min sin actividad → reset historial

    const chatBtn        = document.getElementById('chatBtn');
    const chatPanel      = document.getElementById('chatPanel');
    const closeChatBtn   = document.getElementById('closeChatBtn');
    const chatMessages   = document.getElementById('chatMessages');
    const chatInput      = document.getElementById('chatInput');
    const chatSendBtn    = document.getElementById('chatSendBtn');

    let chatHistory        = [];
    let chatLastActivity   = Date.now();
    let chatWelcomeShown   = false;

    function openChatPanel() {
        if (window.innerWidth <= 768) {
            closeRadioPanel();
            closeSearchPanel();
            closeWeatherPanel();
            closeSunMoonPanel();
        }
        chatPanel.classList.remove('closed');
        if (!window.matchMedia('(pointer: coarse)').matches) chatInput.focus();
        if (!chatWelcomeShown) {
            chatWelcomeShown = true;
            const welcomeEl = document.createElement('div');
            welcomeEl.className = 'chat-bubble chat-bubble--assistant';
            welcomeEl.innerHTML = 'Asistente Náutico — consultas sobre productos, marcas y servicios.<br><br>Usa <strong>/web &lt;consulta&gt;</strong> para buscar información en tiempo real.';
            chatMessages.appendChild(welcomeEl);
        }
    }
    function closeChatPanel() {
        closePanel(chatPanel);
        chatInput.blur();
    }

    chatBtn.addEventListener('click', () => {
        if (isSosActive) return;
        if (chatPanel.classList.contains('closed')) openChatPanel();
        else closeChatPanel();
    });
    closeChatBtn.addEventListener('click', closeChatPanel);
    addSwipeToClose(chatPanel);

    function appendBubble(role, text) {
        const div = document.createElement('div');
        div.className = `chat-bubble chat-bubble--${role}`;
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return div;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        const now = Date.now();
        if (now - chatLastActivity > CHAT_TIMEOUT) {
            chatHistory = [];
            appendBubble('assistant', '⏳ Sesión reiniciada por inactividad, un nuevo chat comenzará en breves instantes.');
        }
        chatLastActivity = now;

        chatInput.value = '';
        chatSendBtn.disabled = true;
        appendBubble('user', text);
        chatHistory.push({ role: 'user', content: text });

        const typingBubble = appendBubble('assistant', 'Escribiendo...');
        typingBubble.classList.add('chat-bubble--typing');

        try {
            const res = await fetch(`${PROXY_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory })
            });
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = await res.json();
            typingBubble.textContent = data.response;
            typingBubble.classList.remove('chat-bubble--typing');
            chatHistory.push({ role: 'assistant', content: data.response });
        } catch (err) {
            typingBubble.textContent = 'Error al conectar con el asistente. Inténtalo de nuevo.';
            typingBubble.classList.remove('chat-bubble--typing');
            chatHistory.pop();
        } finally {
            chatSendBtn.disabled = false;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

    screen.orientation?.addEventListener('change', () => {
        setTimeout(() => map.invalidateSize(), 300);
    });

});
