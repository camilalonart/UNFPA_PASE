import dotenv
import argparse

from collections import Counter

import re, numpy as np, pandas as pd
import string

from nltk.corpus import stopwords 

import matplotlib.colors as mcolors

import json
from bson import json_util

import gensim
import gensim.corpora as corpora
from gensim.utils import simple_preprocess
from gensim.models import CoherenceModel
from gensim.models import LdaModel
from gensim.utils import lemmatize

import csv

import spacy
import argparse
#-----------------------------------------------------------------------------------------------------
parser = argparse.ArgumentParser()
parser.add_argument("--path", required=True, type=string, help="Path for data")
args = parser.parse_args()
path = args.path
#-----------------------------------------------------------------------------------------------------
def getData():
    df = pd.read_json(path)
    return df
#-----------------------------------------------------------------------------------------------------
def preprocess(df):
    #Remover filas duplicadas
    df = df.drop_duplicates(subset=['respuesta'])

    #remover espacios extra entre palabras
    df['respuesta'] = df['respuesta'].str.replace('  ',' ')
    df['respuesta'] = df['respuesta'].str.strip()
    #transformar a minuscula
    df['respuesta'] = df['respuesta'].str.lower()
    #eliminar puntuacion
    df['respuesta'] = df['respuesta'].str.replace(r'\s+', ' ')
    df['respuesta'] = df['respuesta'].str.replace('[{}]'.format(string.punctuation), '')

    #ods de ods_n como string a n entero
    df.ods = [ int(data[data.find('_')+1:])for data in df.ods ]
    #meta de meta_ods_n como string a n entero
    df.meta = [ data[data.rfind('_')+1:] for data in df.meta ]
    return df
