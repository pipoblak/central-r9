import { motion, useAnimationControls } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { AppContext } from 'renderer/context/AppContext';

const Particles = require('../assets/particles.png');
const RonaldoIcon = require('../assets/ronaldo_icon.png');
const ClubesIcon = require('../assets/clubes_icon.png');
const GamingIcon = require('../assets/gaming_icon.png');
const BrasilIcon = require('../assets/brasil_icon.png');
const CruzeiroIcon = require('../assets/cruzeiro_icon.png');
const ValladolidIcon = require('../assets/valladolid_icon.png');
const InnerIndicator = require('../assets/inner_indicator.png');
const InnerIndicatorValladolid = require('../assets/inner_indicator_valladolid.png');
const InnerIndicatorCruzeiro = require('../assets/inner_indicator_cruzeiro.png');
const IndicatorFenomeno = require('../assets/indicator_fenomeno.png');
const IndicatorBrasil = require('../assets/indicator_brasil.png');
const IndicatorCruzeiro = require('../assets/indicator_cruzeiro.png');
const IndicatorValladolid = require('../assets/indicator_valladolid.png');
const IndicatorGaming = require('../assets/indicator_gaming.png');

const innerIndicatorByMode = {
  cruzeiro: InnerIndicatorCruzeiro,
  valladolid: InnerIndicatorValladolid,
  gaming: InnerIndicatorCruzeiro,
  default: InnerIndicator,
};

const iconIndicatorByMode = {
  cruzeiro: IndicatorCruzeiro,
  valladolid: IndicatorValladolid,
  brasil: IndicatorBrasil,
  gaming: IndicatorGaming,
  default: IndicatorFenomeno,
};

const MenuItem = ({ children, onClick, icon }: any) => {
  return (
    <motion.button
      className="item"
      variants={{ active: { scale: 1 }, inactive: { scale: 0.1 } }}
      onClick={onClick}
    >
      <div className="item-square">
        <div
          className="particles"
          style={{
            backgroundImage: `url(${Particles})`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
      <img src={icon} className="icon" />
      <span>{children}</span>
    </motion.button>
  );
};

const CentralMenu = ({ isActive, onClickItem }: any) => {
  const { wsConnection, currentPlayingMode } = useContext(AppContext);
  const controlsIndicator = useAnimationControls();
  const onClick = (e: any, mode: string) => {
    wsConnection?.send(
      JSON.stringify({
        mode,
        currentPlayingMode: mode === 'cycle' ? 'fenomeno' : mode,
      })
    );
    onClickItem(e);
  };

  const innerIndicatorImg =
    innerIndicatorByMode[
      currentPlayingMode as keyof typeof innerIndicatorByMode
    ] || innerIndicatorByMode.default;
  const iconIndicatorImg =
    iconIndicatorByMode[
      currentPlayingMode as keyof typeof innerIndicatorByMode
    ] || iconIndicatorByMode.default;

  useEffect(() => {
    const sequence = async () => {
      await controlsIndicator.set({
        rotateY: '0deg',
        transition: { duration: 0.1 },
      });
      await controlsIndicator.start({
        scale: 0.5,
        transition: { duration: 0.4 },
      });
      await controlsIndicator.start({
        scale: 1,
        transition: {
          duration: 0.2,
          type: 'spring',
          stiffness: 260,
          damping: 20,
        },
        rotateY: '360deg',
      });
    };
    sequence();
  }, [currentPlayingMode]);

  return (
    <>
      <div className="central-menu">
        <motion.div
          className="menu"
          initial="inactive"
          animate={isActive ? 'active' : 'inactive'}
          variants={{
            active: {
              x: 0,
              transition: { delayChildren: 0.1 },
            },
            inactive: { x: '-100vw' },
          }}
        >
          <MenuItem
            onClick={(e: any) => onClick(e, 'fenomeno')}
            icon={RonaldoIcon}
          >
            FENÔMENO
          </MenuItem>
          <MenuItem
            onClick={(e: any) => onClick(e, 'brasil')}
            icon={BrasilIcon}
          >
            BRASIL
          </MenuItem>
          <MenuItem
            onClick={(e: any) => onClick(e, 'cruzeiro')}
            icon={CruzeiroIcon}
          >
            Cruzeiro
          </MenuItem>
          <MenuItem
            onClick={(e: any) => onClick(e, 'valladolid')}
            icon={ValladolidIcon}
          >
            Valladolid
          </MenuItem>
          <MenuItem
            onClick={(e: any) => onClick(e, 'gaming')}
            icon={GamingIcon}
          >
            GAMING
          </MenuItem>
          <MenuItem onClick={(e: any) => onClick(e, 'cycle')} icon={ClubesIcon}>
            LOOP
          </MenuItem>
        </motion.div>
      </div>
      <motion.button
        className="indicator"
        initial={{ translateX: '-50%', scale: 0, rotateY: '0deg' }}
        animate={controlsIndicator}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 0.2,
        }}
      >
        <img className="inner-indicator" src={innerIndicatorImg} />
        <img className="icon" src={iconIndicatorImg} />
      </motion.button>
    </>
  );
};

export default CentralMenu;
