import React, { useRef } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Textarea from "@mui/joy/Textarea";
import { Stack } from "@mui/joy";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

export default function MessageInput(props) {
  const { textAreaValue, setTextAreaValue, onSubmit } = props;
  const textAreaRef = useRef(null);

  const handleClick = () => {
    if (textAreaValue.trim() !== "") {
      onSubmit();
      setTextAreaValue("");
    }
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl>
        <Textarea
          placeholder="Type something here…"
          aria-label="Message"
          ref={textAreaRef}
          onChange={(event) => setTextAreaValue(event.target.value)}
          value={textAreaValue}
          minRows={3}
          maxRows={10}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleClick();
            }
          }}
          sx={{
            "& textarea:first-of-type": {
              minHeight: 72,
            },
          }}
          endDecorator={
            <Stack
              direction="row"
              sx={{
                justifyContent: "flex-end", // Align button to right
                alignItems: "center",
                flexGrow: 1,
                py: 1,
                pr: 1,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button
                size="sm"
                color="primary"
                sx={{ borderRadius: "sm" }}
                endDecorator={<SendRoundedIcon />}
                onClick={handleClick}
              >
                Send
              </Button>
            </Stack>
          }
        />
      </FormControl>
    </Box>
  );
}
