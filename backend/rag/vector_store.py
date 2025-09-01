from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

def create_vectorstore(docs, persist_dir="./chroma_db"):
    embedding = OllamaEmbeddings(model="llama3.1")
    vectorstore = Chroma.from_documents(docs, embedding, persist_directory=persist_dir)
    return vectorstore

def get_vectorstore(persist_dir="./chroma_db"):
    embedding = OllamaEmbeddings(model="llama3.1")
    return Chroma(persist_directory=persist_dir, embedding_function=embedding)