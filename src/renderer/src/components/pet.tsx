import duck from '../assets/animals/duck/duck.gif'
import stopedDuck from '../assets/animals/duck/stopped-duck.png'

interface PetProps {
  isWalking: boolean
}

export const Pet = ({ isWalking }: PetProps): React.JSX.Element => {
  return (
    <div className="relative h-screen overflow-hidden">
      <style>
        {`
          @keyframes walkLeftRight {
            0% { left: 0; transform: scaleX(1); }
            49.9% { transform: scaleX(1); }
            50% { left: calc(100% - 64px); transform: scaleX(-1); }
            99.9% { transform: scaleX(-1); }
            100% { left: 0; transform: scaleX(1); }
          }
          
          .pet {
            animation: walkLeftRight 20s linear infinite;
            animation-play-state: ${isWalking ? 'running' : 'paused'};
          }
        `}
      </style>
      <img
        src={isWalking ? duck : stopedDuck}
        alt="pet"
        className="pet w-16 h-16 absolute bottom-0"
      />
    </div>
  )
}
