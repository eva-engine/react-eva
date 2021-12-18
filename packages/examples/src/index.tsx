import React, {createElement, useState, useCallback, Fragment} from 'react';
import './index.css';
import {Eva} from '@eva/react-eva';
import usePreloadResources from './components/Preload';
import GameBg from './components/GameBg';
import GameScene from './components/GameScene';
import GameHUD from './components/GameHUD';
import Nav from './components/Nav';
import Banner from './components/Banner';
import LoadingScene from './components/LoadingScene';

function App() {
  const preloadResources = usePreloadResources();

  const [loadingComplete, setLoadingComplete] = useState(false);
  const onComplete = useCallback(() => setLoadingComplete(true), []);

  const [goldNumber, setGoldNumber] = useState(255);
  const addGold = useCallback(gold => setGoldNumber(pre => pre + gold), []);

  const show3d = useCallback(() => {
    if (document.getElementById('root').className === 'show3d') {
      document.getElementById('root').className = '';
    } else {
      document.getElementById('root').className = 'show3d';
    }
  }, []);
  return (
    <Fragment>
      <Eva
        preloadResources={preloadResources}
        onPreloadComplete={onComplete}
        width={580}
        height={1000}
        transparent={true}
        HiRes={true}
        className="eva"
        a11yDebug={true}
        a11yActivate={true}
      >
        {!loadingComplete ? (
          <LoadingScene></LoadingScene>
        ) : (
          <Fragment>
            <GameBg />
            <GameScene addGold={addGold} />
            <GameHUD show={show3d}></GameHUD>
          </Fragment>
        )}
      </Eva>
      {loadingComplete ? (
        <Fragment>
          <Nav goldNumber={goldNumber}></Nav>
          <div className="banner-list">
            <Banner></Banner>
            <Banner></Banner>
            <Banner></Banner>
            <Banner></Banner>
            <Banner></Banner>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
}

export default App;
