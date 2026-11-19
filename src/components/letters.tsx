/**
 * Splits text into words and letters so CSS can animate each letter
 * (`data-reveal="title"` on a parent, see globals.css). Words stay whole, so
 * wrapping never breaks a word in half. Screen readers get the plain text.
 */
export function Letters({ text }: { text: string }) {
  let index = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="title-word">
              {Array.from(word).map((char, c) => (
                <span key={c} className="title-letter" style={{ "--i": index++ } as React.CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
