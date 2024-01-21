import clsx from 'clsx';
import React, { useContext, useState } from 'react';
import { AppContext } from 'renderer/context/AppContext';
import CentralMenu from './CentralMenu';
import LateralScreen from './LateralScreen';

const UIComponentsById = {
  '1': LateralScreen,
  '2': CentralMenu,
  '3': LateralScreen,
} as any;


const UI = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeTimeout, setActiveTimeout] = useState<any>(null);
  const { parameters } = useContext(AppContext);

  const onClickUi = () => {
    if (activeTimeout) {
      clearTimeout(activeTimeout);
    }
    setIsActive(true);
    setActiveTimeout(
      setTimeout(() => {
        setIsActive(false);
        setActiveTimeout(null);
      }, 3000)
    );
  };

  const onClickItem = (e: any) => {
    e.stopPropagation();
    if (activeTimeout) {
      clearTimeout(activeTimeout);
    }
    setIsActive(false);
  };

  const RenderedUi = UIComponentsById[parameters.id];
  return (
    <div
      className={clsx('ui', { active: isActive })}
      id={parameters.id}
      onClick={onClickUi}
    >
      <RenderedUi
        isActive={isActive}
        onClickUi={onClickUi}
        onClickItem={onClickItem}
      />
    </div>
  );
};

export default UI;
