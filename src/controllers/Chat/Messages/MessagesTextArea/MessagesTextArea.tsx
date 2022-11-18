import { useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import IconButton from "../../../../components/IconButton/IconButton";
import { NEW_MESSAGE } from "../../../../constants";
import useOnChange from "../../../../hooks/useOnChange";
import { trpc } from "../../../../utils/trpc";
import { ChatState } from "../../Chat";

type Props = Pick<
  ChatState,
  "currentConversationId" | "currentRecipient" | "setCurrentConversationId"
>;

export default function MessagesTextArea({
  currentConversationId,
  currentRecipient,
  setCurrentConversationId,
}: Props) {
  const {
    values: { message },
    setValues,
    handleChange,
  } = useOnChange({ message: "" });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const utils = trpc.useContext();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  const resizeTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "";
      textAreaRef.current.style.height =
        Math.min(textAreaRef.current.scrollHeight, 144) + "px";
    }
  };

  const sendMessage = () => {
    if (message) {
      sendMessageMutation.mutate(
        {
          messageText: message,
          ...(currentConversationId === NEW_MESSAGE
            ? { userId: currentRecipient!.id }
            : { conversationId: currentConversationId }),
        },
        {
          onSettled: (data, error) => {
            if (currentConversationId !== NEW_MESSAGE) {
              utils.chat.conversations.invalidate();
              utils.chat.messages.invalidate({
                conversationId: currentConversationId!,
              });
            }
            if (data) {
              setCurrentConversationId(data.id);
            }
            if (error) {
              alert(error.message);
            }
            setValues({ message: "" });
          },
        }
      );
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.altKey && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
    if (event.key === "Enter" && event.altKey) {
      event.preventDefault();
      setValues((values) => ({ message: values.message + "\r\n" }));
    }
  };

  useEffect(() => {
    resizeTextArea();
  }, [message]);

  return (
    <div className="flex items-center space-x-1">
      <textarea
        name="message"
        ref={textAreaRef}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        value={message}
        className="h-10 max-h-36 w-full resize-none rounded-lg bg-level2 px-3 py-2 outline-none placeholder:text-quaternaryText"
        placeholder="Message"
      />
      {message !== "" && (
        <IconButton onClick={sendMessage}>
          <IoSend />
        </IconButton>
      )}
    </div>
  );
}
