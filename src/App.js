import React, {useEffect, useRef} from "react";
import maplibregl from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layer, RenderType, DecodeType, RenderFrom, ImageSource } from '@sakitam-gis/maplibre-wind';



export default function App() {

    const mapContainer = useRef(null)
    const map = useRef(null);

    useEffect(() => {
        if (map.current) return;

        // @ts-ignore
        map.current = new maplibregl.Map({
            // @ts-ignore
            container: mapContainer.current,
            style: {
        version: 8,
        sources: {
          carto: {
            type: 'raster',
            tiles: [
              '//a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              '//b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              '//c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              '//d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            minzoom: 1,
            maxzoom: 18,
          },
        },
        layers: [
          {
            id: 'carto',
            type: 'raster',
            source: 'carto',
            // minzoom: 1,
            // maxzoom: 22,
            paint: {
              'raster-resampling': 'linear',
            },
          },
          {
            id: 'background',
            type: 'background',
            layout: {
              visibility: 'none',
            },
          },
        ],
      },
            center: [118.23, 32.11],
            zoom: 5
        })

        map.current?.on('load', ()=>{
            const source2 = new ImageSource('wind', {
      url: 'https://shuxitech.obs.cn-north-1.myhuaweicloud.com/ydq/t5_3857.jpeg',
      coordinates: [
        [-180, 85.051129],
        [180, 85.051129],
        [180, -85.051129],
        [-180, -85.051129],
      ],
      decodeType: DecodeType.image,
      dataRange: [[-26.5, 26.399999618530273], [-21.200000762939453, 23.399999618530273]],
      wrapX: true,
    });

            const windColor = [
              [0, [98, 113, 183, 255]],
              [1, [57, 97, 159, 255]],
              [3, [74, 148, 169, 255]],
              [5, [77, 141, 123, 255]],
              [7, [83, 165, 83, 255]],
              [9, [53, 159, 53, 255]],
              [11, [167, 157, 81, 255]],
              [13, [159, 127, 58, 255]],
              [15, [161, 108, 92, 255]],
              [17, [129, 58, 78, 255]],
              [19, [175, 80, 136, 255]],
              [21, [117, 74, 147, 255]],
              [24, [109, 97, 163, 255]],
              [27, [68, 105, 141, 255]],
              [29, [92, 144, 152, 255]],
              [36, [125, 68, 165, 255]],
              [46, [231, 215, 215, 256]],
              [51, [219, 212, 135, 256]],
              [77, [205, 202, 112, 256]],
              [104, [128, 128, 128, 255]],
            ];

            const interpolateColor = windColor.reduce(
              (result, item, key) => result.concat(item[0], `rgba(${item[1].join(',')})`),
              [],
            );

            const layer = new Layer('wind', source2, {
              styleSpec: {
                'fill-color': ['interpolate', ['linear'], ['get', 'value'], ...interpolateColor],
                opacity: 1,
              },
              renderFrom: RenderFrom.rg,
              widthSegments: 1,
              heightSegments: 1,
              displayRange: [0, 104],
              renderType: RenderType.colorize,
            });

            // @ts-ignore
            map.current?.addLayer(layer)
        })

        return () => {
        }

    }, []);

    return <div ref={mapContainer} className={"map"}/>
}
