import { useState } from "react";
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../components/iconify";
import { authService } from "flexlists-api";
import { useRouter } from "next/router";

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async () => {
    try {
      // var response = await authService.register(userName,password);
      // if(response && response.code == 0)
      // {
      //   router.push({pathname:'/auth/login'});
      // }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          value={userName}
          onChange={handleChangeEmail}
        />

        <TextField
          name="password"
          label="Password"
          value={password}
          onChange={handleChangePassword}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleSubmit}
      >
        Register
      </LoadingButton>
    </>
  );
}
