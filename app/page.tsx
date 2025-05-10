/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useChat } from "ai/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import "katex/dist/katex.min.css";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SUBJECTS } from "./data";
import { LoadingIndicator } from "@/components/utils";

// Primary colors
const PRIMARY_COLOR = "#921733";

// Subject interface
export interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  systemPrompt: string;
  suggestions: Array<{
    text: string;
    icon: string;
  }>;
}

// Composant de bouton de suggestion
interface SuggestionButtonProps {
  text: string;
  icon: string;
  onClick: () => void;
  color?: string;
}

const SuggestionButton: React.FC<SuggestionButtonProps> = ({
  text,
  icon,
  color = PRIMARY_COLOR,
  onClick,
}) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="px-4 py-2 rounded-full bg-opacity-20 hover:bg-opacity-30 text-sm flex items-center gap-2"
    style={{
      backgroundColor: `${color}20`,
      color: color,
    }}
    onClick={onClick}
  >
    <Icon icon={icon} color={color} className="size-3 opacity-70" />
    {text}
  </motion.button>
);

// Composant pour le bouton d'envoi
interface SendButtonProps {
  disabled: boolean;
  type?: "submit" | "button" | "reset";
}

const SendButton: React.FC<SendButtonProps> = ({
  disabled,
  type = "submit",
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    type={type}
    disabled={disabled}
    className="rounded-full hover:bg-opacity-80 h-10 w-10 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
    style={{ backgroundColor: PRIMARY_COLOR }}
  >
    <Icon icon="fluent:arrow-up-12-filled" width={18} height={18} />
  </motion.button>
);

// Composant pour le bouton d'arrêt
interface StopButtonProps {
  onClick: () => void;
}

const StopButton: React.FC<StopButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="rounded-full h-10 w-10 flex items-center justify-center text-white hover:bg-opacity-80"
    style={{ backgroundColor: "#333333" }}
  >
    <Icon icon="solar:stop-bold" width={16} height={16} />
  </button>
);

// Composant pour afficher le contenu Markdown
interface MarkdownContentProps {
  content: string;
}

