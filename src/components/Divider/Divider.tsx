type DividerProps = {
  text: string;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  marginY?: string;
};

export function Divider({
  text,
  textColor = "text-gray-600",
  borderColor = "border-white",
  backgroundColor = "bg-white",
  fontSize = "text-lg",
  marginY = "my-8",
}: DividerProps) {
  return (
    <div className={`relative ${marginY} flex items-center`}>
      <div className={`flex-grow border-t ${borderColor}`} />
      <span
        className={`mx-4 ${textColor} font-semibold ${fontSize} ${backgroundColor} px-2 relative z-10 rounded-sm capitalize`}
      >
        {text}
      </span>
      <div className={`flex-grow border-t ${borderColor}`} />
    </div>
  );
}
