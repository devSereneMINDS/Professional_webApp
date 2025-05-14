/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import GoogleIcon from './components/GoogleIcon';
import { AuthError, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentProfessionalUID,
  setProfessionalData,
  setProfessionalEmail,
  setProfessionalToken,
} from "../../store/slices/ProfessionalSlice";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import { changeChat } from "../../store/slices/userChatSlice";
import { useNavigate } from "react-router-dom";
import { setProfessionalId, updateEmail } from "../../store/slices/userSlice";
import { useEffect } from 'react';
import { RootState } from "../../store/store";
import { UserCredential } from "firebase/auth";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === 'light' ? 'dark' : 'light');
        onClick?.(event);
      }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

function Logo() {
  const { mode } = useColorScheme();

  return (
    <Box sx={{ height: { xs: 70, md: 100 } }}>
      <img
        src={mode === 'light' ? '/assets/logo_black.png' : '/assets/logo_white.png'}
        alt="Company Logo"
        style={{
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}

const customTheme = extendTheme({
  colorSchemes: {
    light: {},
    dark: {},
  },
});

export default function JoySignInSideTemplate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const professionalToken = useSelector((state: RootState) => state.professional?.professionalToken);
  const professionalEmail = useSelector((state: RootState) => state.professional?.professionalEmail);

  useEffect(() => {
    const checkAccessToken = async () => {
      if (professionalToken && professionalEmail) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/professionals/email/${professionalEmail}`
          );

          if (response.ok) {
            navigate("/");
            window.location.reload();
          } else if (response.status === 404) {
            dispatch(updateEmail(professionalEmail));
            navigate("/register");
          } else {
            showErrorToast("Error checking professional status. Please try again.");
          }
        } catch (error) {
          console.error("Error checking professional status:", error);
          showErrorToast("Error during verification. Please try again.");
        }
      }
    };

    checkAccessToken();
  }, [dispatch, navigate, professionalToken, professionalEmail]);

  useEffect(() => {
    // Handle redirect result when component mounts
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          await handleAuthSuccess(result);
        }
      } catch (error) {
        console.error("Redirect auth error:", error);
        showErrorToast("Sign-in failed. Please try again.");
      }
    };

    handleRedirectResult();
  }, []);

  const showErrorToast = (message: string) => {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '12px 24px';
    toast.style.backgroundColor = '#ff4444';
    toast.style.color = 'white';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.maxWidth = '90%';
    toast.style.textAlign = 'center';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 5000);
  };


  const handleAuthSuccess = async (result: UserCredential) => {
    const user = result.user;
    dispatch(setCurrentProfessionalUID(user.uid));

    // Save user data to Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        id: user.uid,
        blocked: [],
      },
      { merge: true }
    );

    // Initialize user chats
    const userChatsRef = doc(db, "userchats", user.uid);
    const userChatsSnap = await getDoc(userChatsRef);

    if (userChatsSnap.exists()) {
      const userChats = userChatsSnap.data().chats || [];
      userChats.forEach((chat: { chatId: string; user: unknown }) => {
        dispatch(
          changeChat({
            chatId: chat.chatId,
            user: chat.user,
          })
        );
      });
    } else {
      await setDoc(userChatsRef, { chats: [] });
    }
    
    // Get Google credentials
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential) {
      throw new Error('No credential returned from Google sign in');
    }
    
    const accessToken = credential.accessToken;

    // Store tokens and email
    localStorage.setItem("googleAccessToken", accessToken || '');
    localStorage.setItem("userEmail", user.email || '');

    dispatch(setProfessionalToken(accessToken));
    dispatch(setProfessionalEmail(user.email));

    // Verify professional status with your API
    const response = await fetch(
      `${API_BASE_URL}/professionals/email/${user.email}`
    );

    if (response.ok) {
      const responseData = await response.json(); 
      dispatch(setProfessionalData(responseData)); 
      dispatch(setProfessionalId(responseData.id));
      
      // Update professional with UID
      await fetch(`${API_BASE_URL}/professionals/update/${responseData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: user.uid }),
      });
      
      navigate("/");
    } else if (response.status === 404) {
      dispatch(updateEmail(user.email || ''));
      navigate("/register");
    } else {
      throw new Error("Error checking professional status");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar");
    provider.addScope("https://www.googleapis.com/auth/calendar.events");

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    try {
      // Use redirect flow for mobile devices
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return;
      }

      // Try popup for desktop
      const result = await signInWithPopup(auth, provider).catch(async (error: AuthError) => {
        // Fallback to redirect if popup fails
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
          await signInWithRedirect(auth, provider);
          return null;
        }
        throw error;
      });

      if (!result) return; // Handled by redirect

      await handleAuthSuccess(result);

    } catch (error: unknown) {
      console.error("Authentication error:", error);
      
      let errorMessage = "An error occurred during sign in. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('popup')) {
          errorMessage = "Please allow popups for this site or try the redirect method.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your internet connection.";
        } else if (error.message.includes('cookies')) {
          errorMessage = "Please enable third-party cookies to sign in with Google.";
        }
      }

      showErrorToast(errorMessage);
    }
  };

  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s',
          },
        }}
      />
      {/* Background Image - Always present but behind content on mobile */}
      <Box
        sx={(theme) => ({
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0,
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundImage:
              'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
          },
        })}
      />

      {/* Content Container */}
      <Box
        sx={(theme) => ({
          width: { xs: '100vw', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(8px)',
          backgroundColor: { xs: 'rgba(255 255 255 / 0.6)', md: 'rgba(255 255 255 / 0.2)' },
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: { xs: 'rgba(19 19 24 / 0.7)', md: 'rgba(19 19 24 / 0.4)' },
          },
          minHeight: '100vh',
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: { xs: 2, md: 2 },
          }}
        >
          <Box
            component="header"
            sx={{ 
              py: { xs: 2, md: 3 },
              px: { xs: 0, md: 4 },
              display: 'flex'
            }}
          >
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <Logo />
              <ColorSchemeToggle />
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: { xs: '100%', sm: 400 },
              maxWidth: '100%',
              mx: 'auto',
              px: { xs: 2, sm: 0 },
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: 'hidden',
              },
            }}
          >
            <Stack sx={{ gap: { xs: 3, md: 4 }, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h3">
                  Sign in
                </Typography>
                <Typography level="body-sm">
                  New or returning, just <span style={{ fontWeight: 600, color: "#4393E4" }}>
                  sign in</span> to continue.
                </Typography>
              </Stack>
              <Button
                variant="soft"
                color="neutral"
                fullWidth
                onClick={handleGoogleSignIn}
                startDecorator={<GoogleIcon />}
                sx={{
                  py: { xs: 1.5, md: 2 },
                  '@media (max-width: 768px)': {
                    fontSize: '16px',
                    padding: '12px',
                  }
                }}
              >
                Continue with Google
              </Button>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: 'center' }}>
              © Serene MINDS {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right-side background image (desktop only) */}
      <Box
        sx={(theme) => ({
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: '50vw',
          transition:
            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundImage:
              'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
          },
          display: { xs: 'none', md: 'block' },
          zIndex: 0,
        })}
      />
    </CssVarsProvider>
  );
}