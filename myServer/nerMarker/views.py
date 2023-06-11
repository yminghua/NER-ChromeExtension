from keras.models import load_model
from keras_contrib.layers import CRF
from keras_contrib import losses
from keras_contrib import metrics
import numpy as np
import re
import string
import json
# from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


MAX_SENTENCE = 104

with open("word2index.json", "r") as f:
    word2index = json.load(f)
with open("index2tag.json", "r") as f:
    index2tag = json.load(f)
    
re_tok = re.compile(f"([{string.punctuation}“”¨«»®´·º½¾¿¡§£₤‘’])")


@csrf_exempt
def NER_processing(request):
    if request.method == 'POST':
        sentenceList = json.loads(request.body)['textList']
        padded_sentence_list = []
        token_list = []

        for sentence in sentenceList:
            sentence = re_tok.sub(r"  ", sentence).split()
            token_list.append(sentence)
            padded_sentence = sentence + ["<PAD>"] * (MAX_SENTENCE - len(sentence))
            padded_sentence = [word2index.get(w, 0) for w in padded_sentence]
            padded_sentence_list.append(padded_sentence)
        
        model = load_model('pretrained_model.h5', custom_objects={'CRF': CRF,'crf_loss': losses.crf_loss, 'crf_accuracy': metrics.crf_accuracy})
        pred = model.predict(np.array(padded_sentence_list))
        
        pred = np.argmax(pred, axis=-1)
        pred_str_list = [[str(i) for i in pred[idx]][:len(sentence)] for idx, sentence in enumerate(token_list)]
        labels = [[index2tag[p][-3:] for p in pred_str] for pred_str in pred_str_list]
        
        # Return a JSON response
        return JsonResponse({'textToken': token_list, 'parsedlabel': labels})
