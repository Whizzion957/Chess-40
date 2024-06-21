from voiceToText import recognize_and_struct_chess_move

move_description = recognize_and_struct_chess_move()
if move_description:
    print(f"Parsed move: {move_description}")
else:
    print("No valid move description recognized.")
