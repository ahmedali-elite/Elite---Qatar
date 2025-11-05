import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { BADGES } from '../constants';

interface BadgeDisplayProps {
  badgeName: string;
}

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
// FIX: Wrap in React.memo to ensure it's treated as a component, resolving prop type errors for `key`.
const BadgeDisplay = React.memo(({ badgeName }: BadgeDisplayProps) => {
  const badgeInfo = BADGES[badgeName];
  if (!badgeInfo) return null;

  const Icon = badgeInfo.icon;

  return (
    <motion.div
      className="group relative"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="bg-gray-200 p-2 rounded-full cursor-pointer">
        <Icon className="w-6 h-6 text-brand-green" />
      </div>
      <div className="absolute bottom-full mb-2 w-48 p-2 text-sm bg-gray-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-1/2 -translate-x-1/2 z-10">
        <p className="font-bold">{badgeName}</p>
        <p className="text-xs text-gray-300">{badgeInfo.description}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
      </div>
    </motion.div>
  );
});


interface GamificationTrackerProps {
  points: number;
  badges: string[];
}

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
const GamificationTracker = ({ points, badges }: GamificationTrackerProps) => {
  return (
    <div className="flex items-center gap-4 bg-white/70 p-2 rounded-full backdrop-blur-sm shadow-md border border-gray-200/80">
      <div className="flex items-center gap-2 px-3">
        <Star className="w-5 h-5 text-yellow-400" />
        <span className="font-bold text-lg text-gray-800">{points}</span>
      </div>
      <div className="flex items-center gap-2 pr-2">
        {badges.map(badge => (
          <BadgeDisplay key={badge} badgeName={badge} />
        ))}
      </div>
    </div>
  );
};

export default GamificationTracker;