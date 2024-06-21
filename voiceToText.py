import speech_recognition as sr
import logging

logging.basicConfig(level=logging.DEBUG)

def recognize_and_struct_chess_move():
    def recognize_speech():
        recognizer = sr.Recognizer()
        microphone = sr.Microphone()

        with microphone as source:
            logging.info("Say your chess move:")
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source)

        try:
            speech_text = recognizer.recognize_google(audio)
            logging.info(f"You said: {speech_text}")
            return speech_text
        except sr.UnknownValueError:
            logging.error("Could not understand audio")
        except sr.RequestError as e:
            logging.error(f"Could not request results {e}")

        return None

    def correct_misinterpretations(word):
        misinterpretations = {
            "night": "knight",
            "king": "king",
            "queen": "queen",
            "rook": "rook",
            "bishop": "bishop",
            "pawn": "pawn"
        }
        return misinterpretations.get(word, word)

    def parse_chess_move(text):
        pieces = ["king", "queen", "rook", "bishop", "knight", "pawn"]
        piece = ""
        initial_pos = ""
        final_pos = ""

        words = text.lower().split()

        for word in words:
            corrected_word = correct_misinterpretations(word)
            if corrected_word in pieces:
                piece = corrected_word
            elif len(corrected_word) == 2 and corrected_word[0].isalpha() and corrected_word[1].isdigit():
                if not initial_pos:
                    initial_pos = corrected_word
                else:
                    final_pos = corrected_word

        return piece, initial_pos, final_pos

    def format_output(piece, initial_pos, final_pos):
        if piece and initial_pos and final_pos:
            return f"{piece} {initial_pos} {final_pos}"
        else:
            return "Invalid input"
        
    def save_command_as_ts(piece, initial_pos, final_pos, filename="src/chess_commands.ts"):
        class_template = f"""
class ChessMove {{
    piece: string;
    initialX: string;
    initialY: number;
    finalX: string;
    finalY: number;

    constructor(piece: string, initialX: string, initialY: number, finalX: string, finalY: number) {{
        this.piece = "{piece}";
        this.initialX = "{initial_pos[0]}";
        this.initialY = {initial_pos[1]};
        this.finalX = "{final_pos[0]}";
        this.finalY = {final_pos[1]};
    }}
}}
"""
        with open(filename, "w") as file:  # Open the file in write mode to overwrite content
            logging.info(f"Saving command to {filename}")
            file.write(class_template)

    speech_text = recognize_speech()
    if speech_text:
        piece, initial_pos, final_pos = parse_chess_move(speech_text)
        output = format_output(piece, initial_pos, final_pos)
        if output != "Invalid input":
            save_command_as_ts(piece, initial_pos, final_pos)
            logging.info(f"Command saved: {output}")
        return output
    logging.warning("No valid speech recognized")
    return "No valid speech recognized"
