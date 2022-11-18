import { Message } from "@prisma/client";
import { useEffect, useRef } from "react";
import { NEW_MESSAGE, PLACEHOLDER_IMAGE } from "../../../../constants";
import { trpc } from "../../../../utils/trpc";
import { ChatState } from "../../Chat";

type Props = Pick<ChatState, "currentRecipient" | "currentConversationId">;

const getTimestamp = (msgs: Message[], index: number) => {
  const currentDate = msgs[index]!.createdAt;
  const previousDate = index !== 0 ? msgs[index - 1]?.createdAt : null;
  if (previousDate) {
    if (
      previousDate.getDate() === currentDate.getDate() &&
      previousDate.getMonth() === currentDate.getMonth() &&
      previousDate.getFullYear() === currentDate.getFullYear()
    ) {
      return null;
    }
  }

  return new Intl.DateTimeFormat([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(currentDate);
};

export default function MessagesSection({
  currentRecipient,
  currentConversationId,
}: Props) {
  const {
    data: messages,
    isLoading,
    error,
  } = trpc.chat.messages.useQuery(
    {
      conversationId: currentConversationId!,
    },
    { enabled: currentConversationId !== NEW_MESSAGE }
  );

  const scrollRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if ((currentConversationId !== NEW_MESSAGE && isLoading) || error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>{isLoading ? "Loading..." : "Error"}</p>
      </div>
    );
  }

  return (
    <ul className="flex h-full flex-col space-y-5 overflow-y-scroll">
      {messages &&
        messages.map((message, index) => {
          const timestamp = getTimestamp(messages, index);
          return (
            <li className="full flex flex-col" key={message.id}>
              {timestamp !== null && (
                <p className="mb-5 text-center text-quaternaryText">
                  {timestamp}
                </p>
              )}
              {message.userId === currentRecipient?.id ? (
                <div className="flex">
                  <img
                    src={currentRecipient.image || PLACEHOLDER_IMAGE}
                    alt="avatar profile image"
                    className="mr-2 h-7 w-7 self-end rounded-full"
                  />
                  <div className="flex max-w-[60%] flex-col space-y-3 rounded-xl bg-level2 p-2">
                    <p className="whitespace-pre-line">{message.messageText}</p>
                    <p className="self-end text-xs text-tertiaryText">
                      {new Intl.DateTimeFormat([], {
                        hour: "numeric",
                        minute: "numeric",
                      }).format(message.createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex max-w-[60%] flex-col space-y-3 self-end rounded-xl bg-primaryText p-2">
                  <p className="whitespace-pre-line text-invertedPrimaryText">
                    {message.messageText}
                  </p>
                  <p className="self-end text-xs text-invertedTertiaryText">
                    {new Intl.DateTimeFormat([], {
                      hour: "numeric",
                      minute: "numeric",
                    }).format(message.createdAt)}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      <li ref={scrollRef} />
    </ul>
  );
}
