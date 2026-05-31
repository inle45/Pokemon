import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './stores/gameStore';
import { HomeScreen } from './screens/HomeScreen';
import { StarterScreen } from './screens/StarterScreen';
import { MapScreen } from './screens/MapScreen';
import { BattleScreen } from './screens/BattleScreen';
import { RewardScreen } from './screens/RewardScreen';
import { EventScreen } from './screens/EventScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { VictoryScreen } from './screens/VictoryScreen';
import { ShopScreen } from './screens/ShopScreen';

function ScreenTransition({ children, screenKey }: { children: React.ReactNode; screenKey: string }) {
  return (
    <motion.div
      key={screenKey}
      className="min-h-screen"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const { currentScreen } = useGameStore();

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #09090f 0%, #0d0d1a 50%, #080810 100%)',
      }}
    >
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <ScreenTransition screenKey="home">
            <HomeScreen />
          </ScreenTransition>
        )}

        {currentScreen === 'starter' && (
          <ScreenTransition screenKey="starter">
            <StarterScreen />
          </ScreenTransition>
        )}

        {currentScreen === 'map' && (
          <ScreenTransition screenKey="map">
            <MapScreen />
          </ScreenTransition>
        )}

        {currentScreen === 'battle' && (
          <ScreenTransition screenKey="battle">
            <BattleScreen />
          </ScreenTransition>
        )}

        {currentScreen === 'reward' && (
          <ScreenTransition screenKey="reward">
            <RewardScreen />
          </ScreenTransition>
        )}

        {currentScreen === 'shop' && (
          <ScreenTransition screenKey="shop">
            <ShopScreen />
          </ScreenTransition>
        )}

        {currentScreen === 'event' && (
          <ScreenTransition screenKey="event">
            <EventScreen />
          </ScreenTransition>
        )}

        {currentScreen === 'gameover' && (
          <ScreenTransition screenKey="gameover">
            <GameOverScreen />
          </ScreenTransition>
        )}

        {currentScreen === 'victory' && (
          <ScreenTransition screenKey="victory">
            <VictoryScreen />
          </ScreenTransition>
        )}
      </AnimatePresence>
    </div>
  );
}
