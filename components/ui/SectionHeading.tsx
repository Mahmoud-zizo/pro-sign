interface SectionHeadingProps {
  title: string;
  highlightedWord?: string;
  className?: string;
}

export default function SectionHeading({
  title,
  highlightedWord,
  className = "",
}: SectionHeadingProps) {
  const parts = highlightedWord ? title.split(highlightedWord) : [title];

  return (
    <div className={`flex flex-col items-center gap-0 ${className}`}>
      <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 md:text-6xl">
        {highlightedWord ? (
          <>
            {parts[0]}
            <span className="text-red-500">{highlightedWord}</span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>

      {/* Curved SVG underline */}
      <svg
        viewBox="0 0 220 30"
        xmlns="http://www.w3.org/2000/svg"
        className="w-48 md:w-56"
        fill="none"
      >
        <path
          d="M10 20 Q110 0 210 20"
          stroke="#fb2c36"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
