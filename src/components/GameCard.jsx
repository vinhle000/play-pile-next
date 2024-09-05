import React, { useContext, useState, memo } from 'react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import UserGameDataEditModal from '@/components/UserGameDataEditModal';
import { TrophyIcon, CheckIcon } from '@heroicons/react/24/solid';
import {
  XCircleIcon,
  PlayIcon,
  ArrowPathIcon,
  PauseIcon,
  CheckCircleIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { FaInfinity, FaCircleStop } from 'react-icons/fa6';
import { FaCheck } from 'react-icons/fa';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import userGameService from '@/services/userGameService';
// import useUserGameData from '@/hooks/useUserGameData' Hook for memo

//FIXME: Need to memoize this component with hook, so that we can rerend just the CARD that is being updated,
// editModal saved changes dont appear until page refresh

function GameCard({
  game,
  innerRef,
  draggableProps,
  dragHandleProps,
  snapshot,
  setSelectedGame,
  setOpenModal,
}) {
  const gameStatusIcon = (gameStatus) => {
    switch (gameStatus) {
      case 'Not owned':
        return <XCircleIcon className="w-5 h-6" />;
      case 'Playing':
        return <PlayIcon className="w-5 h-6" />;
      case 'Replaying':
        return <ArrowPathIcon className="w-5 h-6" />;
      case 'Endless':
        return <FaInfinity className="w-5 h-6" />;
      case 'Paused':
        return <PauseIcon className="w-5 h-6" />;
      case 'Finished':
        return <FaCheck className="w-5 h-6" />;
      case 'Completed':
        return <TrophyIcon className="w-5 h-6" />;
      case 'Abandoned':
        return <FaCircleStop className="w-5 h-6" />;
      default:
        return <div></div>;
    }
  };

  const draggingStyle = snapshot.isDragging ? { zIndex: 1000 } : {};

  return (
    <div
      className={`w-72 relative bg-white/70 rounded-xl backdrop-blur-sm shadow-lg`}
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div
        className=" flex items-top "
        onClick={() => {
          setSelectedGame(game);
          setOpenModal('edit');
        }}
      >
        <div className=" object-cover">
          <img
            className="max-w-28 rounded-tl-xl rounded-bl-xl object-cover"
            src={game.gameInfo.coverUrl}
            alt={game.gameInfo.name}
          />
        </div>

        <div className="flex-auto px-2 ">
          <div className="flex flex-col flex-inline align-top justify-between items-center pr-3">
            {/*  game title*/}
            <div className="h-1/4 justify-start text-black text-sm font-bold pt-1">
              {game.gameInfo.name}
            </div>

            <div className="flex flex-col justify-between min-h-full">
              {/* description or achievements */}
              <div
                className="h-3/4 justify-start text-left  text-wrap
                              text-black text-xs font-light "
              ></div>

              {/*  game status */}
              <div className="absolute -inset-1 top-28 justify-between items-center">
                <div className="flex min-w-full p-2 justify-end">
                  {gameStatusIcon(game.playStatus)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
