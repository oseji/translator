import { useState, useRef, useEffect } from "react";
import copy from "clipboard-copy";
import { SayButton } from "react-say";

import iconCopy from "./assets/Copy.svg";
import iconBtn from "./assets/Sort_alfa.svg";
import iconSound from "./assets/sound_max_fill.svg";
import iconLogo from "./assets/logo.svg";
import iconSort from "./assets/Horizontal_top_left_main.svg";

function App() {
  const headerLangRef = [useRef(null), useRef(null), useRef(null)];
  const translateLangRef = [useRef(null), useRef(null), useRef(null)];
  const selectLangRef = [useRef(null), useRef(null)];

  const [inputText, setInputText] = useState("Hello,how are you?");
  const [translatedText, setTranslatedText] = useState(
    "Bonjour,comment allez-vous?"
  );

  const [translateFrom, setTranslateFrom] = useState("en");
  const [translateTo, setTranslateTo] = useState("fr");

  const [apiLink, setApiLink] = useState(
    `https://api.mymemory.translated.net/get?q=Hello,how are you?!&langpair=${translateFrom}|${translateTo}&de=jiade1233@gmail.com`
  );

  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const toggleActiveClass = (index) => {
    headerLangRef.forEach((ref, i) => {
      if (ref && ref.current) {
        const clicked = ref.current;

        if (i === index) {
          clicked.classList.add("activeLanguage");
        } else {
          clicked.classList.remove("activeLanguage");
        }
      }
    });

    const select0 = selectLangRef[0].current;
    select0.classList.remove("activeLanguage");
    select0.classList.toggle("bg-transparent");
  };

  const toggleActiveClassTrans = (index) => {
    translateLangRef.forEach((ref, i) => {
      if (ref && ref.current) {
        const clicked = ref.current;

        if (i === index) {
          clicked.classList.add("activeLanguage");
        } else {
          clicked.classList.remove("activeLanguage");
        }
      }
    });

    const select1 = selectLangRef[1].current;
    select1.classList.remove("activeLanguage");
    select1.classList.toggle("bg-transparent");
  };

  const toggleSelectClass = (index) => {
    const selectLang = selectLangRef[index].current;
    selectLang.classList.toggle("bg-transparent");
    selectLang.classList.toggle("activeLanguage");
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(apiLink);

      if (!response.ok) {
        throw new Error("An error was encountered");
      }

      const result = await response.json();

      setApiData(result);
    } catch (error) {
      setApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  //UPDATE TRANSLATED TEXT
  useEffect(() => {
    if (apiData !== null && apiData !== undefined) {
      console.log(apiData);
      setTranslatedText(apiData.matches[0].translation);
    }
  }, [apiData, isLoading]);

  //UPDATE API LINK
  useEffect(() => {
    setApiLink(
      `https://api.mymemory.translated.net/get?q=${inputText}!&langpair=${translateFrom}|${translateTo}&de=jiade1233@gmail.com`
    );

    console.log(apiLink);
    console.log(translateTo);
  }, [translateTo, translateFrom]);

  return (
    <div className="App bg-[url('./assets/hero_img.jpg')]">
      <img src={iconLogo} className="w-fit mx-auto" alt="logo" />

      <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center gap-8 flex-nowrap mt-10">
        {/* TRANSLATE */}
        <div className="translateContainer bg-slate-800">
          <header>
            <p className="hidden md:block">detect language</p>

            <p
              className="language activeLanguage"
              ref={headerLangRef[0]}
              onClick={(e) => {
                toggleActiveClass(0);
                setTranslateFrom(e.target.dataset.value);
              }}
              data-value="en"
            >
              english
            </p>

            <p
              className="language"
              ref={headerLangRef[1]}
              onClick={(e) => {
                toggleActiveClass(1);
                setTranslateFrom(e.target.dataset.value);
              }}
              data-value="fr"
            >
              french
            </p>

            <select
              className="language bg-transparent"
              ref={selectLangRef[0]}
              onChange={(e) => {
                setTranslateFrom(e.target.value);

                toggleSelectClass(0);

                headerLangRef.forEach((ref) => {
                  const lang = ref.current;
                  lang.classList.remove("activeLanguage");
                });
              }}
              // onClick={() => {
              //   toggleSelectClass(0);

              //   headerLangRef.forEach((ref) => {
              //     const lang = ref.current;
              //     lang.classList.remove("activeLanguage");
              //   });
              // }}
            >
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="it">italian</option>
            </select>
          </header>

          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setApiLink(
                `https://api.mymemory.translated.net/get?q=${e.target.value}!&langpair=${translateFrom}|${translateTo}&de=jiade1233@gmail.com`
              );
            }}
            cols="30"
            rows="5"
            maxLength={500}
          ></textarea>

          <div className="bottomSection">
            <div className="flex flex-row items-center gap-2">
              <SayButton className="icon" text={inputText}>
                <img src={iconSound} alt="s" className="iconSound" />
              </SayButton>

              <div
                className="icon"
                onClick={() => {
                  copy(inputText)
                    .then(alert("copied text"))
                    .catch((err) => console.log(err));
                }}
              >
                <img src={iconCopy} alt="copy icon" className="iconSound" />
              </div>
            </div>

            <button
              className="translateBtn"
              onClick={() => {
                fetchData();
              }}
            >
              <img src={iconBtn} alt="button icon" className="iconSound" />
              Translate
            </button>
          </div>
        </div>

        {/* RESULT */}
        <div className="translateContainer bg-slate-900">
          <header>
            <p
              className="language "
              ref={translateLangRef[0]}
              onClick={(e) => {
                toggleActiveClassTrans(0);
                setTranslateTo(e.target.dataset.value);
              }}
              data-value="en"
            >
              english
            </p>

            <p
              className="language activeLanguage"
              ref={translateLangRef[1]}
              onClick={(e) => {
                toggleActiveClassTrans(1);
                setTranslateTo(e.target.dataset.value);
              }}
              data-value="fr"
            >
              french
            </p>

            <select
              className="language bg-transparent"
              ref={selectLangRef[1]}
              onChange={(e) => {
                setTranslateTo(e.target.value);
              }}
              onClick={() => {
                toggleSelectClass(1);

                translateLangRef.forEach((ref) => {
                  const lang = ref.current;
                  lang.classList.remove("activeLanguage");
                });
              }}
            >
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="it">italian</option>
            </select>

            <img src={iconSort} alt="sort icon" className="iconSound" />
          </header>

          <textarea
            value={isLoading ? "..." : `${translatedText}`}
            cols="30"
            rows="5"
            maxLength={500}
          ></textarea>

          <div className="bottomSection">
            <div className="flex flex-row items-center gap-2">
              <SayButton className="icon" text={translatedText}>
                <img src={iconSound} alt="sound icon" className="iconSound" />
              </SayButton>

              <div
                className="icon"
                onClick={() => {
                  copy(translatedText)
                    .then(alert("copied text"))
                    .catch((err) => console.log(err));
                }}
              >
                <img src={iconCopy} alt="copy icon" className="iconSound" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
