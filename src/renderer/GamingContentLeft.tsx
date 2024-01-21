import { motion, useAnimationControls } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'renderer/context/AppContext';

const GamingHolder = require('../assets/gaming_holder.png');

const fetchGamingData = async (url: string): Promise<any> => {
  return await fetch(url).then((r) => r.json());
};

const useGamingData = (url: string): any => {
  const [data, setData] = useState([]);
  const refresh = async () => {
    try {
      const fetchedData = await fetchGamingData(url).catch((err) => []);
      setData(fetchedData);
    } catch (err) {}
  };
  useEffect(() => {
    if (window.currentInterval) {
      clearInterval(window.currentInterval);
    }
    window.currentInterval = setInterval(() => {
      refresh();
    }, 500);
    return () => {
      if (window.currentInterval) {
        clearInterval(window.currentInterval);
      }
    };
  }, []);
  return { data, refresh };
};

const urlById: any = {
  '1': 'http://r9-gaming.local:8085/data.json',
  '3': 'http://r9-stream.local:8085/data.json',
};

const GamingInfo = ({ data }: any) => {
  const { mode, currentPlayingMode } = useContext(AppContext);
  const controls = useAnimationControls();
  const cpu = data?.find((k: any) => k.Text.includes('Intel Core'));
  const cpuLoad = cpu?.Children?.find((k: any) => k.Text.includes('Load'))
    ?.Children?.find((k: any) => k.Text.includes('CPU Total'))
    ?.Value?.split(',')[0];
  const gpu = data?.find((k: any) => k.Text.includes('GeForce'));
  const gpuLoad = gpu?.Children?.find((k: any) => k.Text.includes('Load'))
    ?.Children?.find((k: any) => k.Text.includes('GPU Core'))
    ?.Value?.split(',')[0];
  const memory = data?.find((k: any) => k.Text.includes('Memory'));
  const memoryLoad = gpu?.Children?.find((k: any) => k.Text.includes('Load'))
    ?.Children?.find((k: any) => k.Text.includes('Memory'))
    ?.Value?.split(',')[0];

  useEffect(() => {
    const runAnimations = async () => {
      await controls.set({ scale: 0, opacity: 0 });
      await controls.start({ scale: 1, opacity: 1 });
    };
    runAnimations().catch((err) => console.log(err));
  }, [mode, currentPlayingMode]);

  return (
    <motion.div
      className="gaming-wrapper"
      initial={{ scale: 0, opacity: 0 }}
      animate={controls}
    >
      <div className="gaming-item">
        <img src={GamingHolder} />
        <div className="info">
          <span className="value">{Number(cpuLoad || 0).toFixed(0)}</span>
          <span className="unit">CPU %</span>
        </div>
      </div>
      <div className="gaming-item">
        <img src={GamingHolder} />
        <div className="info">
          <span className="value">{Number(gpuLoad || 0).toFixed(0)}</span>
          <span className="unit">GPU %</span>
        </div>
      </div>
      <div className="gaming-item">
        <img src={GamingHolder} />
        <div className="info">
          <span className="value">{Number(memoryLoad || 0).toFixed(0)}</span>
          <span className="unit">RAM %</span>
        </div>
      </div>
    </motion.div>
  );
};

const GamingContentLeft = () => {
  const { parameters } = useContext(AppContext);
  const { data } = useGamingData(urlById[parameters.id]);
  return data?.Children?.length > 0 ? (
    <GamingInfo data={data?.Children[0]?.Children} />
  ) : (
    <></>
  );
};

export default GamingContentLeft;
