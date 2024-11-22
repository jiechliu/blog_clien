import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import React, { FC, useEffect } from 'react';
import "cesium/Build/Cesium/Widgets/widgets.css";

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNTYzZjY0My00MGFiLTQwYTEtOWY2NS1lYjdiNDBlYjFmNWIiLCJpZCI6MTY3OTM0LCJpYXQiOjE2OTUzNjk3NjB9.PNykT0BSFeMnY_Ym5Z_wpkhKzH0-F16z1BCgDZYV55s';

const App: FC = () => {
  useEffect(() => {
    const viewer = new Viewer('cesiumContainer', {
      terrain: Terrain.fromWorldTerrain(),
    });    
    Ion.defaultAccessToken = token;
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      orientation: {
        heading: CesiumMath.toRadians(0.0),
        pitch: CesiumMath.toRadians(-15.0),
      }
    });
    const fn = async () => {
      const buildingTileset = await createOsmBuildingsAsync();
      viewer.scene.primitives.add(buildingTileset);
    };
    fn();
  }, []);

  return (
    <div id='cesiumContainer'></div>
  );
};

export default App;
