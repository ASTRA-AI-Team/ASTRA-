##### **Defining problem statement for LLM RAG:**

##### 

##### 1\. **identifying data source**: what kind of data it will access? pdfs, manuals, what??

##### 

##### 2\. **identifying user/persona**: who will use the tool?? e.g. teachers, agents, students, etc..

##### 

##### 3\. **objectives/goals** (success metrics of what must be achieved by the end i.e. kind of answer or response generation we are assuming against a query or question) it includes the following parameters:

##### 

* #####  	Retrieval Precision: did it find the respective thing from the right pdf?
* #####  	Answer Correctness: is the answer correct on the basis of the question?
* #####  	Latency: how much time does it take to generate the response?(is it a acceptable timeframe?)
* #####  	Hallucination rate?: How often the model invents info by itself

###### 

###### **Example for the problem statement :**

###### "Our customer service team takes too long to answer technical questions about product specifications (30+ minutes), leading to high customer churn. We need a RAG-based chatbot that can ingest our 500-page product manual (PDFs) and provide instant, accurate answers with citations to the specific page, reducing search time to under 1 minute".

##### 

##### **example of mine for our problem statement:**

##### **Informal Version:**

##### "The admission process of the Polytechnic students is confusing for the students and tiring for the faculty which disturbs the regular students as their lectures are skipped due to the busy faculty of theirs. We need a RAG- based chatbot that not only generates responses to the confused students but also it must be bilingual for effective communication for a state like Maharashtra. it has tts and stt facilities for text to speech and vice versa conversion."



##### **Technical Version:(non chatgpt)--I've used a formalizer for this conversions from informal to respective versions mentioned.**

##### The admission process for Polytechnic students is convoluted for applicants and burdensome for faculty, resulting in disruption to regular students' coursework due to faculty workload. An AI-powered chatbot utilizing a Retrieval-Augmented Generation (RAG) framework is required to provide accurate responses to applicant inquiries. The chatbot must support bilingual functionality to facilitate effective communication within the multilingual context of Maharashtra. Additionally, it should integrate Text-to-Speech (TTS) and Speech-to-Text (STT) capabilities for multimodal interaction.



#### **Formal Version:(non chatgpt)**

##### The admission process for Polytechnic students is confusing for the students and burdensome for the faculty, which disrupts the regular academic schedule as faculty members are frequently occupied. It is necessary to develop a RAG-based chatbot that not only provides responses to students seeking clarification but also supports bilingual communication to ensure effective interaction in a state such as Maharashtra. The chatbot should also incorporate text-to-speech (TTS) and speech-to-text (STT) functionalities to facilitate seamless conversion between text and spoken language.

#### 

#### **ChatGPT Version:**

#### **--more formal one:**

##### The Polytechnic admission process is complex and often confusing for students, resulting in frequent queries that increase the workload of faculty and disrupt academic activities. To address this, a RAG-based chatbot is required to provide accurate and consistent admission-related information. The system should support bilingual communication for a state like Maharashtra and include text-to-speech and speech-to-text features to enable seamless voice and text interaction.

#### 

#### **--more technical one:**

##### The Polytechnic admission process generates a high volume of repetitive student queries, increasing administrative overhead for faculty and affecting academic efficiency. A Retrieval-Augmented Generation (RAG)–based chatbot is proposed to deliver accurate, context-aware admission information. The system will support bilingual interaction and integrate speech-to-text (STT) and text-to-speech (TTS) modules to enable multimodal user interaction.



##### **Conclusion:** *As per my preference, i would say the technical one using the formalizer did a great job and the more formal one in the chatgpt version. Tell me if the parameters must be changed for the statement and also which one you prefer!*



##### 

