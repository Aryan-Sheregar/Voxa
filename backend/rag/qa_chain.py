from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from .vector_store import get_vectorstore

SYSTEM_PROMPT = """You are an expert planner and problem-solver. Your goal is to assist the user in organizing their day and overcoming challenges.

Based on the user's request and the provided context, perform the following steps:
1. Identify the user's primary goals and a list of tasks.
2. Prioritize the tasks based on urgency and importance.
3. Suggest an estimated duration for each task.
4. If the request implies a problem or a challenge, provide a clear, actionable solution or a strategic approach to address it.
5. Format your response as a structured, clear plan.
"""

def get_rag_chain():
    vectorstore = get_vectorstore()
    retriever = vectorstore.as_retriever()
    
    # Create the LLM instance
    llm = OllamaLLM(model="llama3.1")
    
    # Define the prompt template with a system prompt and a placeholder for the user query
    prompt_template = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT),
            ("user", "{query}"),
        ]
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=True
    )
    # ADD LCEL later :D 
    return qa_chain