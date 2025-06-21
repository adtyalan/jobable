    import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
    // Hanya import jika bukan web (hindari error bundler)
    import Voice from "@react-native-voice/voice";

    type UseVoiceReturn = {
    result: string;
    started: boolean;
    error: string | null;
    startRecognition: () => void;
    stopRecognition: () => void;
    resetResult: () => void;
    };

    export function useVoiceRecognition(): UseVoiceReturn {
    const [result, setResult] = useState<string>("");
    const [started, setStarted] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (Platform.OS !== "web") {
        Voice.onSpeechResults = (e: any) => {
            const value = e.value?.[0] || "";
            setResult(value);
        };
        Voice.onSpeechStart = () => setStarted(true);
        Voice.onSpeechEnd = () => setStarted(false);
        Voice.onSpeechError = (e: any) => {
            setError(e.error.message);
            setStarted(false);
        };
        }

        return () => {
        if (Platform.OS !== "web") {
            Voice.destroy().then(() => Voice.removeAllListeners());
        }
        };
    }, []);

    const startRecognition = async () => {
        setError(null);
        setResult("");

        if (Platform.OS === "web") {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Browser tidak mendukung speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "id-ID";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setStarted(true);
        recognition.onerror = (event: any) => {
            setError(event.error);
            setStarted(false);
        };
        recognition.onend = () => setStarted(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setResult(transcript);
        };

        recognitionRef.current = recognition;
        recognition.start();
        } else {
        try {
            await Voice.start("id-ID");
        } catch (e: any) {
            setError(e.message);
        }
        }
    };

    const stopRecognition = async () => {
        if (Platform.OS === "web") {
        recognitionRef.current?.stop();
        } else {
        try {
            await Voice.stop();
        } catch (e: any) {
            setError(e.message);
        }
        }
        setStarted(false);
    };

    const resetResult = () => {
        setResult("");
        setError(null);
    };

    return {
        result,
        started,
        error,
        startRecognition,
        stopRecognition,
        resetResult,
    };
    }
