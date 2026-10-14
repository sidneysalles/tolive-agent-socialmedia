# A transcrição de uma narração, com o tempo de cada palavra (faster-whisper, fora do repositório: o estúdio continua
# sem dependência; isto é uma ferramenta da máquina, como o Playwright e o ffmpeg). Escreve <audio>.transcricao.json,
# que o `node estudio/narracao.mjs videos/<id> --medir <audio> <json>` transforma no narracao.json do vídeo.
#
#   python3 -m venv /tmp/stt && /tmp/stt/bin/pip install faster-whisper
#   /tmp/stt/bin/python -I estudio/transcrever.py assets/narracao/<id>/narracao.mp3 [medium|large-v3]
#
# Rode com os dois modelos e compare: o medium marca melhor o tempo das palavras; o large-v3 erra menos o texto.
import sys, json, subprocess
import numpy as np
from faster_whisper import WhisperModel

audio_arq = sys.argv[1]
modelo = WhisperModel(sys.argv[2] if len(sys.argv) > 2 else "medium", device="cpu", compute_type="int8")
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", audio_arq, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
trechos, _ = modelo.transcribe(np.frombuffer(pcm, np.float32), language="pt", word_timestamps=True, beam_size=5)
saida = []
for s in trechos:
    print(f"[{s.start:6.2f} – {s.end:6.2f}] {s.text}")
    saida.append({"inicio": s.start, "fim": s.end, "texto": s.text.strip(), "palavras": [{"p": w.word.strip(), "i": round(w.start, 3), "f": round(w.end, 3)} for w in s.words]})
json.dump(saida, open(audio_arq.rsplit(".", 1)[0] + ".transcricao.json", "w"), ensure_ascii=False, indent=1)