const MarkdownContent = memo(({ content }: MarkdownContentProps) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: false }]]}
    rehypePlugins={[rehypeKatex]}
    components={{
      table: ({ children }) => (
        <div className="overflow-x-auto">
          <table className="border-collapse my-4 w-full">{children}</table>
        </div>
      ),
      thead: ({ children }) => <thead>{children}</thead>,
      th: ({ children }) => (
        <th className="px-4 py-2 bg-zinc-50 text-zinc-800 border border-zinc-200">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="px-4 py-2 text-zinc-700 border border-zinc-200">
          {children}
        </td>
      ),
      tr: ({ children }) => (
        <tr className="border-b border-zinc-200">{children}</tr>
      ),
      pre: ({ children }) => (
        <pre className="bg-zinc-50 rounded-lg p-4 overflow-x-auto my-4">
          {children}
        </pre>
      ),
      code: ({ children, className }) => {
        const match = /language-(\w+)/.exec(className || "");
        return match ? (
          <code
            className={`${className} block p-4 bg-zinc-50 rounded-lg overflow-x-auto`}
          >
            {children}
          </code>
        ) : (
          <code className="bg-zinc-50 text-zinc-800 px-1 py-0.5 rounded text-sm">
            {children}
          </code>
        );
      },
      p: ({ children }) => <p className="my-3">{children}</p>,
      ul: ({ children }) => <ul className="list-disc pl-6 my-3">{children}</ul>,
      ol: ({ children }) => (
        <ol className="list-decimal pl-6 my-3">{children}</ol>
      ),
      li: ({ children }) => <li className="my-1">{children}</li>,
      h1: ({ children }) => (
        <h1 className="text-2xl font-medium my-4">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-xl font-medium my-3">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-lg font-medium my-2">{children}</h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-zinc-300 pl-4 italic my-4">
          {children}
        </blockquote>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
));

MarkdownContent.displayName = "MarkdownContent";

// Composant de sélection de sujet
interface SubjectSelectorProps {
  onSelectSubject: (subject: Subject) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  onSelectSubject,
}) => {
  const [open, setOpen] = useState(false);
  const displayedSubjects = SUBJECTS.slice(0, 5);
  const remainingSubjects = SUBJECTS.slice(5);

  return (
    <div className="flex flex-col items-center w-full pt-14">
      <h2 className="text-md font-medium mb-8 text-center">
        Quel sujet souhaitez-vous étudier ?
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {displayedSubjects.map((subject) => (
          <SubjectPill
            key={subject.id}
            subject={subject}
            onSelect={onSelectSubject}
          />
        ))}
      </div>

      {remainingSubjects.length > 0 && (
        <div className="w-full flex justify-center mt-2 mb-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(true)}
              className="px-3 py-1 rounded-full flex items-center gap-1 text-sm bg-zinc-200"
              style={{
                color: PRIMARY_COLOR,
              }}
            >
              <Icon icon="mdi:plus" className="text-sm text-black" />
              <span className="text-black">Voir plus de sujets</span>
            </motion.button>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle
                  className="text-xl font-medium"
                  style={{ color: PRIMARY_COLOR }}
                >
                  Tous les sujets disponibles
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                {SUBJECTS.map((subject) => (
                  <SubjectPill
                    key={subject.id}
                    subject={subject}
                    onSelect={(subject) => {
                      onSelectSubject(subject);
                      setOpen(false);
                    }}
                  />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

// Composant pour un sujet en forme de pill
interface SubjectPillProps {
  subject: Subject;
  onSelect: (subject: Subject) => void;
}

const SubjectPill: React.FC<SubjectPillProps> = ({ subject, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(subject)}
      className="cursor-pointer"
    >
      <div className="flex items-center">
        <div
          className="flex items-center px-3 py-1 rounded-full"
          style={{ backgroundColor: subject.color + "20" }}
        >
          <Icon
            icon={subject.icon}
            className="mr-1"
            style={{ color: subject.color }}
          />
          <span
            className="text-base font-medium"
            style={{ color: subject.color }}
          >
            {subject.title}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Application principale JurisPerform
const JurisPerformChat = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hoveringMessage, setHoveringMessage] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Utiliser le hook useChat pour la gestion du chat et du streaming
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: aiHandleSubmit,
    isLoading,
    stop,
    setInput,
    status,
  } = useChat({
    api: "/api/chat",
    body: {
      systemPrompt:
        selectedSubject?.systemPrompt ||
        "Tu es un assistant pour les étudiants de JURISPERFORM. Réponds à leurs questions juridiques.",
    },
    onFinish: () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "80px";
      }
      setIsAtBottom(true);
    },
  });

  // Effet pour le défilement automatique
  useEffect(() => {
    if (bottomRef.current && isAtBottom) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  // Check if user is at bottom of messages
  const checkIfAtBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const tolerance = 100; // pixels of tolerance
      const atBottom = scrollTop + clientHeight >= scrollHeight - tolerance;
      setIsAtBottom(atBottom);
    }
  };

  // Handle scroll event
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkIfAtBottom);
      return () => container.removeEventListener("scroll", checkIfAtBottom);
    }
  }, []);

  // Ajuster la hauteur du textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "80px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  };

  // Gérer le changement d'input avec redimensionnement automatique
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        80,
        textareaRef.current.scrollHeight
      )}px`;
    }
  };

  // Handle Enter key (submit on Enter, new line on Shift+Enter)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const form = e.currentTarget.form;
        if (form) form.requestSubmit();
      }
    }
  };

  // Wrapper pour handleSubmit
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      aiHandleSubmit(e);
      // Reset textarea height after submission
      if (textareaRef.current) {
        textareaRef.current.style.height = "80px";
      }
    }
  };

  // Sélectionner une matière
  const handleSubjectSelection = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  // Désélectionner une matière
  const handleUnselectSubject = () => {
    setSelectedSubject(null);
    // Clear messages
    // Note: useChat doesn't provide a direct way to clear messages,
    // but you can reset by remounting the component or other techniques
  };

  // Appliquer une suggestion
  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }
  };

  // Copy assistant response to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const placeholder = selectedSubject
    ? `Posez une question sur ${selectedSubject.title}...`
    : "Posez votre question...";

  const hasMessages = messages.length > 0;

  // Determine if we're streaming the current message
  const isStreaming = status === "streaming";

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* En-tête */}
      <div className="bg-white p-4">
        <div className="flex items-center max-w-7xl mx-auto">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img
              src="https://www.juris-perform.fr/wp-content/uploads/2025/03/general_jurisperform-logo_light.webp"
              alt="JURISPERFORM"
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {/* Si aucun sujet n'est sélectionné, afficher le sélecteur de sujet */}
        {!selectedSubject && !hasMessages && (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-5xl mx-auto p-6">
              <div className="flex flex-col md:flex-row items-center justify-center mx-auto mb-16 gap-2">
                <div className="text-2xl font-medium text-center md:text-left order-2 md:order-1 md:min-w-[300px]">
                  Votre assistant juridique personnel
                </div>
                <img
                  src="https://www.juris-perform.fr/wp-content/uploads/2025/03/general_jurisperform-logo_light.webp"
                  alt="JURISPERFORM"
                  className="h-10 w-auto order-1 md:order-2"
                />
              </div>

              <div className="max-w-3xl mx-auto">
                <SubjectSelector onSelectSubject={handleSubjectSelection} />
              </div>
            </div>
          </div>
        )}

        {/* Zone de messages */}
        <div
          className={`flex-1 overflow-y-auto py-4 ${
            selectedSubject || hasMessages ? "pb-32" : "pb-32"
          }`}
          ref={messagesContainerRef}
          style={{ overflowY: "auto" }}
        >
          <div className="max-w-4xl mx-auto px-4">
            <AnimatePresence>
              <div className="space-y-6">
                {messages.map((message, index) => {
                  const isUser = message.role === "user";
                  const isSystem = message.role === "system";
                  const isLastMessage = index === messages.length - 1;

                  // Skip the last message if it's currently streaming (we'll render it separately)
                  if (isLastMessage && isStreaming && !isUser) {
                    return null;
                  }

                  return (
                    <motion.div
                      key={message.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                      onMouseEnter={() =>
                        !isUser && !isSystem && setHoveringMessage(message.id)
                      }
                      onMouseLeave={() => setHoveringMessage(null)}
                    >
                      {isSystem ? (
                        <div className="mx-auto bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600">
                          {message.content}
                        </div>
                      ) : (
                        <div
                          className={`${
                            isUser
                              ? "bg-zinc-100 rounded-full px-4 py-3 text-black max-w-3xl"
                              : "rounded-full px-4 py-3 text-black max-w-3xl font-light"
                          }`}
                        >
                          {isUser ? (
                            <div className="text-md">{message.content}</div>
                          ) : isLastMessage && isLoading && !isStreaming ? (
                            <div className="flex items-start gap-3">
                              <LoadingIndicator text="Génération de réponse..." />
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
                              <img
                                src="https://scontent-cdg4-1.xx.fbcdn.net/v/t39.30808-6/243545334_2692351124400917_6911443677279474764_n.png?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=5G-mTaUKu2YQ7kNvwGbcjqR&_nc_oc=AdkBgX0pzDtUt-IGrvPIpMQ-oJkmkNvxpzkbmDKvJMhH1uBK9dRINbmcp8i2wZt6eIYpmx2BwqkunzPS7yqEHnzs&_nc_zt=23&_nc_ht=scontent-cdg4-1.xx&_nc_gid=fCbban1Tppn280cecrj01A&oh=00_AfInEX5oK130CqVW6VV0iJ99EFxsqYErdwGjVpDcDq8WrA&oe=68253D70"
                                alt="JURISPERFORM"
                                className="size-12 rounded-full object-cover mt-1"
                              />
                              <div className="ml-1">
                                <MarkdownContent content={message.content} />
                                <div
                                  className={`flex mt-2 space-x-4 transition-opacity duration-200 ${
                                    hoveringMessage === message.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                >
                                  <button
                                    onClick={() =>
                                      copyToClipboard(message.content)
                                    }
                                    className="text-zinc-500 hover:text-zinc-800"
                                  >
                                    <Icon
                                      icon="lucide:clipboard-copy"
                                      width={16}
                                      height={16}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Afficher le message en cours de streaming */}
                {isStreaming && messages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-full px-4 py-3 text-black max-w-3xl font-light">
                      <div className="flex items-start gap-3">
                        <img
                          src="https://scontent-cdg4-1.xx.fbcdn.net/v/t39.30808-6/243545334_2692351124400917_6911443677279474764_n.png?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=5G-mTaUKu2YQ7kNvwGbcjqR&_nc_oc=AdkBgX0pzDtUt-IGrvPIpMQ-oJkmkNvxpzkbmDKvJMhH1uBK9dRINbmcp8i2wZt6eIYpmx2BwqkunzPS7yqEHnzs&_nc_zt=23&_nc_ht=scontent-cdg4-1.xx&_nc_gid=fCbban1Tppn280cecrj01A&oh=00_AfInEX5oK130CqVW6VV0iJ99EFxsqYErdwGjVpDcDq8WrA&oe=68253D70"
                          alt="JURISPERFORM"
                          className="w-8 h-8 rounded-full object-cover mt-1"
                        />
                        <div className="ml-1">
                          <MarkdownContent
                            content={
                              messages[messages.length - 1]?.content || ""
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Suggestions si un sujet est sélectionné et qu'il n'y a pas de messages */}
                {selectedSubject && messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 justify-center items-center w-full h-full mt-32"
                  >
                    <div className="flex flex-col items-center justify-center w-full">
                      <h3 className="text-lg font-medium mb-6">
                        Suggestions pour {selectedSubject.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {selectedSubject.suggestions.map((suggestion, idx) => (
                          <SuggestionButton
                            key={idx}
                            text={suggestion.text}
                            icon={suggestion.icon}
                            color={selectedSubject.color}
                            onClick={() => handleSuggestion(suggestion.text)}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input fixe en bas - toujours visible */}
        <div className="fixed bottom-0 left-0 right-0 bg-white py-4">
          <div className="max-w-3xl mx-auto px-4">
            <form onSubmit={handleFormSubmit} className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full resize-none pr-14 pb-12 min-h-[7.5rem] rounded-[1.5rem] border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.1),_0_1px_3px_rgba(0,0,0,0.05)] font-light p-4 text-zinc-900 text-md focus:outline-none"
                rows={1}
                disabled={isLoading}
              />

              {/* Badge du sujet sélectionné - affiché uniquement si un sujet est sélectionné */}
              {selectedSubject && (
                <div
                  className="absolute left-3 bottom-4 rounded-full px-3 py-1 flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: `${selectedSubject.color}20`,
                    color: selectedSubject.color,
                  }}
                >
                  <Icon icon={selectedSubject.icon} width={16} height={16} />
                  <span>{selectedSubject.title}</span>
                  <button
                    onClick={handleUnselectSubject}
                    className="ml-1 p-1 rounded-full hover:bg-black/10"
                    type="button"
                  >
                    <Icon icon="ph:x-bold" width={10} height={10} />
                  </button>
                </div>
              )}

              {/* Bouton d'envoi/arrêt */}
              <div className="absolute right-3 bottom-4">
                {isLoading ? (
                  <StopButton onClick={stop} />
                ) : (
                  <SendButton disabled={!input.trim() || isLoading} />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JurisPerformChat;
