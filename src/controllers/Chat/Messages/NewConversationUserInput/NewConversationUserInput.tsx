import { useEffect, useRef, useState } from "react";
import { PLACEHOLDER_IMAGE } from "../../../../constants/";
import useOnChange from "../../../../hooks/useOnChange";
import { trpc } from "../../../../utils/trpc";
import { ChatState } from "../../Chat";

type Props = Pick<ChatState, "setCurrentRecipient">;

const styles = {
  wrapper: "absolute left-0 right-0 top-[calc(100%+12px)] rounded-lg bg-level2",
};

export default function NewConversationUserInput({
  setCurrentRecipient,
}: Props) {
  const {
    values: { user },
    handleChange,
  } = useOnChange({ user: "" });

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = trpc.user.users.useQuery(
    {
      user: user!,
    },
    { enabled: false }
  );

  const [searchResults, setSearchResults] = useState<typeof users>();
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (user) {
      clearTimeout(timer.current);
      timer.current = setTimeout(refetch, 200);
    } else {
      setSearchResults([]);
    }
  }, [user]);

  useEffect(() => {
    setSearchResults(users);
  }, [users]);

  return (
    <div className="relative">
      <input
        placeholder="Search User"
        className="h-10 w-full rounded-lg bg-level2 px-3 py-2 outline-none placeholder:text-quaternaryText"
        name="user"
        value={user}
        onChange={handleChange}
        autoComplete="off"
      />
      {((isLoading && user !== "") || error) && (
        <div className={styles.wrapper}>
          <p className="py-2 text-center">
            {isLoading ? "Loading..." : "Error"}
          </p>
        </div>
      )}
      {searchResults && (
        <ul className={styles.wrapper}>
          {searchResults.map((userEntry) => (
            <li
              className="first:rounded-t-lg last:rounded-b-lg hover:bg-level2Hover"
              key={userEntry.id}
            >
              <button
                onClick={() => setCurrentRecipient(userEntry)}
                className="flex w-full p-3 text-left"
              >
                <img
                  src={userEntry.image || PLACEHOLDER_IMAGE}
                  alt="avatar profile image"
                  className="mr-2 h-11 w-11 rounded-full"
                />
                <div>
                  <p>{userEntry.name}</p>
                  <p className="text-sm text-tertiaryText">
                    {userEntry.username}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
