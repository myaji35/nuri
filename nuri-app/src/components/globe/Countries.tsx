// @ts-nocheck
'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as topojson from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { supabase } from '@/lib/supabaseClient';
import { useHoverStore } from '@/stores/hoverStore';

const countriesUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const countryCodeMappingUrl = 'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json';
const GLOBE_RADIUS = 2;

const TIER_COLORS: { [key: number]: string } = {
  1: '#FFC700', 2: '#4A90E2', 3: '#E0E0E0',
};
const DEFAULT_COLOR = '#FFFFFF';
const HOVER_COLOR = '#FF6B6B';

function lonLatToVector3(lng: number, lat: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

const Country = React.memo(function Country({ feature, globeRef, countryData }: { feature: any; globeRef: React.RefObject<THREE.Group>; countryData: any }) {
  const lineRef = useRef<any>(null!);
  const { camera } = useThree();
  const setHovered = useHoverStore((state) => state.setHovered);
  const clearHovered = useHoverStore((state) => state.clearHovered);
  const isHovering = useHoverStore((state) => state.isHovering && state.countryData?.code === countryData.code);

  const [points, shapes] = useMemo(() => {
    const p: THREE.Vector3[] = [];
    const s: THREE.Shape[] = [];
    if (feature.geometry.type === 'Polygon') {
      const shape = new THREE.Shape();
      feature.geometry.coordinates[0].forEach(([lng, lat]: [number, number], i: number) => {
        const vec = lonLatToVector3(lng, lat, GLOBE_RADIUS);
        p.push(vec);
        if (i === 0) shape.moveTo(vec.x, vec.y);
        else shape.lineTo(vec.x, vec.y);
      });
      s.push(shape);
    } else if (feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates.forEach((polygon: any) => {
        const shape = new THREE.Shape();
        polygon[0].forEach(([lng, lat]: [number, number], i: number) => {
          const vec = lonLatToVector3(lng, lat, GLOBE_RADIUS);
          p.push(vec);
          if (i === 0) shape.moveTo(vec.x, vec.y);
          else shape.lineTo(vec.x, vec.y);
        });
        s.push(shape);
      });
    }
    return [p, s];
  }, [feature.geometry]);

  useFrame(() => {
    if (lineRef.current && globeRef.current && points.length > 0) {
      const firstPoint = points[0];
      const worldPoint = firstPoint.clone().applyMatrix4(globeRef.current.matrixWorld);
      const normal = worldPoint.clone().normalize();
      const cameraWorldPosition = new THREE.Vector3();
      camera.getWorldPosition(cameraWorldPosition);
      const cameraDirection = cameraWorldPosition.sub(worldPoint).normalize();
      const dot = normal.dot(cameraDirection);
      lineRef.current.visible = dot > -0.1;
    }
  });

  const color = isHovering ? HOVER_COLOR : (countryData?.tier ? TIER_COLORS[countryData.tier] : DEFAULT_COLOR);

  return (
    <group>
      <Line ref={lineRef} points={points} color={color} lineWidth={isHovering ? 1.5 : 0.5} />
      <mesh
        onPointerMove={(e) => {
          e.stopPropagation();
          setHovered({ name: countryData.name, gdp: countryData.gdp, population: countryData.population, code: countryData.code }, { x: e.clientX, y: e.clientY });
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          clearHovered();
        }}
      >
        <shapeGeometry args={[shapes]} />
        <meshBasicMaterial color="orange" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
});

export default function Countries({ globeRef }: { globeRef: React.RefObject<THREE.Group> }) {
  const [allData, setAllData] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [topoRes, countriesRes, mappingRes] = await Promise.all([
          fetch(countriesUrl),
          supabase.from('countries').select('*, market_tiers(tier)'),
          fetch(countryCodeMappingUrl),
        ]);

        if (!topoRes.ok) throw new Error('Failed to fetch TopoJSON');
        const topoData = await topoRes.json();

        if (countriesRes.error) throw countriesRes.error;
        const countriesData = countriesRes.data;

        if (!mappingRes.ok) throw new Error('Failed to fetch code mapping');
        const mappingData = await mappingRes.json();

        const numericToAlpha3Map = new Map(mappingData.map((c: any) => [c['country-code'], c['alpha-3']]));
        const countriesByAlpha3 = new Map(countriesData.map((c: any) => [c.country_code, c]));

        const geoJson = topojson.feature(topoData, topoData.objects.countries as GeometryCollection);
        
        const combinedData = geoJson.features.map(feature => {
          const alpha3Code = numericToAlpha3Map.get(feature.id);
          const countryInfo = alpha3Code ? countriesByAlpha3.get(alpha3Code) : null;
          return {
            feature,
            countryData: {
              code: alpha3Code,
              name: countryInfo?.country_name_ko || 'N/A',
              gdp: countryInfo?.gdp || 0,
              population: countryInfo?.population || 0,
              tier: countryInfo?.market_tiers[0]?.tier,
            },
          };
        });
        setAllData(combinedData);
        console.log('All data loaded and combined successfully.');
      } catch (error) {
        console.error('Failed to fetch or process data:', error);
      }
    }
    fetchData();
  }, []);

  if (!allData) return null;

  return (
    <group>
      {allData.map(({ feature, countryData }, i) => (
        <Country
          key={i}
          feature={feature}
          globeRef={globeRef}
          countryData={countryData}
        />
      ))}
    </group>
  );
}