#-----------------------------------------------------------------------------------------------------
def process(df):
    stop_words = stopwords.words('spanish')
    stop_words.extend(['importante','saber','caso','decirlo''esperar','servicio','colombia','decirlo','completamente','encontrar','negocio','respetar','rural','inclusive','loma','libre','hablar','andar','hijo','cuerpo','visual','compromiso','abr','basura','estrato','sustentar','tampoco','seguir','grave','situación','manera','mejorar','poner','hecho','villanueva','jul','may','aug','nuevo','desarrollar','totalmente','aquejar','general','transicion','casar','clase','necesitar','pensar','sentir','comunicar','conseguir','disfrutar','vendria','vuelta','preferir''darle','mano','alto','claro','bello','buscar','viendo','zonas','tal','podría','afectando','primer','aún','mismos','sólo','digo','aunque','mal','encuentra','cuanto','diferentes','hoy','diría','allá','dejan','arribar','dejar','regar','suceder','valorar','esquinar','mantener','concienciar','solo','vacuno','ayudar','gustar','taco','ninos','jun','ocasionar','evidenciar','pedir','apartar','demorar','aguar','fuerte','inseguro','horas','habitantes','persona','poder','pronto','lugar','empiezan','alguien','presentando','actualmente','saben', 'cosa', 'sido','pues','así','acá','siempre','tan','sector','decir','pasar','mundo','territorio','siendo','varios','verdad','principalmente', 'partes','causa','hacia','sabe','sido','quiere','quién','saben','cosa','sido','tantos', 'salir', 'nunca','calles','visto','mayor','gran','dónde','veo','poca','dice','cada','da','ir','nadie','enfrenta','podemos','casi','menos','cuenta','haciendo','hacen','tipo','bien','digamos','primero','haciendo','cantidad','forma','lado','dar','después','últimamente','mejor','debido','precioso','preferir','quedarse','encerrar','esperar','pensamiento','idolo','sentimiento','aprender','poblador','pico','horrible','realmente','toda','consideró','quedan','siempre','día','problemáticas','cualquier','problemática','día','hora','genera','nivel','falta','principales','presenta','pueden','ejemplo','grande','mala','pasan','ahora','van','considero','manejan','todas','dos','parece','personas','tener','pasan','parte','creo','cuantas','segundo','veces','muchas','tema','personar','medellín','días','ciudad','barrio','gente','problemas','tiene','sector','ser','llegar','presentar','bueno','falto','generar','pues','así','acá','hace','ver','vez','si','generla','cierto','piso','mientras','ahí','cómo','pasando','capacidad','ninguna','tantas','toca','sectores','ven','recogen','va','debería','buenos','sabemos','ciertas','sé','necesita','tan','aquí','sino','años','pertenencia','caminar','prado','deporte','mes','mendicidad','atender','altavista','pie','dificultad','incluso','ve','cosas','puede','afecta','daniel','solamente','edad','barrios','atención','vivir','tolerancia','frente','municipio','comunidad','común','cuidado','vivo','buen','grandes','partir','social','difícil','vida','prueba','dominantData','sacarlo','orden','pueblo','sol','hombre','actual','imposible','intolerancia','tarde','dicho','ahorita','pasa','obviamente','robledo','afectar','pesar','semana','bajar','sale','ninguna','simple','altamente','diferente','margen','comunicación','temas','empresa','derecho','hermano','familiar','constantemente','demasiados','cultura','seguro','mantenimiento','debe','considera','aspectos','poquito','venir','punto','peor','responsabilidad','factor','entorno','llevar','medio','uso','tranquilo','sitio','favor','todavía','cerca','mañana','momentos','apoyo','lleva','considera','mayoría','alrededor','vereda','fácil','presentan','sacan','llegan','necesitamos','grupos','necesidad','puesto','vecino','país','camino','público','vamos','usted','dentro','ponen','segunda','zona','comunas','deben','sociedad','san_cristóbal','san_antonio','acompañamiento','tiempo','bastante','comuna','definitivamente','comuna','dando','buena','buenas','dan','secundario','afectan','mantienen','centro','existe','año','recursos','sacar','calidad','necesidades','corregimiento','malo','vemos','pase','san_cristóbal','belén','lugares','lugar','espacio','espacios','segundo','manejo','queda','tanta','demasiado','tambien','mas','segundar','problema','demás','igual','casas','problemática','entonces','hacer','mucho','quedo','mismo','momento','pienso','principal','mucha'])
    pattern = r'\b(?:{})\b'.format('|'.join(stop_words))
    df['respuesta'] = df['respuesta'].str.replace(pattern, '')

    def sent_to_words(sentences):
        for sent in sentences:
            sent = gensim.utils.simple_preprocess(str(sent), deacc=True) 
            yield(sent)  

    # Convert to list
    data = df.values.tolist()
    data_words = list(sent_to_words(data))
    # Build the bigram and trigram models
    bigram = gensim.models.Phrases(data_words, min_count=5, threshold=100) # higher threshold fewer phrases.
    trigram = gensim.models.Phrases(bigram[data_words], threshold=100)  
    bigram_mod = gensim.models.phrases.Phraser(bigram)
    trigram_mod = gensim.models.phrases.Phraser(trigram)

    # !python3 -m spacy download en  # run in terminal once
    def process_words(texts, stop_words=stop_words, allowed_postags=['NOUN', 'ADJ', 'VERB', 'ADV']):
        """Remove Stopwords, Form Bigrams, Trigrams and Lemmatization"""
        texts = [[word for word in simple_preprocess(str(doc)) if word not in stop_words] for doc in texts]
        texts = [bigram_mod[doc] for doc in texts]
        texts = [trigram_mod[bigram_mod[doc]] for doc in texts]
        texts_out = []
        nlp = spacy.load("es_core_news_sm")
        for sent in texts:
            doc = nlp(" ".join(sent)) 
            texts_out.append([token.lemma_ for token in doc if token.pos_ in allowed_postags])
        # remove stopwords once more after lemmatization
        texts_out = [[word for word in simple_preprocess(str(doc)) if word not in stop_words] for doc in texts_out]    
        return texts_out

    return process_words(data_words)  # processed Text Data!
if __name__ == "__main__":
    dotenv.load_dotenv(".env")
    df = getData()
    df = preprocess(df)
    data_ready = process(df)
    df.to_pickle("./processedData.pkl")
    with open('data_ready.csv', 'w') as f:
        write = csv.writer(f)
        write.writerows(data_ready)
       