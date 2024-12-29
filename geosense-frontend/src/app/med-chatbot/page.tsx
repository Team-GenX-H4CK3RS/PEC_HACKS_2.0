"use client";
import { useEffect, useRef, useState } from "react";
import MediaStreamRecorder from "msr";
import useServerData from "@/hooks/useServerData";
import useTranslate from "@/hooks/useTranslate";
import { base64TUrl, blobToBase64 } from "@/utils/helper";

export default function MedChatBotPage() {
  const [sessionId, setSessionId] = useState<string>();
  const [chatHistory, setChatHistory] = useState<
    { content: string; src: "user" | "bot"; audio?: string }[]
  >([]);
  const [chatText, setChatText] = useState<string>();
  const [languages, setLanguages] = useState<string[][]>();
  const [mediaRecorder, setMediaRecorder] = useState<MediaStreamRecorder>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [recordedAudio, setRecordedAudio] = useState<string>();
  const [, setChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const serverData = useServerData();
  const chatHistoryDiv = useRef<HTMLDivElement>(null);
  const translator = useTranslate();

  useEffect(() => {
    const createChat = async () => {
      setSessionId(await serverData.medchat.newChat());
    };
    const loadLanguages = async () => {
      setLanguages(await translator.getLanguages());
    };
    const createMediaStreamRecorder = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mr = new MediaStreamRecorder(mediaStream);
      if (!mr) return;
      mr.mimeType = "audio/wav";
      mr.ondataavailable = function (blob: Blob) {
        setChunks((c) => [...c, blob]);
      };
      const mrStop = mr.stop;
      mr.stop = async () => {
        mrStop();
        setChunks((c) => {
          const blob = new Blob(c, { type: "audio/wav" });
          blobToBase64(blob).then(setRecordedAudio);
          return [];
        });
        setIsRecording(false);
      };
      setMediaRecorder(mr);
    };
    if (!languages || languages.length === 0) loadLanguages();
    if (!mediaRecorder) createMediaStreamRecorder();
    if (!sessionId) createChat();
  }, []);

  useEffect(() => {
    const getText = async () => {
      if (!recordedAudio) return;
      setChatText(await serverData.s2t.convertSpeechToText(recordedAudio));
    };
    getText();
  }, [recordedAudio]);

  const handleBotChatAudioPlay = async (i: number) => {
    const audio = document.getElementById(`med-chat-bot-audio-${i}`);
    if (!audio) return;
    await (audio as HTMLAudioElement).play();
  };

  const handleSend = async () => {
    if (!sessionId || !chatText || chatText.trim().length === 0) return;
    let result = await serverData.medchat.send(sessionId, chatText);
    const translated = await translator.translate(selectedLanguage, result);
    if (selectedLanguage !== "en") result = translated.result;
    const resultAudio = translated.audio;
    setChatHistory([
      ...chatHistory,
      { content: chatText, src: "user" },
      { content: result, src: "bot", audio: resultAudio },
    ]);
    setChatText(undefined);
  };

  function handleStartRecordingClick() {
    if (!mediaRecorder) return;
    mediaRecorder.start(10000);
    setIsRecording(true);
    setChatText("");
  }

  function handleStopRecordingClick() {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
  }

  useEffect(() => {
    if (!chatHistoryDiv) return;

    chatHistoryDiv.current.scroll({
      behavior: "instant",
      top: chatHistoryDiv.current.scrollHeight,
    });
  }, [chatHistory, chatHistoryDiv]);

  return (
    <div className="p-4 flex flex-col h-full items-center space-y-2 select-none">
      <div className="h-12 border-b w-full flex items-center">
        <div className="flex-grow"></div>
        {languages ? (
          <label className="flex items-center">
            <p className="pr-2">Language</p>
            <select
              className="px-3 py-1 rounded-xl overflow-hidden"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map((v, i) => (
                <option value={v[1]} key={i}>
                  {v[0]}
                </option>
              ))}
            </select>
          </label>
        ) : (
          ""
        )}
      </div>
      <div
        className="flex-grow overflow-y-auto flex flex-col p-4 space-y-2"
        ref={chatHistoryDiv}
      >
        {chatHistory!.map((v, i) => (
          <div
            key={i}
            className={`px-6 py-2 rounded-xl w-fit relative ${
              v.src === "user"
                ? "self-end bg-teal-100"
                : "self-start bg-slate-100"
            }`}
          >
            <p
              className={`font-bold ${
                v.src === "user" ? "text-right" : "text-left"
              }`}
            >
              {v.src === "user" ? "You" : "Med Bot"}
            </p>
            <p>{v.content}</p>
            {v.audio ? (
              <>
                <button
                  className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center bg-teal-700 rounded-full text-white"
                  onClick={() => handleBotChatAudioPlay(i)}
                >
                  <span className="material-symbols-rounded">volume_up</span>
                </button>
                <audio
                  src={base64TUrl(v.audio)}
                  id={`med-chat-bot-audio-${i}`}
                ></audio>
              </>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center bg-slate-100 w-full px-2 py-1 space-x-2">
        <label className="flex flex-col items-stretch w-full">
          <textarea
            className="appearance-none px-3 py-1 capitalize rounded-xl border-2 border-slate-300 focus:outline-teal-600 transition w-full min-h-[3rem]"
            value={chatText}
            placeholder="Start chatting with the chat bot..."
            onChange={(e) => setChatText(e.target.value)}
          ></textarea>
        </label>
        <button
          className={`flex items-center justify-center w-12 h-12 font-bold p-2 space-x-2 rounded-full bg-teal-700 text-white disabled:bg-slate-800 ${
            isRecording ? "bg-red-600" : "bg-teal-700"
          }`}
          disabled={!mediaRecorder}
          onClick={() => {
            if (isRecording) handleStopRecordingClick();
            else handleStartRecordingClick();
          }}
        >
          <span className="material-symbols-rounded msr-bold text-3xl">
            {isRecording ? "stop_circle" : "mic"}
          </span>
        </button>
        <button
          className="flex items-center justify-center w-12 h-12 font-bold p-2 space-x-2 rounded-full bg-teal-700 text-white"
          onClick={handleSend}
        >
          <span className="material-symbols-rounded msr-bold text-3xl">
            send
          </span>
        </button>
      </div>
    </div>
  );
}
