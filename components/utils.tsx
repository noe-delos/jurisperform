// Indicateur de chargement
export const LoadingIndicator = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center text-sm text-gray-500">
      <div className="flex space-x-1 mr-2">
        <div
          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "200ms" }}
        ></div>
        <div
          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "400ms" }}
        ></div>
      </div>
      <span>{text}</span>
    </div>
  );
};
