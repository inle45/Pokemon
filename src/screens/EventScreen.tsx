import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';

export function EventScreen() {
  const { pendingEvent, setPendingEvent, setScreen } = useGameStore();

  const handleContinue = () => {
    setPendingEvent(null);
    setScreen('map');
  };

  if (!pendingEvent) {
    setScreen('map');
    return null;
  }

  const isGood = pendingEvent.effect === 'good';
  const isBad = pendingEvent.effect === 'bad';

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Icon */}
        <motion.div
          className="text-7xl mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {isGood ? '✨' : isBad ? '⚠️' : '❓'}
        </motion.div>

        {/* Card */}
        <div
          className={`rounded-2xl p-8 border mb-8 ${
            isGood
              ? 'bg-green-900/20 border-green-500/30'
              : isBad
                ? 'bg-red-900/20 border-red-500/30'
                : 'bg-white/5 border-white/10'
          }`}
        >
          <h2 className={`text-xl font-bold mb-4 ${
            isGood ? 'text-green-400' : isBad ? 'text-red-400' : 'text-white'
          }`}>
            {isGood ? 'A Lucky Find!' : isBad ? 'Trouble!' : 'A Strange Event!'}
          </h2>
          <p className="text-white/80 leading-relaxed whitespace-pre-line">
            {pendingEvent.message}
          </p>
        </div>

        <Button size="lg" onClick={handleContinue}>
          Continue →
        </Button>
      </motion.div>
    </motion.div>
  );
}
