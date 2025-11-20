// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { supabase } from '@/lib/supabaseClient';
import SiteMarker from './SiteMarker';

const GLOBE_RADIUS = 2;

// Helper function to convert longitude/latitude to 3D coordinates (re-declared for now)
function lonLatToVector3(lng: number, lat: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

interface Site {
  site_id: string;
  site_name: string;
  latitude: number;
  longitude: number;
}

export default function Sites() {
  const [sites, setSites] = useState<Site[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSites() {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_sites_with_location');

        if (error) {
          console.error('Error fetching site locations:', error);
          setError('Failed to load farm locations');
          return;
        }
        setSites(data);
        console.log('Site locations loaded:', data);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
  }, []);

  if (loading || error || !sites) {
    return null; // Silent fail for 3D scene
  }

  return (
    <group>
      {sites.map((site) => (
        <SiteMarker
          key={site.site_id}
          position={lonLatToVector3(site.longitude, site.latitude, GLOBE_RADIUS + 0.01)}
        />
      ))}
    </group>
  );
}
