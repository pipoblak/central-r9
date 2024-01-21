import { motion, useAnimationControls } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'renderer/context/AppContext';

const fetchTeamData = async () => {
  return await fetch('https://eoohgkdlippjy3b.m.pipedream.net/').then((r) =>
    r.json()
  );
};

const useTeamData = () => {
  const [data, setData] = useState<any>({});
  const refresh = async () => {
    let teamData: any = JSON.parse(localStorage.getItem('teamData') || '{}');
    const date = new Date();
    if (!teamData || teamData?.expiresAt < date.getTime()) {
      date.setDate(date.getDate() + 1);
      teamData = { data: await fetchTeamData(), expiresAt: date.getTime() };
    }
    localStorage.setItem('teamData', JSON.stringify(teamData));
    setData(teamData);
  };
  useEffect(() => {
    refresh();
  }, []);
  return { data, refresh };
};

const TeamInfo = ({ teamData }: any) => {
  const controls = useAnimationControls();
  const { mode, currentPlayingMode } = useContext(AppContext);
  const date = new Date(teamData?.fixture?.date || '');

  useEffect(() => {
    const runAnimations = async () => {
      await controls.set({ scale: 0, opacity: 0 });
      await controls.start({ scale: 1, opacity: 1 });
    };
    runAnimations().catch((err) => console.log(err));
  }, [mode, currentPlayingMode]);

  return (
    <motion.div
      className="next-game"
      initial={{ scale: 0, opacity: 0 }}
      animate={controls}
    >
      <h3 className="next-game-label">PRÓXIMO JOGO</h3>
      <h1 className="next-game-home">{teamData?.teams?.home?.name}</h1>
      <h2 className="next-game-versus">X</h2>
      <h1 className="next-game-away">{teamData?.teams?.away?.name}</h1>
      <h4 className="next-game-league">{teamData?.league?.name}</h4>
      <h4 className="next-game-date">
        {date.toLocaleDateString('pt-BR', {
          weekday: 'short',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })}
      </h4>
      <h5 className="next-game-location">{teamData?.fixture?.venue?.name}</h5>
    </motion.div>
  );
};

const TeamContentLeft = ({ teamName }: { teamName: string }) => {
  const { data } = useTeamData();
  const team = data?.data ? data?.data[teamName] : {};
  const teamData = team?.data?.length ? team?.data[0] : {};
  return teamData?.teams ? <TeamInfo teamData={teamData} /> : <></>;
};

export default TeamContentLeft;
