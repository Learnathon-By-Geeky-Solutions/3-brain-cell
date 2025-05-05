import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import PropTypes from "prop-types";
import "maplibre-gl/dist/maplibre-gl.css";
import rescue from '../../assets/rescue.gif';
import { fetchPolygonData } from "../../coordinator/data/MapStat";

const OSMMap = ({ teamData = [], disasterCenter, currentEvent }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Create marker element function
  const createMarkerElement = () => {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundImage = `url(${rescue})`;
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.backgroundSize = 'cover';
    el.style.cursor = 'pointer';
    el.style.backgroundColor = 'transparent';
    return el;
  };

  useEffect(() => {
    if (map.current) return; // Prevent multiple inits

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAP_API_KEY}`, 
      center: disasterCenter || [90.3710408, 23.8202931], // Default center
      zoom: 50,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    
    map.current.on("load", () => {
      console.log("Map loaded");
    });
  }, []);

  // useEffect to handle center changes
  useEffect(() => {
    if (!map.current || !disasterCenter) return;

    map.current.flyTo({
      center: disasterCenter,
      duration: 4000, 
      essential: true
    });
  }, [disasterCenter]);

  useEffect(() => {
    if (!map.current || !currentEvent?.location) return;

    // Clear existing markers (if any)
    const markers = document.getElementsByClassName('maplibregl-marker');
    while(markers[0]) {
      markers[0].remove();
    }

    // Center marker for the location
    new maplibregl.Marker({ color: "red" })
      .setLngLat(disasterCenter || [Number(90.37), Number(23.82)])
      .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div class="text-left">
          <h2 class="font-bold text-lg">${currentEvent?.title}</h2>
          <p class="text-sm">Location: ${currentEvent?.location}</p>
          <p class="text-sm">Status: ${currentEvent?.status}</p>
          <p class="text-sm">Type: ${currentEvent?.type}</p>
          <p class="text-sm">Start Date: ${currentEvent?.startDate}</p>
          </div>
        `))
      .addTo(map.current);

      // drawing affected area with polygon
      const drawDisasterArea = async () => {
        const polygonData = await fetchPolygonData(currentEvent?.location);
    
        // Remove existing polygon layer (if any)
        if (map.current.getLayer('disaster-area')) {
          map.current.removeLayer('disaster-area');
          map.current.removeSource('disaster-area');
        }
    
        if (polygonData) {
          map.current.addSource('disaster-area', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: polygonData,
            },
          });
    
          map.current.addLayer({
            id: 'disaster-area',
            type: 'fill',
            source: 'disaster-area',
            paint: {
              'fill-color': '#FF0000',
              'fill-opacity': 0.3,
              'fill-outline-color': '#FF0000',
            },
          });
    
          // Zoom to fit the polygon bounds
          const bounds = new maplibregl.LngLatBounds();
          if (polygonData.type === "Polygon") {
            polygonData.coordinates[0].forEach(coord => bounds.extend(coord));
          } else if (polygonData.type === "MultiPolygon") {
            polygonData.coordinates[0][0].forEach(coord => bounds.extend(coord));
          }

          map.current.fitBounds(bounds, { padding: 50 });
        }
      };
    
      drawDisasterArea();

    // Team Details markers
    teamData.forEach((team) => {
      new maplibregl.Marker({ element: createMarkerElement() })
        .setLngLat([Number(team.coordinates.lon), Number(team.coordinates.lat)])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div>
          <h2 class="font-bold">${team.name}</h2>
          <p class="font-bold text-blue-600">Team Leader: ${team.teamLeader}</p>
          <p>Job: ${team.responsibility}</p>
          <p>Organization: ${team.organization.organization_name}</p>
          <p>Members:</p>
          <ul class="list-disc pl-5">
            ${team.members.map((member) => `<li>${member.name}</li>`).join("")}
          </ul>
        </div>
          `)
        )
        .addTo(map.current);
    });

  }, [teamData, disasterCenter]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg"
    />
  );
};

OSMMap.propTypes = {
  teamData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      responsibility: PropTypes.string,
      coordinates: PropTypes.shape({
        lat: PropTypes.number,
        lon: PropTypes.number,
      }),
    })
  ),
  disasterCenter: PropTypes.arrayOf(PropTypes.number),
  currentEvent: PropTypes.shape({
    disaster_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    title: PropTypes.string,
    startDate: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default OSMMap;
