import * as React from 'react';
import { Button, ButtonGroup } from '@mui/joy';

interface CalendarToolbarProps {
  onViewChange: (view: string) => void;
  currentView: string;
  onNavigate: (action: 'prev' | 'next' | 'today') => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({ 
  onViewChange, 
  currentView,
  onNavigate 
}) => {
  return (
    <div className="fc-toolbar">
      <div className="fc-left">
        <ButtonGroup variant="soft" spacing={1}>
          <Button onClick={() => onNavigate('today')}>Today</Button>
          <Button onClick={() => onNavigate('prev')}>Prev</Button>
          <Button onClick={() => onNavigate('next')}>Next</Button>
        </ButtonGroup>
      </div>
      <div className="fc-center">
        <h2 className="fc-toolbar-title"></h2>
      </div>
      <div className="fc-right">
        <ButtonGroup variant="soft" spacing={1}>
          <Button 
            onClick={() => onViewChange('dayGridMonth')} 
            variant={currentView === 'dayGridMonth' ? 'solid' : 'soft'}
          >
            Month
          </Button>
          <Button 
            onClick={() => onViewChange('timeGridWeek')} 
            variant={currentView === 'timeGridWeek' ? 'solid' : 'soft'}
          >
            Week
          </Button>
          <Button 
            onClick={() => onViewChange('timeGridDay')} 
            variant={currentView === 'timeGridDay' ? 'solid' : 'soft'}
          >
            Day
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};