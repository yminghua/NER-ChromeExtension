# NER - Chrome Extension

## NER
NER stands for Named Entity Recognition. It is a natural language processing (NLP) technique used to identify and classify named entities in text into predefined categories such as person names, organizations, locations, medical terms, and more.

In this project, we implement one of the state-of-the-art NLP models: [biLSTM-CRF](./Model/biLSTM-CRF.ipynb) and we reproduce the results of [Bidirectional LSTM-CRF Models for Sequence Tagging](https://arxiv.org/pdf/1508.01991.pdf).

## Chrome Extension
An application of NER to help users to read a web page (in this project: https://english.news.cn) by highlighting entities in it.

- When a user visits this webpage in Chrome, the extension will read the content of the page, send it to a [server](./myServer/).
- The server will extract the entities (e.g., person, location, organization...) from the content and send the extractions back to the extension.
- The extension will then highlight the entities in the webpage.

## Quick Start
1. Install required packages `pip install -r requirements.txt` (python=3.6).
2. `cd myServer` then start the server `python manage.py runserver --nothreading`.
3. Upload the Chrome Extension by clicking the "Load unpacked" icon in Chrome.

[--- Demo Video ---](https://drive.google.com/file/d/1xlRWo9PCne1oCQbeW-LEFlMO-7EWNCtL/view?pli=1)
