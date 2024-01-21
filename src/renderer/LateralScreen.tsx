import { useContext } from 'react';
import { AppContext } from 'renderer/context/AppContext';
import GamingContentLeft from './GamingContentLeft';
import TeamContentLeft from './TeamContentDefault';

const contentByMode: { [key: string]: any } = {
  cruzeiro: {
    '1': () => <TeamContentLeft teamName="cruzeiro" />,
    '3': () => <TeamContentLeft teamName="cruzeiro" />,
  },
  valladolid: {
    '1': () => <TeamContentLeft teamName="valladolid" />,
    '3': () => <TeamContentLeft teamName="valladolid" />,
  },
  gaming: {
    '1': () => <GamingContentLeft />,
    '3': () => <GamingContentLeft />,
  },
  default: {
    '1': () => <></>,
    '3': () => <></>,
  },
};

const LateralScreen = () => {
  const { parameters, currentPlayingMode } = useContext(AppContext);
  const currentContent =
    contentByMode[currentPlayingMode as keyof typeof contentByMode] ||
    contentByMode.default;
  const ContentElement = currentContent[parameters?.id];
  return (
    <div className="lateral-screen">
      <ContentElement />
    </div>
  );
};

export default LateralScreen;
