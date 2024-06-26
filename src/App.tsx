import { SyntheticEvent, useEffect, useRef, useState } from "react";
import copy from "clipboard-copy";

import copyIcon from "./assets/Copy.svg";
import soundIcon from "./assets/sound_max_fill.svg";

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const langFromRefs = [
    useRef<HTMLParagraphElement>(null),
    useRef<HTMLParagraphElement>(null),
  ];
  const selectFromRef = useRef<HTMLSelectElement>(null);

  const langToRefs = [
    useRef<HTMLParagraphElement>(null),
    useRef<HTMLParagraphElement>(null),
  ];
  const selectToRef = useRef<HTMLSelectElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [apiData, setApiData] = useState<any>(null);

  const [selectFrom, setSelectFrom] = useState<string>("english");
  const [selectTo, setSelectTo] = useState<string>("french");

  const [translateFrom, setTranslateFrom] = useState<string>("en");
  const [translateTo, setTranslateTo] = useState<string>("fr");

  const [textToTranslate, setTextToTranslate] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");

  const [apiLink, setApiLink] = useState<string>(
    `https://api.mymemory.translated.net/get?q=${textToTranslate}!&langpair=${translateFrom}|${translateTo}&de=jiade1233@gmail.com`
  );

  const toggleTheme = () => {
    const app = appRef.current;
    app?.classList.toggle("dark");

    const dot = dotRef.current;
    dot?.classList.toggle("toggledDot");
  };

  const toggleLangFromActive = (e: SyntheticEvent) => {
    const selectFrom = selectFromRef.current;
    const clicked = e.currentTarget.getAttribute("data-value");

    langFromRefs.forEach((element) => {
      if (element.current?.getAttribute("data-value") === clicked) {
        element.current.classList.add("activeLang");
        selectFrom?.classList.remove("activeLang");
      } else {
        element.current?.classList.remove("activeLang");
      }
    });

    if (clicked === selectFrom?.getAttribute("data-value")) {
      selectFrom.classList.add("activeLang");
    }
  };
  const toggleLangToActive = (e: SyntheticEvent) => {
    const selectTo = selectToRef.current;
    const clicked = e.currentTarget.getAttribute("data-value");

    langToRefs.forEach((element) => {
      if (element.current?.getAttribute("data-value") === clicked) {
        element.current.classList.add("activeLang");
        selectTo?.classList.remove("activeLang");
      } else {
        element.current?.classList.remove("activeLang");
      }
    });

    if (clicked === selectTo?.getAttribute("data-value")) {
      selectTo.classList.add("activeLang");
    }
  };

  const toggleSound = (phrase: string, language: string) => {
    const synth = window.speechSynthesis;
    const text = new SpeechSynthesisUtterance(phrase);

    text.lang = language;

    synth.speak(text);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiLink);

      if (!res.ok) {
        throw new Error(`Encountered an error ${res.status}`);
      }

      const result = await res.json();
      setApiData(result);
      console.log(result);
    } catch (err: any) {
      setError(err);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelectFrom((): string => {
      let word = "";

      if (translateFrom === "en") {
        word = "english";
      }
      if (translateFrom === "fr") {
        word = "french";
      }
      if (translateFrom === "es") {
        word = "spanish";
      }
      if (translateFrom === "it") {
        word = "italian";
      }
      if (translateFrom === "de") {
        word = "german";
      }

      return word;
    });

    setSelectTo((): string => {
      let word = "";

      if (translateTo === "en") {
        word = "english";
      }
      if (translateTo === "fr") {
        word = "french";
      }
      if (translateTo === "es") {
        word = "spanish";
      }
      if (translateTo === "it") {
        word = "italian";
      }
      if (translateTo === "de") {
        word = "german";
      }

      return word;
    });
  }, [translateFrom, translateTo]);

  //UPDATING API LINK WHENEVER LANGUAGE CHANGES
  useEffect(() => {
    setApiLink(
      `https://api.mymemory.translated.net/get?q=${textToTranslate}!&langpair=${translateFrom}|${translateTo}&de=jiade1233@gmail.com`
    );
  }, [translateFrom, translateTo, textToTranslate]);

  //UPDATE TRANSLATED TEXT
  useEffect(() => {
    if (apiData !== undefined && apiData !== null) {
      setTranslatedText(() => {
        let text = "";

        if (apiData.responseData.translatedText) {
          text = apiData.responseData.translatedText;
        } else {
          text = "Could not find translation";
        }

        return text;
      });
    }
  }, [apiData]);

  return (
    <div className="App" ref={appRef}>
      <header>
        <p>light</p>

        <div className="themeSwitcher" onClick={toggleTheme}>
          <div className="dot" ref={dotRef}></div>
        </div>

        <p>dark</p>
      </header>

      <section>
        {/* TRANSLATE FROM */}
        <div className="translateBox">
          <div className="selectedLanguageBox">{selectFrom}</div>

          <div className="selectLanguageGroup">
            <p
              data-value="en"
              className="langSelection activeLang"
              ref={langFromRefs[0]}
              onClick={(e) => {
                setTranslateFrom("en");
                toggleLangFromActive(e);
              }}
            >
              english
            </p>
            <p
              data-value="fr"
              className="langSelection"
              ref={langFromRefs[1]}
              onClick={(e) => {
                setTranslateFrom("fr");
                toggleLangFromActive(e);
              }}
            >
              french
            </p>

            <select
              ref={selectFromRef}
              data-value="select"
              onClick={toggleLangFromActive}
              onChange={(e) => {
                setTranslateFrom(e.currentTarget.value);
              }}
            >
              <option value="">select language</option>
              <option value="es">spanish</option>
              <option value="it">italian</option>
              <option value="de">german</option>
            </select>
          </div>

          <textarea
            placeholder="Hello there, what's your name?"
            value={textToTranslate}
            onChange={(e) => {
              setTextToTranslate(e.target.value);
            }}
          />

          <div className="bottomGrp">
            <div className="flex flex-row items-center gap-10">
              <img
                src={soundIcon}
                alt="sound icon"
                onClick={() => {
                  if (textToTranslate !== "") {
                    toggleSound(textToTranslate, translateFrom);
                  }
                }}
              />
              <img
                src={copyIcon}
                alt="copy icon"
                onClick={() => {
                  copy(textToTranslate)
                    .then(() => alert(`Copied: ${textToTranslate}`))
                    .catch((err) => console.log(err));
                }}
              />
            </div>

            <button
              className="px-3 py-1.5 rounded-md bg-blue-600 dark:bg-slate-900 text-white font-semibold hover:scale-110 transition ease-in-out duration-150"
              onClick={fetchData}
            >
              Translate
            </button>
          </div>
        </div>

        {/* TRANSLATE TO */}
        <div className="translateBox">
          <div className="selectedLanguageBox">{selectTo}</div>

          <div className="selectLanguageGroup">
            <p
              data-value="en"
              className="langSelection"
              ref={langToRefs[0]}
              onClick={(e) => {
                setTranslateTo("en");
                toggleLangToActive(e);
              }}
            >
              english
            </p>
            <p
              data-value="fr"
              className="langSelection activeLang"
              ref={langToRefs[1]}
              onClick={(e) => {
                setTranslateTo("fr");
                toggleLangToActive(e);
              }}
            >
              french
            </p>

            <select
              ref={selectToRef}
              data-value="select"
              onClick={toggleLangToActive}
              onChange={(e) => {
                setTranslateTo(e.currentTarget.value);
              }}
            >
              <option value="">select language</option>
              <option value="es">spanish</option>
              <option value="it">italian</option>
              <option value="de">german</option>
            </select>
          </div>

          <textarea
            placeholder="Translated text"
            value={isLoading ? "Loading....." : translatedText}
            disabled
          />

          <div className="bottomGrp">
            <div className="flex flex-row items-center gap-10">
              <img
                src={soundIcon}
                alt="sound icon"
                onClick={() => {
                  if (translatedText !== "") {
                    toggleSound(translatedText, translateTo);
                  }
                }}
              />
              <img
                src={copyIcon}
                alt="copy icon"
                onClick={() => {
                  copy(translatedText)
                    .then(() => alert(`Copied: ${translatedText}`))
                    .catch((err) => console.log(err));
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
