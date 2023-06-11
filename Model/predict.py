from keras.models import load_model
from keras_contrib.layers import CRF
from keras_contrib import losses
from keras_contrib import metrics
import numpy as np
import re
import string
import json

MAX_SENTENCE = 104

with open("word2index.json", "r") as f:
    word2index = json.load(f)
with open("index2tag.json", "r") as f:
    index2tag = json.load(f)

# sentence = "President Obama became the first sitting American president to visit Hiroshima"
sentence = "Chinese President Xi Jinping walks into the St. George's Hall at the Kremlin in Moscow, Russia, March 21, 2023. Xi on Tuesday held talks with Putin in Moscow. Putin held a solemn welcome ceremony for Xi Jinping at the St. George's Hall."

re_tok = re.compile(f"([{string.punctuation}“”¨«»®´·º½¾¿¡§£₤‘’])")
sentence = re_tok.sub(r"  ", sentence).split()

padded_sentence = sentence + ["<PAD>"] * (MAX_SENTENCE - len(sentence))
padded_sentence = [word2index.get(w, 0) for w in padded_sentence]

model = load_model('pretrained_model.h5', custom_objects={'CRF': CRF,'crf_loss': losses.crf_loss, 'crf_accuracy': metrics.crf_accuracy})

pred = model.predict(np.array([padded_sentence]))
pred = np.argmax(pred, axis=-1)
pred_str = [str(i) for i in pred[0]]

retval = ""
for w, p in zip(sentence, pred_str):
    retval = retval + "{:15}: {:5}".format(w, index2tag[p]) + "\n"
print(retval)