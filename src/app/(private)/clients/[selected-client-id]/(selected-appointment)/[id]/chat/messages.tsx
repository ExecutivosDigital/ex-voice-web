import { Message } from "@/components/chatPopup/types";
import { TypingDots } from "@/components/chatPopup/typingDots";
import { WaveformAudioPlayer } from "@/components/ui/waveform-audio-player";
import { FileText } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  message: Message;
}

export function Messages({ message }: Props) {
  const isUser = message.role === "user";
  const attachments = message.attachments || [];

  // Legacy fallback
  if (!attachments.length && message.file) {
    attachments.push({
      url: message.file,
      type: message.type || "application/octet-stream",
      name: message.name || "File",
    });
  }

  const renderAttachment = (att: {
    url: string;
    type: string;
    name: string;
  }) => {
    if (att.type.startsWith("image/")) {
      return (
        <div
          key={att.url}
          className="relative mt-2 overflow-hidden rounded-lg border border-gray-200 bg-black/5"
        >
          <Image
            src={att.url}
            alt={att.name}
            width={300}
            height={200}
            className="h-auto w-full max-w-[300px] object-cover"
          />
        </div>
      );
    }
    if (att.type.startsWith("audio/")) {
      return (
        <div
          key={att.url}
          className="mt-2 w-full max-w-sm rounded-2xl bg-transparent"
        >
          <WaveformAudioPlayer
            audioUrl={att.url}
            videoDuration="00:00"
            barCount={24}
            className="w-full border border-gray-100 bg-white shadow-sm [&_button]:bg-gray-50 [&_button]:text-gray-600 [&_button]:hover:bg-gray-100 [&_span]:font-bold [&_span]:text-gray-600 [&_svg]:text-gray-600"
          />
        </div>
      );
    }
    return (
      <div
        key={att.url}
        className="mt-2 flex items-center gap-2 rounded-lg bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      >
        <FileText className="h-5 w-5 opacity-70" />
        <span className="truncate font-medium">{att.name}</span>
      </div>
    );
  };

  return (
    <div className="">
      {isUser ? (
        <div className="group mr-2 mb-4 ml-auto flex max-w-[calc(100%-8px)] flex-col items-end justify-end gap-1 lg:mb-2 xl:mb-4 xl:max-w-[calc(100%-50px)]">
          <div className="flex min-w-10 flex-col gap-1 rounded-2xl rounded-br-none bg-gradient-to-r from-neutral-500 to-neutral-900 p-3 text-white shadow-sm shadow-gray-500/20">
            {/* Text Content */}
            {message.content && (
              <div className="group flex items-center gap-1">
                <div className="relative z-[1] break-normal whitespace-pre-wrap">
                  <div className="prose prose-sm prose-invert max-w-none break-words text-white">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline transition-opacity hover:opacity-80"
                          />
                        ),
                        p: ({ children }) => (
                          <p className="m-0 leading-relaxed">{children}</p>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Attachments */}
            {attachments.map((att) => renderAttachment(att))}
          </div>
          <div className="flex items-center justify-start gap-2 text-xs text-gray-400 lg:text-[8px] xl:text-xs">
            {moment().format("HH:mm")}
          </div>
        </div>
      ) : message.role === "ai" ? (
        message.content === "..." ? (
          <div className="group mb-4 ml-2 flex max-w-[calc(100%-8px)] flex-col items-start justify-start gap-1 space-x-2 lg:mb-2 xl:mb-4 xl:max-w-[calc(100%-50px)] rtl:space-x-reverse">
            <div className="flex min-w-10 flex-col justify-center gap-1 rounded-2xl rounded-bl-none border border-gray-100 bg-white p-2 text-black shadow-sm">
              <TypingDots />
            </div>
            <div className="flex w-full items-center gap-2 text-end text-xs lg:text-[8px] xl:text-xs">
              <span className="text-default-500">
                {moment().format("HH:mm")}
              </span>
            </div>
          </div>
        ) : (
          <div className="group mb-4 ml-2 flex max-w-[calc(100%-8px)] flex-col items-start justify-start gap-1 space-x-2 lg:mb-2 xl:mb-4 xl:max-w-[calc(100%-50px)] rtl:space-x-reverse">
            <div className="flex min-w-10 flex-col justify-center gap-1 rounded-2xl rounded-bl-none border border-gray-100 bg-white p-4 text-gray-800 shadow-sm">
              <div className="prose prose-sm prose-a:text-gray-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 max-w-none break-words text-gray-800">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                    p: ({ children }) => (
                      <p className="mb-2 leading-relaxed last:mb-0">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
            <div className="flex w-full items-center gap-2 text-end text-xs text-gray-400 lg:text-[8px] xl:text-xs">
              <span className="text-default-500">
                {moment().format("HH:mm")}
              </span>
            </div>
          </div>
        )
      ) : (
        message.role === "system" && <></>
      )}
    </div>
  );
}
