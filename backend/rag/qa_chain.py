from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_ollama import ChatOllama


def get_rag_chain(vectorstore):
    retriever = vectorstore.as_retriever()
    llm = ChatOllama(model="gemma3:12b", temperature=0)

    template = """You are a helpful AI assistant that creates structured task plans based on user requests and relevant context.

Context: {context}

User Query: {query}

Based on the context and query, create a detailed task plan in JSON format with the following structure:
{{
    "tasks": [
        {{
            "title": "Task title",
            "description": "Detailed description",
            "priority": 1-5 (1 being highest),
            "time_estimate": "estimated time (e.g., '30 mins', '2 hours')"
        }}
    ]
}}

Ensure the response is valid JSON only, with no additional text."""

    prompt = ChatPromptTemplate.from_template(template)

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "query": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    return rag_chain
