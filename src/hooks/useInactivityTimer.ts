import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { resetProfessionalData } from '../store/slices/ProfessionalSlice';

const useInactivityTimer = (logoutAfterMinutes = 15) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      // Clear existing timer
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      // Set new timer
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, logoutAfterMinutes * 60 * 1000);
    };

    const handleLogout = async () => {
      try {
        await signOut(auth);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('googleAccessToken');
        dispatch(resetProfessionalData());
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    // Events that reset the timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [dispatch, logoutAfterMinutes]);
};

export default useInactivityTimer;