import IconButton from "../IconButton/IconButton";
import { IoMoonOutline } from "react-icons/io5";
import Chat from "../../controllers/Chat/Chat";
import { signIn, useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { PLACEHOLDER_IMAGE } from "../../constants";

export default function Navbar() {
  const { data: sessionData } = useSession();
  const { theme, setTheme } = useTheme();
  const changeUserThemeMutation = trpc.user.changeUserTheme.useMutation();
  const changeTheme = () => {
    changeUserThemeMutation.mutate(
      {
        theme: theme === "light" ? "dark" : "light",
      },
      {
        onSettled: (data, error) => {
          if (data) {
            setTheme(data.theme);
          }
          if (error) {
            alert(error.message);
          }
        },
      }
    );
  };

  useEffect(() => {
    if (sessionData?.user) {
      if (sessionData.user.theme !== theme) {
        setTheme(sessionData.user.theme);
      }
    } else {
      if (theme !== "light") {
        setTheme("light");
      }
    }
  }, [sessionData]);

  return (
    <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-end space-x-2 bg-level1 px-4 shadow-sm">
      {sessionData?.user ? (
        <>
          <IconButton onClick={changeTheme}>
            <IoMoonOutline />
          </IconButton>
          <Chat />
          <div className="flex h-10 w-10 items-center justify-center">
            <img
              alt="avatar image"
              src={sessionData.user.image || PLACEHOLDER_IMAGE}
              className="h-8 w-8 rounded-full"
            />
          </div>
        </>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </nav>
  );
}
