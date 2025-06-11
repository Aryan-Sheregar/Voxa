from langchain_community.embeddings import OllamaEmbeddings
from langchain.vectorstores import Chroma

def create_vectorstore(docs, persist_dir="./chroma_db"):
    embedding = OllamaEmbeddings(model="llama3")
    vectorstore = Chroma.from_documents(docs, embedding, persist_directory=persist_dir)
    vectorstore.persist()
    return vectorstore

def get_vectorstore(persist_dir="./chroma_db"):
    embedding = OllamaEmbeddings(model="llama3")
    return Chroma(persist_directory=persist_dir, embedding_function=embedding)