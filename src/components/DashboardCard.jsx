import { CalendarIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function DashboardCard({title, value, borderColor, textClass, pathColor, textColor, trailColor, backgroundColor, percentage}) {
  return (
    <div className={`rounded-lg bg-white p-6  flex items-center justify-center border-b-4 ${borderColor}`} style={{minWidth: "300px"}}>
        <div className='flex items-center justify-between w-full'>
          <div className=''>
              <h5 className='text-xs text-gray-400'>{title}</h5>
              <h1 className='text-4xl my-3 font-bold'>{value}</h1>
              <small className={`${textClass} flex items-center gap-1 text-xs`}><CalendarIcon className='w-4 h-4'/>Today</small>
          </div>

          <div className='h-[70px] w-[70px]'>
            <CircularProgressbar
              value={percentage} // Use percentage for progress bar
              text={`${percentage.toFixed(2)}%`}
              styles={buildStyles({
                pathColor: pathColor,
                textColor: textColor,
                trailColor: trailColor,
                backgroundColor: backgroundColor,
              })}
            />
          </div>
        </div>
    </div>
  );
}

export default DashboardCard;
