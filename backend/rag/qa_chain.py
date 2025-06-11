from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama
from .vector_store import get_vectorstore

def get_rag_chain():
    vectorstore = get_vectorstore()
    retriever = vectorstore.as_retriever()

    llm = Ollama(model="llama3")

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=True
    )
    return qa_chain