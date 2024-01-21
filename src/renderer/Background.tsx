import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from 'renderer/context/AppContext';

const mediaModes = (basePath: string): any => {
  const assetObj = (asset: string) => ({
    type: 'video',
    src: `file://${basePath}/videos/${asset}`,
  });

  const centerCommon = [assetObj('c_gold_1.mp4'), assetObj('c_gold_2.mp4')];

  return {
    fenomeno: {
      1: [
        assetObj('l_fenomeno_1.mp4'),
        assetObj('l_fenomeno_2.mp4'),
        assetObj('l_fenomeno_3.mp4'),
        assetObj('l_fenomeno_4.mp4'),
        assetObj('l_fenomeno_5.mp4'),
        assetObj('l_fenomeno_6.mp4'),
        assetObj('l_fenomeno_7.mp4'),
      ],
      2: [
        assetObj('c_gold_2.mp4'),
        assetObj('c_gold_2.mp4'),
        assetObj('c_gold_2.mp4'),
        assetObj('c_gold_2.mp4'),
        assetObj('c_gold_2.mp4'),
        assetObj('c_gold_2.mp4'),
        assetObj('c_gold_2.mp4'),
      ],
      3: [
        assetObj('r_fenomeno_1.mp4'),
        assetObj('r_fenomeno_2.mp4'),
        assetObj('r_fenomeno_3.mp4'),
        assetObj('r_fenomeno_4.mp4'),
        assetObj('r_fenomeno_5.mp4'),
        assetObj('r_fenomeno_6.mp4'),
        assetObj('r_fenomeno_7.mp4'),
      ],
    },
    gaming: {
      1: [],
      2: [assetObj('c_valladolid_1.mp4'), assetObj('c_cruzeiro_1.mp4')],
      3: [],
    },
    cruzeiro: {
      1: [assetObj('l_cruzeiro_1.mp4')],
      2: [assetObj('c_cruzeiro_1.mp4')],
      3: [assetObj('r_cruzeiro_1.mp4')],
    },
    valladolid: {
      1: [assetObj('l_valladolid_1.mp4')],
      2: [assetObj('c_valladolid_1.mp4')],
      3: [assetObj('r_valladolid_1.mp4')],
    },
    brasil: {
      1: [assetObj('brasil_l_1.mp4'), assetObj('brasil_r_2.mp4')],
      2: centerCommon,
      3: [assetObj('brasil_r_1.mp4'), assetObj('brasil_l_2.mp4')],
    },
    default: {},
  };
};

const mediaKeys = Object.keys(mediaModes).filter((mode) => mode !== 'default');

const Background = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { wsConnection, parameters, mode, currentPlayingMode } =
    useContext(AppContext);
  const [index, setIndex] = useState(0);
  const modeVideos =
    mediaModes(parameters.resources_path)[currentPlayingMode] ||
    mediaModes(parameters.resources_path).default;
  const media = modeVideos[parameters.id];

  useEffect(() => {
    setIndex(0);
    videoRef?.current?.load();
  }, [mode, currentPlayingMode]);

  const goToNextVideo = useCallback(() => {
    if (media?.length > index + 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
      if (mode === 'cycle') {
        const currentModeIndex = mediaKeys.findIndex(
          (key) => key === currentPlayingMode
        );
        const nextPlayingMode = mediaKeys[currentModeIndex + 1] || mediaKeys[0];
        wsConnection?.send(
          JSON.stringify({ mode: 'cycle', currentPlayingMode: nextPlayingMode })
        );
      }
    }
    videoRef?.current?.load();
  }, [mode, index, modeVideos, currentPlayingMode]);

  return (
    <div className="background">
      {`file://${[parameters.resources_path]}/videos/`}
      <video autoPlay muted onEnded={goToNextVideo} ref={videoRef}>
        <source src={media ? media[index]?.src : ''} type="video/mp4" />
      </video>
    </div>
  );
};

export default Background;
