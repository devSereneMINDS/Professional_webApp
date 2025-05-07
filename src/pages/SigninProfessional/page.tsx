import * as React from 'react';
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import GoogleIcon from './components/GoogleIcon';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
import { useEffect, useState } from 'react';


interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  console.log("Api url", API_BASE_URL);

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
    <Box sx={{ height: 100 }}>
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

const customTheme = extendTheme({ defaultColorScheme: 'dark' });


export default function JoySignInSideTemplate() {

  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const professionalToken = useSelector((state) => state.professional?.professionalToken);
  const professionalEmail = useSelector((state) => state.professional?.professionalEmail);
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkAccessToken = async () => {

      if (professionalToken && professionalEmail) {
        try {

          const response = await fetch(
            `${API_BASE_URL}/professionals/email/${professionalEmail}`
          );

          if (response.ok) {
            navigate("/"); // Navigate to the homepage
            window.location.reload();
          } else if (response.status === 404) {
            dispatch(updateEmail(professionalEmail));
            console.log("Redux store updated with email:", professionalEmail);
            navigate("/register");
          } else {
            alert("Error checking professional status. Please try again.");
          }
        } catch (error) {
          console.error("Error checking professional status:", error);
          alert("Error during verification. Please try again.");
        }
      }
      setIsLoading(false); // End global loading
    };

    checkAccessToken();
  }, [dispatch, navigate,professionalToken, professionalEmail]);



  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar");
    provider.addScope("https://www.googleapis.com/auth/calendar.events");
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      // console.log("User signed in:", user.uid);
      dispatch(setCurrentProfessionalUID(user.uid));
  
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
  
      const userChatsRef = doc(db, "userchats", user.uid);
      const userChatsSnap = await getDoc(userChatsRef);
  
      if (userChatsSnap.exists()) {
        const userChats = userChatsSnap.data().chats || [];
  
        userChats.forEach((chat) => {
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
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
  
      localStorage.setItem("googleAccessToken", accessToken);
      localStorage.setItem("userEmail", user.email);
  
      dispatch(setProfessionalToken(accessToken))
      dispatch(setProfessionalEmail(user.email))
  
      console.log("Access Token:", accessToken);
      // console.log("User Email:", user.email);
  
      const response = await fetch(
        `${API_BASE_URL}/professionals/email/${user.email}`
      );
  
      if (response.ok) {
        const responseData = await response.json(); 
        setId(responseData.id); 
        dispatch(setProfessionalData(responseData)); 
        dispatch(setProfessionalId(responseData.id));
        await fetch(`${API_BASE_URL}/professionals/update/${responseData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: user.uid }),
        });
        navigate("/");
      } else if (response.status === 404) {
        dispatch(updateEmail(user.email));
        console.log("Redux store updated with email:", user.email);
        navigate("/register");
      } else {
        alert("Error checking professional status. Please try again.");
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
    }
  };


  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s', // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 0.4)',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{ py: 3, px:4, display: 'flex'}}
          >
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
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
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h3">
                  Log in
                </Typography>
                <Typography level="body-sm">
                New or returning, just <span style={{ fontWeight: 600, color: "#4393E4" }}>
                log in</span> to continue.{' '}
                </Typography>
              </Stack>
              <Button
                variant="soft"
                color="neutral"
                fullWidth
                onClick={handleGoogleSignIn}
                startDecorator={<GoogleIcon />}
              >
                Continue with Google
              </Button>
            </Stack>
            {/* <Divider
              sx={(theme) => ({
                [theme.getColorSchemeSelector('light')]: {
                  color: { xs: '#FFF', md: 'text.tertiary' },
                },
              })}
            >
              or
            </Divider> */}
            {/* <Stack sx={{ gap: 4, mt: 2 }}>
              <form
                onSubmit={(event: React.FormEvent<SignInFormElement>) => {
                  event.preventDefault();
                  const formElements = event.currentTarget.elements;
                  const data = {
                    email: formElements.email.value,
                    password: formElements.password.value,
                    persistent: formElements.persistent.checked,
                  };
                  alert(JSON.stringify(data, null, 2));
                }}
              >
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" />
                </FormControl>
                <Stack sx={{ gap: 4, mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Checkbox size="sm" label="Remember me" name="persistent" />
                    <Link level="title-sm" href="#replace-with-a-link">
                      Forgot your password?
                    </Link>
                  </Box>
                  <Button type="submit" fullWidth>
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Stack> */}
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: 'center' }}>
              © Serene MINDS {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          transition:
            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
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
    </CssVarsProvider>
  );
}
