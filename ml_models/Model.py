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
parser.add_argument("--numberOfTopics", required=True, type=int, help="Number of topics")
args = parser.parse_args()
numberOfTopics = args.numberOfTopics

#-----------------------------------------------------------------------------------------------------

def LDAModel(df,numberOfTopics,data_ready):
    id2word = corpora.Dictionary(data_ready)
    corpus = [id2word.doc2bow(text) for text in data_ready]
    lda_model = gensim.models.ldamodel.LdaModel(
        corpus=corpus,
        id2word=id2word,
        num_topics=numberOfTopics, 
        random_state=100,
        update_every=1,
        chunksize=2000,
        passes=10,
        alpha='auto',
        per_word_topics=True)

    return lda_model, corpus, id2word

#-----------------------------------------------------------------------------------------------------
def modelPerplexityCoherenceScore(lda_model,data_words_trigrams):
    # Compute Perplexity
    perplexity = lda_model.log_perplexity(corpus)
    # Compute Coherence Score
    coherence_model_lda = CoherenceModel(model=lda_model, texts=data_words_trigrams, dictionary=id2word, coherence='c_v')
    coherence_lda = coherence_model_lda.get_coherence()
    return perplexity, coherence_lda
#-----------------------------------------------------------------------------------------------------
def storeGeneralInsight(df, odsData):
    jsonData = {}
    #ANIO--------------------------------------------------
    jsonData['anio'] = [int(df.anio[0])]
    
    #RESPUESTAS POR PREGUNTA-----------------------------------------------
    preguntasCount = df['pregunta'].value_counts()
    cantidadDePreguntas = len(preguntasCount)
    preguntasDict = {}
    for preguntaP, cantidadP in preguntasCount.iteritems():
        preguntasDict[preguntaP] = {'pregunta': preguntaP, 'cantidad': cantidadP}
    preguntasListas = list(preguntasDict.values())
    jsonData['preguntas'] = list(preguntasDict.values())
    
    #NUMERO DE RESPUESTAS--------------------------------------------------
    total = 0
    for p in preguntasListas:
        total = max(total, p['cantidad'])
    jsonData['totalRespuestas'] = total
    
    #RESPUESTAS POR EDAD-----------------------------------------------
    edades = []
    for edad, cantidad in df['rangoEdad'].value_counts().iteritems():
        edades.append([edad,cantidad//cantidadDePreguntas])
    edades.sort(key = lambda x: x[0])
    jsonData['edad'] = edades
    
    #RESPUESTAS POR SEXO-----------------------------------------------
    sexos = []
    for genero, cantidad in df['sexo'].value_counts().iteritems():
        sexoActual = {"sexoNombre": genero, "value": cantidad//cantidadDePreguntas}
        sexos.append(sexoActual)
    jsonData['sexo'] = sexos
    
    #RESPUESTAS POR ODS------------------------------------------------
    
    jsonData['porOds'] = odsData
    #TOP DE PALABRAS----------------------------------------------------
    topPalabras = []
    for numero, cantidad in df['palabra'].value_counts().iteritems():
        topPalabras.append([numero, cantidad])
    jsonData['topPalabras'] = topPalabras[:8]
    #CANTIDAD DE ODS POR MES--------------------------------------------
    datosODS = {}
    datosPorMes = df.groupby("mesTexo")
    for mes, datos in datosPorMes:
        for ods, cantidad in datos['ods'].value_counts().iteritems():
            if ods not in datosODS:
                datosODS[ods] = {'ods':ods}
            datosODS[ods][mes] = cantidad
    for ods in datosODS:
        for mes, _ in datosPorMes:
            if mes not in datosODS[ods]:
                datosODS[ods][mes] = 0

    baseImage = '../images/SDGs/'
    mesesTable = {"Ene":1,"Feb":2,"Mar":3,"Abr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dic":12}
    datosODS = list(datosODS.values())
    datosODS.sort(key = lambda x: x['ods'])
    datosEnLista = []
    for entrada in datosODS:
        listVersion = []
        for key, val in entrada.items():
            listVersion.append([key,val])
        monthsAlreadyIn = set()
        for i in range(1,len(listVersion)):
            monthsAlreadyIn.add(mesesTable[listVersion[i][0]])
            listVersion[i][0] = mesesTable[listVersion[i][0]]
        for i in range(1,13):
            if i not in monthsAlreadyIn:
                listVersion.append([i,0])
        odsS = listVersion[1:]   
        odsS.sort(key = lambda x: x[0])
        #listVersion[0][0] = baseImage + str(listVersion[0][1]) + '.png'
        #listVersion = listVersion[0] + odsS
        datosEnLista.append(listVersion)
    jsonData['datosPorMes'] = datosEnLista

    json_result = json.dumps(jsonData, default=json_util.default)
    with open('../frontend/src/ModelResults/generalResult.json', "w") as outfile:
        outfile.write(json_result)
    return jsonData  
#-----------------------------------------------------------------------------------------------------
def sankeyFile(lda_model,numberOfTopics):
    topicsData = lda_model.show_topics(num_topics = numberOfTopics,num_words=7,formatted=False)
    dataForSankey = [['From', 'To', 'Weight']]
    for topic in topicsData:
        currTopic = -1
        for words in topic:
            if type(words) == int:
                currTopic = words
            else:
                for word, weight in words:
                    sankeyRow = ['Tema '+str(currTopic+1),word,int(weight*100)]
                    dataForSankey.append(sankeyRow)
    json_result = json.dumps(dataForSankey, default=json_util.default)
    with open('../frontend/src/ModelResults/sankeyResult.json', "w") as outfile:
        outfile.write(json_result)
#-----------------------------------------------------------------------------------------------------       
def createDictForTopics(lda_model, numberOfTopics):
    topicsDictWords = {}
    i=1
    for topic, words in lda_model.show_topics(formatted=False, num_topics=numberOfTopics):
        listOfTopic = []
        for word, value in words:
            listOfTopic.append(word)
        topicsDictWords[i] = listOfTopic   
        i+=1
    return topicsDictWords
#-----------------------------------------------------------------------------------------------------
def createDictForOds(df):
    odsDictWords = {}
    for row_id, data in df.iterrows():
        if data['ods'] not in odsDictWords:        
            odsDictWords[data['ods']] = set()
        if len(data['palabra'])>=3:
            odsDictWords[data['ods']].add(data['palabra'])    
    return odsDictWords
#-----------------------------------------------------------------------------------------------------
def simmilarityOdsandTopics(topicsDictWords, odsDictWords):
    simmilarityTopics = []
    for topicNum, topicWords in topicsDictWords.items(): 
        lista = []
        
        for odsNum, odsWords in odsDictWords.items():
            list1 = odsWords
            list2 = topicWords
            num = len(set(list1) & set(list2))
            lista.append({'ods': odsNum,'Similaridad': num})
        datosTopico = {'topico':'Tema'+str(topicNum), 'SimilaridadOds' : lista, 'Palabras': topicWords}
        simmilarityTopics.append(datosTopico)
    return simmilarityTopics
#-----------------------------------------------------------------------------------------------------
def frequentODS(simmilarity):
    odsTopOrder = {}
    for topic in simmilarity:
        for data in topic['SimilaridadOds']:
            if data['ods'] in odsTopOrder:
                odsTopOrder[data['ods']] += int(data['Similaridad'])
            else:
                odsTopOrder[data['ods']] = int(data['Similaridad'])
    odsTopOrder = list(odsTopOrder.items())
    odsTopOrder.sort(key = lambda x: x[1], reverse = True)
    #change format
    ods = []
    for numero, cantidad in odsTopOrder:
        ods.append([numero, cantidad])
    return ods
#-----------------------------------------------------------------------------------------------------
def topicData(lda_model,numberOfTopics,simmilarity, data_ready, moreInsights):
    data_flat = [w for w_list in data_ready for w in w_list]
    counter = Counter(data_flat)
    moreDataPointer = 0
    i=1
    json_data = []
    for topic, words in lda_model.show_topics(formatted=False, num_topics=numberOfTopics):
        listOfTopic = []
        histogram = [['Palabra','Frecuencia','Importancia']]
        infoCompleta = []
        for word, value in words:
            word_count = counter[word]
            listOfTopic.append({"text": word,"value":1})
            infoCompleta.append({"word":word, 'Importancia':float(value*2000), 'Frecuencia':word_count})
            histogram.append([word,word_count, float(value*2000)])
        lista = []
        for t in simmilarity:
            if t['topico']=='Tema'+str(topic+1):
                for data in t['SimilaridadOds']:
                    lista.append([data['ods'],data['Similaridad']])
        lista.sort(key = lambda x: x[1], reverse = True)
        odsRelacionado = lista[0][0]
        odsComplementario = lista[1][0]
        json_data.append({"name":"Tema "+str(topic+1),'infoCompleta':infoCompleta,"words":listOfTopic,"ods":odsRelacionado, "sexo":moreInsights[moreDataPointer]['sexo'], 'edades': moreInsights[moreDataPointer]['edades'], "odsComplementario": odsComplementario,'histogram':histogram}) 
        moreDataPointer+=1
        i+=1
    json_result = json.dumps(json_data, default=json_util.default)
    with open('../frontend/src/ModelResults/dataPerTopic.json', "w") as outfile:
        outfile.write(json_result)
#-----------------------------------------------------------------------------------------------------
def getChord(frequency,simmilarity):
    frequency=frequency[:6]
    names = []
    dataForODS = {}
    for ods, quatity in frequency:
        names.append(ods)
    for data in simmilarity:
        for row in data['SimilaridadOds']:
            if row['ods'] in names and row['Similaridad'] > 1:
                if row['ods'] in dataForODS:
                    dataForODS[row['ods']].append(data['topico'])
                else:
                    dataForODS[row['ods']] = [data['topico']]
    chordData = []
    nameData = []
    for names, temas in dataForODS.items():
        nameData.append('ODS'+str(names))
        array = [int(temaname[temaname.find('a')+1:]) for temaname in temas]
        if len(array) > 8: array = array[:8]
        if len(array) < 8: array = array + ([0]*(8-len(array)))
        chordData.append(array)
    json_result = json.dumps(chordData, default=json_util.default)
    with open('../frontend/src/ModelResults/chordData.json', "w") as outfile:
        outfile.write(json_result)
    json_result = json.dumps(nameData, default=json_util.default)
    with open('../frontend/src/ModelResults/chordNames.json', "w") as outfile:
        outfile.write(json_result)
#-----------------------------------------------------------------------------------------------------
def swarnData(lda_model,numberOfTopics):
    topicsDictWords = []
    i=1
    swarnNames = []
    for topic, words in lda_model.show_topics(formatted=False, num_topics=numberOfTopics):
        swarnNames.append('Tema'+str(topic+1))
        for word, value in words:
            topicsDictWords.append({"group":'Tema'+str(topic+1),"id":word,"value":int(value*100),"volume":int(value*100)})
        i+=1
    json_result = json.dumps(swarnNames, default=json_util.default)
    with open('../frontend/src/ModelResults/swarnNames.json', "w") as outfile:
        outfile.write(json_result)
    json_result = json.dumps(topicsDictWords, default=json_util.default)
    with open('../frontend/src/ModelResults/swarnData.json', "w") as outfile:
        outfile.write(json_result)
#-----------------------------------------------------------------------------------------------------
def topicODSWeight(simmilarity):
    dataBars = []
    keysNames = set()
    for data in simmilarity:
        odsResults = {'Temas': data['topico']}
        for odsDetails in data['SimilaridadOds']:
            keysNames.add(str(odsDetails['ods']))
            odsResults[str(odsDetails['ods'])] = int(odsDetails['Similaridad'])
        dataBars.append(odsResults)
    keysNames = list(keysNames)
    json_result = json.dumps(dataBars, default=json_util.default)
    with open('../frontend/src/ModelResults/odsTopicPercentage.json', "w") as outfile:
        outfile.write(json_result)
    json_result = json.dumps(keysNames, default=json_util.default)
    with open('../frontend/src/ModelResults/odsTopicPercentageKeys.json', "w") as outfile:
        outfile.write(json_result)
#-----------------------------------------------------------------------------------------------------

def limpiezaDiccionario(odsDictWords):
    if 'animal' in odsDictWords[2]: odsDictWords[2].remove('animal')
    if 'animales' in odsDictWords[2]: odsDictWords[2].remove('animales')
    if 'clima' in odsDictWords[2]: odsDictWords[2].remove('clima')
    if 'animales' in odsDictWords[2]: odsDictWords[2].remove('animales')
    if 'cara' in odsDictWords[2]: odsDictWords[2].remove('cara')
    if 'agua' in odsDictWords[5]: odsDictWords[5].remove('agua')
    if 'asistencia' in odsDictWords[5]: odsDictWords[5].remove('asistencia')
    if 'bono' in odsDictWords[5]: odsDictWords[5].remove('bono')
    if 'animales' in odsDictWords[5]: odsDictWords[5].remove('animales')
    odsDictWords[5].union(set(['violar','violación','violaciones','golpear','robo,mujer','maltratar','calmar','sexualidad','mujeres','lgtbi','aborto','mujer','embarazo','embarazos','violencia','violentar','violentar','violencia']))
    if 'drogas' in odsDictWords[8]: odsDictWords[8].remove('drogas')
    if 'ambiental' in odsDictWords[8]: odsDictWords[8].remove('ambiental')
    if 'violencia' in odsDictWords[8]: odsDictWords[8].remove('violencia')
    if 'perros' in odsDictWords[12]: odsDictWords[12].remove('perros')   
    if 'perro' in odsDictWords[12]: odsDictWords[12].remove('perro') 
    if 'empleo' in odsDictWords[11]: odsDictWords[11].remove('empleo') 
    if 'empleo' in odsDictWords[16]: odsDictWords[16].remove('empleo') 
    if 'empleo' in odsDictWords[3]: odsDictWords[3].remove('empleo')    
    if 'desempleo' in odsDictWords[11]: odsDictWords[11].remove('desempleo') 
    if 'desempleo' in odsDictWords[16]: odsDictWords[16].remove('desempleo') 
    if 'desempleo' in odsDictWords[3]: odsDictWords[3].remove('desempleo')
    odsDictWords[8].union(set(['animal','animales','perro','perros',]))
    odsDictWords[8].union(set(['educación']))
    odsDictWords[11].union(set(['parquear','vehiculo','vehiculos']))
    odsDictWords[11].union(set(['ofreciendole','drogar','peligrar,venta,drogar,pegar']))
    odsDictWords[16].union(set(['golpear','calmar','miedo','peligrar','violencia','violentar','violentar','violencia']))
    return odsDictWords
#-----------------------------------------------------------------------------------------------------
def dominant():
    def format_topics_sentences(ldamodel, corpus, texts):
        # Init output
        sent_topics_df = pd.DataFrame()
        # Get main topic in each document
        for i, row_list in enumerate(ldamodel[corpus]):
            row = row_list[0] if ldamodel.per_word_topics else row_list            
            # print(row)
            row = sorted(row, key=lambda x: (x[1]), reverse=True)
            
            # Get the Dominant topic, Perc Contribution and Keywords for each document
            for j, (topic_num, prop_topic) in enumerate(row):
                if j == 0:  # => dominant topic
                    wp = ldamodel.show_topic(topic_num)
                    topic_keywords = ", ".join([word for word, prop in wp])
                    sent_topics_df = sent_topics_df.append(pd.Series([int(topic_num), round(prop_topic,4), topic_keywords]), ignore_index=True)
                else:
                    break
        sent_topics_df.columns = ['Dominant_Topic', 'Perc_Contribution', 'Topic_Keywords']
    
        # Add original text to the end of the output
        contents = pd.Series(texts)
        sexoSerie = df['sexo']
        rangoEdadSerie = df['rangoEdad']
        sent_topics_df = pd.concat([sent_topics_df, sexoSerie, rangoEdadSerie, contents], axis=1)
        return(sent_topics_df)
    df_topic_sents_keywords = format_topics_sentences(lda_model, corpus, data_ready)
    # Format
    df_dominant_topic = df_topic_sents_keywords.reset_index()
    
    df_dominant_topic.columns = ['Document_No', 'Dominant_Topic', 'Topic_Perc_Contrib', 'Keywords', 'Sexo','rangoEdad','Text']
    doc_lens = [['ODS','Length']]
    for d in df_dominant_topic.Text:
        if type(d)==list:
            doc_lens.append([' ', len(d)])
        else:
            doc_lens.append([' ', 0])
    json_result = json.dumps(doc_lens, default=json_util.default)
    with open('../frontend/src/ModelResults/histogram.json', "w") as outfile:
        outfile.write(json_result)
    return df_dominant_topic
#-----------------------------------------------------------------------------------------------------     
def moreTopicInsights(dominantData):
    groupsByTopic = dominantData.groupby(['Dominant_Topic'])
    generos = df['sexo'].value_counts()
    mujerCount = generos[0]
    hombreCount = generos[1]
    print(mujerCount,hombreCount)
    topicData = []
    i = 0
    for row in groupsByTopic:
        topic = 'Tema '+ str(i+1)
        countsSexo = row[1]['Sexo'].value_counts()
        countsRangoEdad = row[1]['rangoEdad'].value_counts()
        countsEdad = []
        for edad, cantidad in countsRangoEdad.iteritems():
            countsEdad.append([edad,cantidad])
        countsEdad.sort(key = lambda x: x[0])
        sexos = []
        for genero, cantidad in countsSexo.iteritems():
            if genero == 'Mujer':
                sexos.append({"sexoNombre": genero, "value": int((cantidad/mujerCount)*10000)})
            elif genero == 'Hombre':
                sexos.append({"sexoNombre": genero, "value": int((cantidad/hombreCount)*10000)})
        topicData.append({'topic':topic, 'sexo':sexos, 'edades': countsEdad})
        i+=1
        
    return topicData
#-----------------------------------------------------------------------------------------------------     
def encontrarODSTopico(lda_model,id2word):
    def topicsWithNewQueriesODS(new_doc, ldamodel):
        new_doc = process(new_doc)
        for texts in new_doc[0]:
            for text in texts:
                print(text)
            new_doc_bow = [id2word.doc2bow(texts)]
            topics = ldamodel.get_document_topics(new_doc_bow)
            for probabilities in topics:
                probabilities.sort(key = lambda x : x[1], reverse=True)
                print(lda_model.print_topic(probabilities[0][0]))
                print(probabilities)
    def relaciónDeOds(lda_model,id2word):
        new_doc = {'respuesta':['erradicar la pobreza extrema para todas las personas en el mundo','La delincuencia y drogadicción son un problema']}
        df = pd.DataFrame(new_doc)
        topicsWithNewQueriesODS(df, lda_model)
    relaciónDeOds(lda_model,id2word)

if __name__ == "__main__":
    df = pd.read_pickle("./processedData.pkl")
    
    new_data = []
    with open('data_ready.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        for row in spamreader:
            new_data.append(row)
    data_ready = []
    for d in new_data:
        for a in d:
            data_ready.append(a.split(','))
    lda_model, corpus, id2word = LDAModel(df,numberOfTopics,data_ready)
    print('{"success": false, "message": "Modelo construido"}')
    topicsDictWords = createDictForTopics(lda_model, numberOfTopics)
    odsDictWords = createDictForOds(df)
    odsDictWords = limpiezaDiccionario(odsDictWords)
    simmilarity = simmilarityOdsandTopics(topicsDictWords, odsDictWords)
    frequency = frequentODS(simmilarity)
    print('{"success": false, "message": "Relación con ODSs Lista"}')
    dominantData = dominant()
    print('{"success": false, "message": "Dominantes Listo"}')
    moreInsights = moreTopicInsights(dominantData)
    storeGeneralInsight(df, frequency)
    sankeyFile(lda_model,numberOfTopics)
    topicData(lda_model,numberOfTopics,simmilarity, data_ready, moreInsights)
    getChord(frequency,simmilarity)
    swarnData(lda_model,numberOfTopics)
    topicODSWeight(simmilarity)
    print('{"success": false, "message": "Datos en front"}')
