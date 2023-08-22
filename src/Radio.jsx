import React, { useEffect, useState } from 'react';
import { RadioBrowserApi } from 'radio-browser-api';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import defaultImage from './radio.avif';

export default function Radio() {
  const [stations, setStations] = useState();
  const [stationFilter, setStationFilter] = useState('all');

  useEffect(() => {
    setupApi(stationFilter).then((data) => {
      console.log(data);
      setStations(data);
    });
  }, [stationFilter]);

  const setupApi = async (stationFilter) => {
    const api = new RadioBrowserApi(fetch.bind(window), 'My Radio App');

    const stations = await api
      .searchStations({
        language: 'english',
        tag: stationFilter,
        limit: 30,
      })
      .then(async (data) => {
        const stationsWithHttpsUrls = [];

        for (const station of data) {
          // Check if the station URL is secure (HTTPS)
          if (station.urlResolved.startsWith('https:')) {
            stationsWithHttpsUrls.push(station);
          } else {
            // If the URL is not secure, try to find an alternative station with HTTPS
            const alternativeStations = await api.searchStations({
              name: station.name,
              limit: 1,
              order: 'desc',
            });

            const secureAlternative = alternativeStations.find((altStation) =>
              altStation.urlResolved.startsWith('https:')
            );

            if (secureAlternative) {
              stationsWithHttpsUrls.push(secureAlternative);
            }
          }
        }

        return stationsWithHttpsUrls;
      });

    return stations;
  };

  const filters = [
    'all',
    'classical',
    'country',
    'dance',
    'disco',
    'house',
    'jazz',
    'pop',
    'rap',
    'retro',
    'rock',
  ];

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  return (
    <div className='radio'>
      <div className='filters'>
        {filters.map((filter, index) => (
          <span
            key={index}
            className={stationFilter === filter ? 'selected' : ''}
            onClick={() => setStationFilter(filter)}>
            {filter}
          </span>
        ))}
      </div>
      <div className='stations'>
        {stations &&
          stations.map((station, index) => {
            return (
              <div className='station' key={index}>
                <div className='stationName'>
                  <img
                    className='logo'
                    src={station.favicon}
                    alt='station logo'
                    onError={setDefaultSrc}
                  />
                  <div className='name'>{station.name}</div>
                </div>

                <AudioPlayer
                  className='player'
                  src={station.urlResolved}
                  showJumpControls={false}
                  layout='stacked'
                  customProgressBarSection={[]}
                  customControlsSection={['MAIN_CONTROLS', 'VOLUME_CONTROLS']}
                  autoPlayAfterSrcChange={false}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
